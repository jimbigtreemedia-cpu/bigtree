<?php
declare(strict_types=1);

final class NewsletterStore
{
    private string $baseDir;
    private string $recordsDir;
    private string $indexPath;
    private string $rateLimitPath;
    private string $lockPath;
    private int $rateLimitWindowSeconds;
    private int $maxRateLimitEntries;

    public function __construct(array $options = [])
    {
        $submissionsRoot = dirname(__DIR__) . DIRECTORY_SEPARATOR . "submissions";
        $this->baseDir = $options["base_dir"] ?? $submissionsRoot . DIRECTORY_SEPARATOR . "newsletter";
        $this->recordsDir = $this->baseDir . DIRECTORY_SEPARATOR . "records";
        $this->indexPath = $this->baseDir . DIRECTORY_SEPARATOR . "index.json";
        $this->rateLimitPath = $this->baseDir . DIRECTORY_SEPARATOR . "rate-limit.json";
        $this->lockPath = $this->baseDir . DIRECTORY_SEPARATOR . ".lock";
        $this->rateLimitWindowSeconds = max(1, (int) ($options["rate_limit_window_seconds"] ?? 15));
        $this->maxRateLimitEntries = max(100, (int) ($options["max_rate_limit_entries"] ?? 5000));

        $this->ensureDir($submissionsRoot);
        $this->ensureDir($this->baseDir);
        $this->ensureDir($this->recordsDir);
        $this->ensureFile($this->indexPath, [
            "emails" => [],
            "updatedAtUtc" => gmdate("Y-m-d H:i:s") . " UTC"
        ]);
        $this->ensureFile($this->rateLimitPath, []);
    }

