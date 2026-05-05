<?php
declare(strict_types=1);

final class DataStore
{
    private string $dataJsonPath;
    private string $dataJsPath;
    private string $backupDir;
    private string $lockFilePath;
    private int $maxBackups;

    public function __construct(array $options = [])
    {
        $projectRoot = dirname(__DIR__, 2);

        $this->dataJsonPath = $options["data_json_path"] ?? $projectRoot . DIRECTORY_SEPARATOR . "data-store.json";
        $this->dataJsPath = $options["data_js_path"] ?? $projectRoot . DIRECTORY_SEPARATOR . "data.js";
        $this->backupDir = $options["backup_dir"] ?? dirname(__DIR__) . DIRECTORY_SEPARATOR . "backups";
        $this->lockFilePath = $this->dataJsonPath . ".lock";
        $this->maxBackups = max(1, (int) ($options["max_backups"] ?? 30));
    }

    public function get(string $path = ""): mixed
    {
        $segments = $this->parsePath($path);

        return $this->withLock(LOCK_SH, function () use ($segments) {
            $data = $this->readRawData();

            if ($segments === []) {
                return $data;
            }

            return $this->readAtPath($data, $segments);
        });
    }

    public function add(string $path, mixed $value, ?string $key = null, bool $createMissing = false): array
    {
        $segments = $this->parsePath($path);

        return $this->mutate(function (array &$data) use ($segments, $value, $key, $createMissing): array {
            $target =& $this->resolvePathReference($data, $segments, $createMissing);

            if (!is_array($target)) {
                throw new InvalidArgumentException("Path target must be an object or array.");
            }

            if ($this->isList($target)) {
                if ($key === null || $key === "") {
                    $target[] = $value;
                    $insertedSegments = [...$segments, (string) (count($target) - 1)];

                    return [
                        "path" => $this->joinPath($insertedSegments),
                        "value" => $value
                    ];
                }

                if (!$this->isIntegerString($key)) {
                    throw new InvalidArgumentException("Array insertion key must be a non-negative integer string.");
                }

                $index = (int) $key;
                $count = count($target);
                if ($index < 0 || $index > $count) {
                    throw new InvalidArgumentException("Array insertion index is out of range.");
                }

                array_splice($target, $index, 0, [$value]);
                $insertedSegments = [...$segments, (string) $index];

                return [
                    "path" => $this->joinPath($insertedSegments),
                    "value" => $value
                ];
            }

            if ($key === null || $key === "") {
                throw new InvalidArgumentException("Object insertion requires a non-empty key.");
            }

            if (array_key_exists($key, $target)) {
                throw new InvalidArgumentException("Key '{$key}' already exists. Use PUT to replace it.");
            }

            $target[$key] = $value;
            $insertedSegments = [...$segments, $key];

            return [
                "path" => $this->joinPath($insertedSegments),
                "value" => $value
            ];
        });
    }

    public function replace(string $path, mixed $value, bool $createMissing = false): mixed
    {
        $segments = $this->parsePath($path);

        return $this->mutate(function (array &$data) use ($segments, $value, $createMissing): mixed {
            if ($segments === []) {
                if (!is_array($value)) {
                    throw new InvalidArgumentException("Root replacement value must be a JSON object or array.");
                }

                $data = $value;
                return $data;
            }

            $parentSegments = array_slice($segments, 0, -1);
            $lastSegment = (string) $segments[count($segments) - 1];
            $parent =& $this->resolvePathReference($data, $parentSegments, $createMissing);

            if (!is_array($parent)) {
                throw new InvalidArgumentException("Parent path does not resolve to an object or array.");
            }

            if ($this->isList($parent)) {
                if (!$this->isIntegerString($lastSegment)) {
                    throw new InvalidArgumentException("Array path segment must be numeric.");
                }

                $index = (int) $lastSegment;
                $count = count($parent);

                if (array_key_exists($index, $parent)) {
                    $parent[$index] = $value;
                    return $value;
                }

                if ($createMissing && $index === $count) {
                    $parent[] = $value;
                    return $value;
                }

                throw new InvalidArgumentException("Array index '{$index}' does not exist.");
            }

            if (!array_key_exists($lastSegment, $parent) && !$createMissing) {
                throw new InvalidArgumentException("Object key '{$lastSegment}' does not exist.");
            }

            $parent[$lastSegment] = $value;
            return $value;
        });
    }