    public function subscribe(string $email, string $source, array $server): array
    {
        $normalizedEmail = $this->normalizeEmail($email);
        $source = $this->sanitizeLine($source, 80);
        if ($source === "") {
            $source = "footer";
        }

        $ipAddress = $this->sanitizeLine((string) ($server["REMOTE_ADDR"] ?? "unknown"), 80);
        $userAgent = $this->sanitizeLine((string) ($server["HTTP_USER_AGENT"] ?? "unknown"), 500);
        $ipKey = hash("sha256", strtolower($ipAddress) . "|snapiums-newsletter-rate");
        $ipFingerprint = substr(hash("sha256", strtolower($ipAddress) . "|snapiums-newsletter-fingerprint"), 0, 24);

        return $this->withLock(function () use ($normalizedEmail, $source, $ipAddress, $userAgent, $ipKey, $ipFingerprint): array {
            $index = $this->readJsonFile($this->indexPath, [
                "emails" => [],
                "updatedAtUtc" => gmdate("Y-m-d H:i:s") . " UTC"
            ]);

            if (!is_array($index["emails"] ?? null)) {
                $index["emails"] = [];
            }

            $existing = $index["emails"][$normalizedEmail] ?? null;
            if (is_array($existing)) {
                return [
                    "status" => "already_subscribed",
                    "email" => $normalizedEmail,
                    "id" => (string) ($existing["id"] ?? ""),
                    "subscribedAtUtc" => (string) ($existing["subscribedAtUtc"] ?? "")
                ];
            }

            $this->enforceRateLimit($ipKey);

            $id = $this->createId();
            $subscribedAtUtc = gmdate("Y-m-d H:i:s") . " UTC";
            $record = [
                "id" => $id,
                "email" => $normalizedEmail,
                "source" => $source,
                "subscribedAtUtc" => $subscribedAtUtc,
                "ipAddress" => $ipAddress,
                "ipFingerprint" => $ipFingerprint,
                "userAgent" => $userAgent
            ];

            $recordPath = $this->recordsDir . DIRECTORY_SEPARATOR . $id . ".json";
            $recordJson = json_encode($record, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            if ($recordJson === false) {
                throw new RuntimeException("Failed to encode newsletter record.");
            }
            $this->atomicWrite($recordPath, $recordJson . PHP_EOL);

            $index["emails"][$normalizedEmail] = [
                "id" => $id,
                "source" => $source,
                "subscribedAtUtc" => $subscribedAtUtc
            ];
            $index["updatedAtUtc"] = gmdate("Y-m-d H:i:s") . " UTC";
            $indexJson = json_encode($index, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
            if ($indexJson === false) {
                throw new RuntimeException("Failed to update newsletter index.");
            }
            $this->atomicWrite($this->indexPath, $indexJson . PHP_EOL);

            return [
                "status" => "subscribed",
                "email" => $normalizedEmail,
                "id" => $id,
                "subscribedAtUtc" => $subscribedAtUtc
            ];
        });
    }

    public function listSubscribers(int $limit = 200): array
    {
        $limit = max(1, min($limit, 5000));
        $files = glob($this->recordsDir . DIRECTORY_SEPARATOR . "*.json") ?: [];
        usort($files, static fn(string $a, string $b): int => filemtime($b) <=> filemtime($a));

        $result = [];
        foreach (array_slice($files, 0, $limit) as $path) {
            $id = pathinfo($path, PATHINFO_FILENAME);
            if (!$this->isValidId($id)) {
                continue;
            }

            $record = $this->readRecord($path);
            $result[] = [
                "id" => $id,
                "email" => (string) ($record["email"] ?? ""),
                "source" => (string) ($record["source"] ?? ""),
                "subscribedAtUtc" => (string) ($record["subscribedAtUtc"] ?? gmdate("Y-m-d H:i:s", (int) filemtime($path)) . " UTC"),
                "ipAddress" => (string) ($record["ipAddress"] ?? ""),
                "ipFingerprint" => (string) ($record["ipFingerprint"] ?? ""),
                "downloadName" => basename($path)
            ];
        }

        return $result;
    }

    public function viewSubscriber(string $id): array
    {
        $id = $this->validateId($id);
        $path = $this->recordsDir . DIRECTORY_SEPARATOR . $id . ".json";
        if (!is_file($path)) {
            throw new InvalidArgumentException("Newsletter subscription not found.");
        }

        $record = $this->readRecord($path);
        $raw = (string) file_get_contents($path);

        return [
            "id" => $id,
            "email" => (string) ($record["email"] ?? ""),
            "source" => (string) ($record["source"] ?? ""),
            "subscribedAtUtc" => (string) ($record["subscribedAtUtc"] ?? gmdate("Y-m-d H:i:s", (int) filemtime($path)) . " UTC"),
            "ipAddress" => (string) ($record["ipAddress"] ?? ""),
            "ipFingerprint" => (string) ($record["ipFingerprint"] ?? ""),
            "userAgent" => (string) ($record["userAgent"] ?? ""),
            "rawText" => $raw,
            "downloadName" => basename($path)
        ];
    }

    public function getSubscriberDownload(string $id): array
    {
        $id = $this->validateId($id);
        $path = $this->recordsDir . DIRECTORY_SEPARATOR . $id . ".json";
        if (!is_file($path)) {
            throw new InvalidArgumentException("Newsletter subscription not found.");
        }

        return [
            "path" => $path,
            "downloadName" => basename($path),
            "contentType" => "application/json; charset=utf-8"
        ];
    }

    private function enforceRateLimit(string $ipKey): void
    {
        $now = time();
        $minTimestamp = $now - $this->rateLimitWindowSeconds;

        $entries = $this->readJsonFile($this->rateLimitPath, []);
        if (!is_array($entries)) {
            $entries = [];
        }

        $cleanEntries = [];
        foreach ($entries as $key => $timestamp) {
            if (!is_string($key)) {
                continue;
            }
            $value = is_int($timestamp) ? $timestamp : (is_numeric($timestamp) ? (int) $timestamp : 0);
            if ($value >= $minTimestamp) {
                $cleanEntries[$key] = $value;
            }
        }

        $lastSeen = isset($cleanEntries[$ipKey]) ? (int) $cleanEntries[$ipKey] : 0;
        if ($lastSeen !== 0 && ($now - $lastSeen) < $this->rateLimitWindowSeconds) {
            throw new InvalidArgumentException("Too many requests. Please wait a moment and try again.");
        }

        $cleanEntries[$ipKey] = $now;

        if (count($cleanEntries) > $this->maxRateLimitEntries) {
            arsort($cleanEntries);
            $cleanEntries = array_slice($cleanEntries, 0, $this->maxRateLimitEntries, true);
        }

        $json = json_encode($cleanEntries, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new RuntimeException("Failed to update newsletter rate limiter.");
        }

        $this->atomicWrite($this->rateLimitPath, $json . PHP_EOL);
    }

    private function normalizeEmail(string $email): string
    {
        $candidate = strtolower(trim($email));
        if ($candidate === "") {
            throw new InvalidArgumentException("Email is required.");
        }
        if (strlen($candidate) > 320) {
            throw new InvalidArgumentException("Email exceeds allowed length.");
        }
        if (!filter_var($candidate, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Please provide a valid email address.");
        }
        return $candidate;
    }

    private function validateId(string $id): string
    {
        $id = trim($id);
        if (!$this->isValidId($id)) {
            throw new InvalidArgumentException("Invalid subscription ID.");
        }
        return $id;
    }

    private function isValidId(string $id): bool
    {
        return preg_match('/^[0-9]{8}-[0-9]{6}-[a-f0-9]{6}$/', $id) === 1;
    }

    private function sanitizeLine(string $value, int $maxLength = 200): string
    {
        $clean = preg_replace('/\s+/', ' ', trim($value));
        $clean = $clean ?? "";
        if (mb_strlen($clean) > $maxLength) {
            return mb_substr($clean, 0, $maxLength);
        }
        return $clean;
    }

    private function createId(): string
    {
        return gmdate("Ymd-His") . "-" . substr(bin2hex(random_bytes(4)), 0, 6);
    }

    private function ensureDir(string $path): void
    {
        if (!is_dir($path) && !mkdir($path, 0755, true) && !is_dir($path)) {
            throw new RuntimeException("Unable to create directory: {$path}");
        }
    }

    private function ensureFile(string $path, array $default): void
    {
        if (is_file($path)) {
            return;
        }
        $json = json_encode($default, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new RuntimeException("Failed to initialize newsletter store file.");
        }
        $this->atomicWrite($path, $json . PHP_EOL);
    }

    private function readJsonFile(string $path, array $fallback): array
    {
        if (!is_file($path)) {
            return $fallback;
        }

        $raw = file_get_contents($path);
        if ($raw === false || trim($raw) === "") {
            return $fallback;
        }

        try {
            $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException("Invalid JSON in newsletter store.", 0, $exception);
        }

        if (!is_array($decoded)) {
            return $fallback;
        }

        return $decoded;
    }

    private function readRecord(string $path): array
    {
        if (!is_file($path)) {
            throw new RuntimeException("Newsletter record file not found.");
        }

        $raw = file_get_contents($path);
        if ($raw === false || trim($raw) === "") {
            throw new RuntimeException("Newsletter record is unreadable.");
        }

        try {
            $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException("Invalid JSON in newsletter record.", 0, $exception);
        }

        if (!is_array($decoded)) {
            throw new RuntimeException("Newsletter record has invalid structure.");
        }

        return $decoded;
    }

    private function atomicWrite(string $path, string $contents): void
    {
        $tempPath = $path . ".tmp";
        if (file_put_contents($tempPath, $contents, LOCK_EX) === false) {
            throw new RuntimeException("Failed to write temporary file.");
        }

        if (!@rename($tempPath, $path)) {
            if (is_file($path) && !@unlink($path)) {
                @unlink($tempPath);
                throw new RuntimeException("Failed to replace target file.");
            }
            if (!@rename($tempPath, $path)) {
                @unlink($tempPath);
                throw new RuntimeException("Failed to finalize file write.");
            }
        }
    }

    private function withLock(callable $callback): array
    {
        $handle = fopen($this->lockPath, "c+");
        if ($handle === false) {
            throw new RuntimeException("Failed to open newsletter lock file.");
        }

        try {
            if (!flock($handle, LOCK_EX)) {
                throw new RuntimeException("Failed to acquire newsletter lock.");
            }

            $result = $callback();
            if (!is_array($result)) {
                throw new RuntimeException("Newsletter lock callback returned invalid result.");
            }

            return $result;
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }
}