    public function remove(string $path): mixed
    {
        $segments = $this->parsePath($path);
        if ($segments === []) {
            throw new InvalidArgumentException("Root cannot be removed.");
        }

        return $this->mutate(function (array &$data) use ($segments): mixed {
            $parentSegments = array_slice($segments, 0, -1);
            $lastSegment = (string) $segments[count($segments) - 1];
            $parent =& $this->resolvePathReference($data, $parentSegments, false);

            if (!is_array($parent)) {
                throw new InvalidArgumentException("Parent path does not resolve to an object or array.");
            }

            if ($this->isList($parent)) {
                if (!$this->isIntegerString($lastSegment)) {
                    throw new InvalidArgumentException("Array path segment must be numeric.");
                }

                $index = (int) $lastSegment;
                if (!array_key_exists($index, $parent)) {
                    throw new InvalidArgumentException("Array index '{$index}' does not exist.");
                }

                $removedValue = $parent[$index];
                array_splice($parent, $index, 1);
                return $removedValue;
            }

            if (!array_key_exists($lastSegment, $parent)) {
                throw new InvalidArgumentException("Object key '{$lastSegment}' does not exist.");
            }

            $removedValue = $parent[$lastSegment];
            unset($parent[$lastSegment]);
            return $removedValue;
        });
    }

    private function mutate(callable $mutator): mixed
    {
        return $this->withLock(LOCK_EX, function () use ($mutator) {
            $data = $this->readRawData();
            $result = $mutator($data);

            if (!is_array($data)) {
                throw new RuntimeException("Datastore root is invalid after mutation.");
            }

            $this->writeRawData($data);
            return $result;
        });
    }

    private function parsePath(string $path): array
    {
        $normalized = trim($path);
        $normalized = trim($normalized, "/");
        if ($normalized === "") {
            return [];
        }

        $segments = explode("/", $normalized);
        $parsed = [];

        foreach ($segments as $segment) {
            if ($segment === "") {
                throw new InvalidArgumentException("Path contains an empty segment.");
            }

            $parsed[] = rawurldecode($segment);
        }

        return $parsed;
    }

    private function joinPath(array $segments): string
    {
        if ($segments === []) {
            return "";
        }

        return implode("/", array_map(static fn($segment): string => (string) $segment, $segments));
    }

    private function readAtPath(array $data, array $segments): mixed
    {
        $value = $data;

        foreach ($segments as $segment) {
            if (!is_array($value)) {
                throw new InvalidArgumentException("Path does not resolve to a valid value.");
            }

            if ($this->isList($value)) {
                if (!$this->isIntegerString((string) $segment)) {
                    throw new InvalidArgumentException("Array path segment must be numeric.");
                }

                $index = (int) $segment;
                if (!array_key_exists($index, $value)) {
                    throw new InvalidArgumentException("Array index '{$index}' does not exist.");
                }

                $value = $value[$index];
                continue;
            }

            $key = (string) $segment;
            if (!array_key_exists($key, $value)) {
                throw new InvalidArgumentException("Object key '{$key}' does not exist.");
            }

            $value = $value[$key];
        }

        return $value;
    }

    private function &resolvePathReference(array &$data, array $segments, bool $createMissing): mixed
    {
        $cursor =& $data;

        foreach ($segments as $segment) {
            if (!is_array($cursor)) {
                throw new InvalidArgumentException("Path traverses through a non-container value.");
            }

            if ($this->isList($cursor)) {
                $segmentString = (string) $segment;
                if (!$this->isIntegerString($segmentString)) {
                    throw new InvalidArgumentException("Array path segment must be numeric.");
                }

                $index = (int) $segmentString;
                $count = count($cursor);

                if (!array_key_exists($index, $cursor)) {
                    if (!$createMissing || $index !== $count) {
                        throw new InvalidArgumentException("Array index '{$index}' does not exist.");
                    }

                    $cursor[] = [];
                }

                $cursor =& $cursor[$index];
                continue;
            }

            $key = (string) $segment;
            if (!array_key_exists($key, $cursor)) {
                if (!$createMissing) {
                    throw new InvalidArgumentException("Object key '{$key}' does not exist.");
                }

                $cursor[$key] = [];
            }

            $cursor =& $cursor[$key];
        }

        return $cursor;
    }

    private function readRawData(): array
    {
        if (!is_file($this->dataJsonPath)) {
            throw new RuntimeException("Data source file not found: {$this->dataJsonPath}");
        }

        $raw = file_get_contents($this->dataJsonPath);
        if ($raw === false) {
            throw new RuntimeException("Failed to read datastore JSON file.");
        }

        try {
            $decoded = json_decode($raw, true, 512, JSON_THROW_ON_ERROR);
        } catch (JsonException $exception) {
            throw new RuntimeException("Invalid JSON in datastore: " . $exception->getMessage(), 0, $exception);
        }

        if (!is_array($decoded)) {
            throw new RuntimeException("Datastore root must be a JSON object or array.");
        }

        return $decoded;
    }

    private function writeRawData(array $data): void
    {
        $json = json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new RuntimeException("Failed to encode datastore JSON: " . json_last_error_msg());
        }

        $this->createBackupIfPossible();
        $this->atomicWrite($this->dataJsonPath, $json . PHP_EOL);

        $js = "export const siteData = " . $json . ";" . PHP_EOL;
        $this->atomicWrite($this->dataJsPath, $js);

        $this->pruneBackups();
    }

    private function createBackupIfPossible(): void
    {
        if (!is_file($this->dataJsonPath)) {
            return;
        }

        if (!is_dir($this->backupDir) && !mkdir($this->backupDir, 0755, true) && !is_dir($this->backupDir)) {
            throw new RuntimeException("Failed to create backup directory.");
        }

        $suffix = "";
        try {
            $suffix = "-" . substr(bin2hex(random_bytes(2)), 0, 4);
        } catch (Throwable $exception) {
            $suffix = "";
        }

        $timestamp = gmdate("Ymd-His");
        $backupPath = $this->backupDir . DIRECTORY_SEPARATOR . "data-store-{$timestamp}{$suffix}.json";

        if (!copy($this->dataJsonPath, $backupPath)) {
            throw new RuntimeException("Failed to create datastore backup.");
        }
    }

    private function pruneBackups(): void
    {
        if (!is_dir($this->backupDir)) {
            return;
        }

        $files = glob($this->backupDir . DIRECTORY_SEPARATOR . "data-store-*.json");
        if ($files === false || count($files) <= $this->maxBackups) {
            return;
        }

        usort($files, static function (string $a, string $b): int {
            return filemtime($b) <=> filemtime($a);
        });

        for ($index = $this->maxBackups; $index < count($files); $index++) {
            @unlink($files[$index]);
        }
    }

    private function atomicWrite(string $filePath, string $contents): void
    {
        $directory = dirname($filePath);
        if (!is_dir($directory) && !mkdir($directory, 0755, true) && !is_dir($directory)) {
            throw new RuntimeException("Failed to create directory: {$directory}");
        }

        $tempPath = $filePath . ".tmp";
        if (file_put_contents($tempPath, $contents, LOCK_EX) === false) {
            throw new RuntimeException("Failed to write temporary file for {$filePath}");
        }

        if (@rename($tempPath, $filePath)) {
            return;
        }

        if (is_file($filePath) && !unlink($filePath)) {
            @unlink($tempPath);
            throw new RuntimeException("Failed to replace existing file: {$filePath}");
        }

        if (!rename($tempPath, $filePath)) {
            @unlink($tempPath);
            throw new RuntimeException("Failed to move temporary file into place: {$filePath}");
        }
    }

    private function withLock(int $lockType, callable $callback): mixed
    {
        $lockDirectory = dirname($this->lockFilePath);
        if (!is_dir($lockDirectory) && !mkdir($lockDirectory, 0755, true) && !is_dir($lockDirectory)) {
            throw new RuntimeException("Failed to prepare lock directory.");
        }

        $handle = fopen($this->lockFilePath, "c+");
        if ($handle === false) {
            throw new RuntimeException("Failed to open datastore lock file.");
        }

        try {
            if (!flock($handle, $lockType)) {
                throw new RuntimeException("Failed to acquire datastore lock.");
            }

            return $callback();
        } finally {
            flock($handle, LOCK_UN);
            fclose($handle);
        }
    }

    private function isIntegerString(string $value): bool
    {
        return preg_match('/^(0|[1-9][0-9]*)$/', $value) === 1;
    }

    private function isList(array $value): bool
    {
        if (function_exists("array_is_list")) {
            return array_is_list($value);
        }

        $index = 0;
        foreach (array_keys($value) as $key) {
            if ($key !== $index) {
                return false;
            }
            $index++;
        }

        return true;
    }
}
