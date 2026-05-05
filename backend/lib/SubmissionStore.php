<?php
declare(strict_types=1);

final class SubmissionStore
{
    private string $baseDir;
    private string $contactDir;
    private string $trialDir;
    private int $maxTrialFiles;
    private int $maxTrialFileSize;
    private int $maxTrialTotalSize;
    private array $allowedExtensions;

    public function __construct(array $options = [])
    {
        $this->baseDir = $options["base_dir"] ?? dirname(__DIR__) . DIRECTORY_SEPARATOR . "submissions";
        $this->contactDir = $this->baseDir . DIRECTORY_SEPARATOR . "contact";
        $this->trialDir = $this->baseDir . DIRECTORY_SEPARATOR . "trial";

        $this->maxTrialFiles = (int) ($options["max_trial_files"] ?? 3);
        $this->maxTrialFileSize = (int) ($options["max_trial_file_size"] ?? (200 * 1024 * 1024));
        $this->maxTrialTotalSize = (int) ($options["max_trial_total_size"] ?? (600 * 1024 * 1024));
        $this->allowedExtensions = $options["allowed_extensions"] ?? [
            "jpg", "jpeg", "png", "webp", "heic", "heif", "tif", "tiff", "psd",
            "raw", "dng", "cr2", "cr3", "nef", "arw", "rw2", "orf",
            "mp4", "mov", "avi", "mkv", "webm", "wmv", "flv", "mpeg", "mpg",
            "m4v", "3gp", "m2ts", "mts"
        ];

        $this->ensureDir($this->baseDir);
        $this->ensureDir($this->contactDir);
        $this->ensureDir($this->trialDir);
    }

    public function saveContact(array $payload, array $server): array
    {
        $firstName = $this->requiredText($payload, "firstName", 100);
        $lastName = $this->requiredText($payload, "lastName", 100);
        $email = $this->requiredEmail($payload, "email");
        $messageFull = $this->requiredText($payload, "message", 5000);
        $messageSummary = $this->singleLine($messageFull, 280);

        $id = $this->createSubmissionId();
        $submittedAtUtc = gmdate("Y-m-d H:i:s") . " UTC";
        $ipAddress = $this->sanitizeLine((string) ($server["REMOTE_ADDR"] ?? "unknown"));
        $userAgent = $this->sanitizeLine((string) ($server["HTTP_USER_AGENT"] ?? "unknown"), 500);

        $content = [
            "Submission Type: Contact",
            "Submission ID: {$id}",
            "Submitted At UTC: {$submittedAtUtc}",
            "IP Address: {$ipAddress}",
            "User Agent: {$userAgent}",
            "First Name: {$firstName}",
            "Last Name: {$lastName}",
            "Email: {$email}",
            "Message: {$messageSummary}",
            "",
            "Message Full:",
            $messageFull
        ];

        $fileName = "{$id}.txt";
        $filePath = $this->contactDir . DIRECTORY_SEPARATOR . $fileName;
        $this->atomicWrite($filePath, implode(PHP_EOL, $content) . PHP_EOL);

        return [
            "id" => $id,
            "fileName" => $fileName,
            "submittedAtUtc" => $submittedAtUtc
        ];
    }

    public function saveTrial(array $payload, array $files, array $server): array
    {
        $name = $this->requiredText($payload, "name", 180);
        $email = $this->requiredEmail($payload, "email");
        $instructionsFull = $this->requiredText($payload, "instructions", 8000);
        $instructionsSummary = $this->singleLine($instructionsFull, 320);

        $normalizedFiles = $this->normalizeUploadedFiles($files["files"] ?? null);
        if (count($normalizedFiles) === 0) {
            throw new InvalidArgumentException("At least one trial image is required.");
        }
        if (count($normalizedFiles) > $this->maxTrialFiles) {
            throw new InvalidArgumentException("Maximum {$this->maxTrialFiles} files are allowed.");
        }

        $totalSize = 0;
        foreach ($normalizedFiles as $file) {
            if ((int) $file["error"] !== UPLOAD_ERR_OK) {
                throw new InvalidArgumentException("One or more files failed to upload.");
            }
            $size = (int) $file["size"];
            if ($size <= 0) {
                throw new InvalidArgumentException("Uploaded file is empty.");
            }
            if ($size > $this->maxTrialFileSize) {
                throw new InvalidArgumentException("A file exceeds the per-file upload limit.");
            }
            $totalSize += $size;
        }
        if ($totalSize > $this->maxTrialTotalSize) {
            throw new InvalidArgumentException("Total upload size exceeds allowed limit.");
        }

        $id = $this->createSubmissionId();
        $submittedAtUtc = gmdate("Y-m-d H:i:s") . " UTC";
        $ipAddress = $this->sanitizeLine((string) ($server["REMOTE_ADDR"] ?? "unknown"));
        $userAgent = $this->sanitizeLine((string) ($server["HTTP_USER_AGENT"] ?? "unknown"), 500);

        $trialSubmissionDir = $this->trialDir . DIRECTORY_SEPARATOR . $id;
        $trialFilesDir = $trialSubmissionDir . DIRECTORY_SEPARATOR . "files";
        $this->ensureDir($trialSubmissionDir);
        $this->ensureDir($trialFilesDir);

        $fileLines = [];
        $storedFiles = [];
        foreach ($normalizedFiles as $index => $file) {
            $originalName = $this->sanitizeLine((string) $file["name"], 180);
            $tmpPath = (string) $file["tmp_name"];
            $extension = strtolower((string) pathinfo($originalName, PATHINFO_EXTENSION));
            $uploadMimeType = $this->detectMimeType($tmpPath);
            $isVideoMime = str_starts_with($uploadMimeType, "video/");
            $isAllowedExtension = $extension !== "" && in_array($extension, $this->allowedExtensions, true);

            if (!$isAllowedExtension && !$isVideoMime) {
                throw new InvalidArgumentException("Unsupported file type for '{$originalName}'.");
            }

            $storedExtension = $extension !== "" ? preg_replace('/[^a-z0-9]+/', '', $extension) : "";
            if ($storedExtension === "") {
                $storedExtension = $this->extensionFromMime($uploadMimeType);
            }
            if ($storedExtension === "") {
                $storedExtension = $isVideoMime ? "video" : "file";
            }

            $base = preg_replace('/[^A-Za-z0-9_-]/', '-', (string) pathinfo($originalName, PATHINFO_FILENAME));
            $base = trim((string) $base, "-");
            if ($base === "") {
                $base = "trial-file";
            }
            $base = substr($base, 0, 60);

            $storedName = sprintf(
                "%02d-%s-%s.%s",
                $index + 1,
                $base,
                substr(bin2hex(random_bytes(2)), 0, 4),
                $storedExtension
            );
            $targetPath = $trialFilesDir . DIRECTORY_SEPARATOR . $storedName;

            if (!is_uploaded_file($tmpPath)) {
                throw new InvalidArgumentException("Invalid upload source for '{$originalName}'.");
            }
            if (!move_uploaded_file($tmpPath, $targetPath)) {
                throw new RuntimeException("Failed to save uploaded file '{$originalName}'.");
            }

            $sizeBytes = (int) filesize($targetPath);
            $mimeType = $this->detectMimeType($targetPath);

            $fileLines[] = "- Original: {$originalName} | Stored: {$storedName} | Size: {$sizeBytes} bytes | Mime: {$mimeType}";
            $storedFiles[] = [
                "originalName" => $originalName,
                "storedName" => $storedName,
                "sizeBytes" => $sizeBytes,
                "mimeType" => $mimeType
            ];
        }

        $content = [
            "Submission Type: Free Trial",
            "Submission ID: {$id}",
            "Submitted At UTC: {$submittedAtUtc}",
            "IP Address: {$ipAddress}",
            "User Agent: {$userAgent}",
            "Name: {$name}",
            "Email: {$email}",
            "Instructions: {$instructionsSummary}",
            "File Count: " . count($storedFiles),
            "",
            "Instructions Full:",
            $instructionsFull,
            "",
            "Files:",
            ...$fileLines
        ];

        $infoFilePath = $trialSubmissionDir . DIRECTORY_SEPARATOR . "info.txt";
        $this->atomicWrite($infoFilePath, implode(PHP_EOL, $content) . PHP_EOL);

        return [
            "id" => $id,
            "submittedAtUtc" => $submittedAtUtc,
            "fileCount" => count($storedFiles)
        ];
    }

    public function listContact(int $limit = 200): array
    {
        $limit = max(1, min($limit, 1000));
        $files = glob($this->contactDir . DIRECTORY_SEPARATOR . "*.txt") ?: [];
        usort($files, static fn(string $a, string $b): int => filemtime($b) <=> filemtime($a));

        $result = [];
        foreach (array_slice($files, 0, $limit) as $filePath) {
            $id = pathinfo($filePath, PATHINFO_FILENAME);
            if (!$this->isValidId($id)) {
                continue;
            }
            $data = $this->parseKeyValueFile($filePath);
            $result[] = [
                "id" => $id,
                "submittedAtUtc" => $data["Submitted At UTC"] ?? gmdate("Y-m-d H:i:s", (int) filemtime($filePath)) . " UTC",
                "firstName" => $data["First Name"] ?? "",
                "lastName" => $data["Last Name"] ?? "",
                "email" => $data["Email"] ?? "",
                "ipAddress" => $data["IP Address"] ?? "",
                "message" => $data["Message"] ?? "",
                "downloadName" => basename($filePath)
            ];
        }

        return $result;
    }

    public function listTrial(int $limit = 200): array
    {
        $limit = max(1, min($limit, 1000));
        $dirs = glob($this->trialDir . DIRECTORY_SEPARATOR . "*", GLOB_ONLYDIR) ?: [];
        usort($dirs, static fn(string $a, string $b): int => filemtime($b) <=> filemtime($a));

        $result = [];
        foreach (array_slice($dirs, 0, $limit) as $dirPath) {
            $id = basename($dirPath);
            if (!$this->isValidId($id)) {
                continue;
            }

            $infoPath = $dirPath . DIRECTORY_SEPARATOR . "info.txt";
            if (!is_file($infoPath)) {
                continue;
            }

            $data = $this->parseKeyValueFile($infoPath);
            $filesDir = $dirPath . DIRECTORY_SEPARATOR . "files";
            $fileCount = is_dir($filesDir) ? count(glob($filesDir . DIRECTORY_SEPARATOR . "*") ?: []) : 0;

            $result[] = [
                "id" => $id,
                "submittedAtUtc" => $data["Submitted At UTC"] ?? gmdate("Y-m-d H:i:s", (int) filemtime($infoPath)) . " UTC",
                "name" => $data["Name"] ?? "",
                "email" => $data["Email"] ?? "",
                "ipAddress" => $data["IP Address"] ?? "",
                "instructions" => $data["Instructions"] ?? "",
                "fileCount" => $fileCount,
                "downloadName" => "trial-{$id}-info.txt"
            ];
        }

        return $result;
    }

    public function viewContact(string $id): array
    {
        $id = $this->validateId($id);
        $filePath = $this->contactDir . DIRECTORY_SEPARATOR . $id . ".txt";
        if (!is_file($filePath)) {
            throw new InvalidArgumentException("Contact submission not found.");
        }

        $raw = (string) file_get_contents($filePath);
        $data = $this->parseKeyValueText($raw);

        return [
            "id" => $id,
            "submittedAtUtc" => $data["Submitted At UTC"] ?? gmdate("Y-m-d H:i:s", (int) filemtime($filePath)) . " UTC",
            "firstName" => $data["First Name"] ?? "",
            "lastName" => $data["Last Name"] ?? "",
            "email" => $data["Email"] ?? "",
            "ipAddress" => $data["IP Address"] ?? "",
            "userAgent" => $data["User Agent"] ?? "",
            "message" => $data["Message"] ?? "",
            "rawText" => $raw,
            "downloadName" => basename($filePath)
        ];
    }

    public function viewTrial(string $id): array
    {
        $id = $this->validateId($id);
        $trialSubmissionDir = $this->trialDir . DIRECTORY_SEPARATOR . $id;
        $infoPath = $trialSubmissionDir . DIRECTORY_SEPARATOR . "info.txt";

        if (!is_file($infoPath)) {
            throw new InvalidArgumentException("Trial submission not found.");
        }

        $raw = (string) file_get_contents($infoPath);
        $data = $this->parseKeyValueText($raw);

        $files = [];
        $filesDir = $trialSubmissionDir . DIRECTORY_SEPARATOR . "files";
        if (is_dir($filesDir)) {
            $entries = glob($filesDir . DIRECTORY_SEPARATOR . "*") ?: [];
            usort($entries, static fn(string $a, string $b): int => strcmp(basename($a), basename($b)));
            foreach ($entries as $entry) {
                if (!is_file($entry)) {
                    continue;
                }
                $storedName = basename($entry);
                $files[] = [
                    "storedName" => $storedName,
                    "sizeBytes" => (int) filesize($entry),
                    "mimeType" => $this->detectMimeType($entry)
                ];
            }
        }

        return [
            "id" => $id,
            "submittedAtUtc" => $data["Submitted At UTC"] ?? gmdate("Y-m-d H:i:s", (int) filemtime($infoPath)) . " UTC",
            "name" => $data["Name"] ?? "",
            "email" => $data["Email"] ?? "",
            "ipAddress" => $data["IP Address"] ?? "",
            "userAgent" => $data["User Agent"] ?? "",
            "instructions" => $data["Instructions"] ?? "",
            "rawText" => $raw,
            "files" => $files,
            "downloadName" => "trial-{$id}-info.txt"
        ];
    }

    public function getContactDownload(string $id): array
    {
        $id = $this->validateId($id);
        $filePath = $this->contactDir . DIRECTORY_SEPARATOR . $id . ".txt";
        if (!is_file($filePath)) {
            throw new InvalidArgumentException("Contact submission not found.");
        }

        return [
            "path" => $filePath,
            "downloadName" => basename($filePath),
            "contentType" => "text/plain; charset=utf-8"
        ];
    }

    public function getTrialInfoDownload(string $id): array
    {
        $id = $this->validateId($id);
        $filePath = $this->trialDir . DIRECTORY_SEPARATOR . $id . DIRECTORY_SEPARATOR . "info.txt";
        if (!is_file($filePath)) {
            throw new InvalidArgumentException("Trial submission not found.");
        }

        return [
            "path" => $filePath,
            "downloadName" => "trial-{$id}-info.txt",
            "contentType" => "text/plain; charset=utf-8"
        ];
    }

    public function getTrialFileDownload(string $id, string $storedFileName): array
    {
        $id = $this->validateId($id);
        $safeName = $this->sanitizeFileName($storedFileName);
        if ($safeName === "") {
            throw new InvalidArgumentException("Invalid trial file name.");
        }

        $filePath = $this->trialDir . DIRECTORY_SEPARATOR . $id . DIRECTORY_SEPARATOR . "files" . DIRECTORY_SEPARATOR . $safeName;
        if (!is_file($filePath)) {
            throw new InvalidArgumentException("Trial file not found.");
        }

        return [
            "path" => $filePath,
            "downloadName" => "trial-{$id}-{$safeName}",
            "contentType" => $this->detectMimeType($filePath)
        ];
    }

    private function createSubmissionId(): string
    {
        return gmdate("Ymd-His") . "-" . substr(bin2hex(random_bytes(4)), 0, 6);
    }

    private function requiredText(array $payload, string $field, int $maxLength): string
    {
        $value = trim((string) ($payload[$field] ?? ""));
        if ($value === "") {
            throw new InvalidArgumentException("Field '{$field}' is required.");
        }
        if (mb_strlen($value) > $maxLength) {
            throw new InvalidArgumentException("Field '{$field}' exceeds allowed length.");
        }

        return $value;
    }

    private function requiredEmail(array $payload, string $field): string
    {
        $value = trim((string) ($payload[$field] ?? ""));
        if ($value === "") {
            throw new InvalidArgumentException("Field '{$field}' is required.");
        }
        if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
            throw new InvalidArgumentException("Field '{$field}' must be a valid email address.");
        }

        return strtolower($value);
    }

    private function normalizeUploadedFiles(mixed $filesField): array
    {
        if (!is_array($filesField) || !isset($filesField["name"])) {
            return [];
        }

        $names = $filesField["name"];
        $tmpNames = $filesField["tmp_name"] ?? null;
        $errors = $filesField["error"] ?? null;
        $sizes = $filesField["size"] ?? null;
        $types = $filesField["type"] ?? null;

        if (!is_array($names)) {
            return [[
                "name" => (string) $names,
                "tmp_name" => (string) $tmpNames,
                "error" => (int) $errors,
                "size" => (int) $sizes,
                "type" => (string) $types
            ]];
        }

        $result = [];
        $count = count($names);
        for ($index = 0; $index < $count; $index++) {
            $result[] = [
                "name" => (string) ($names[$index] ?? ""),
                "tmp_name" => (string) ($tmpNames[$index] ?? ""),
                "error" => (int) ($errors[$index] ?? UPLOAD_ERR_NO_FILE),
                "size" => (int) ($sizes[$index] ?? 0),
                "type" => (string) ($types[$index] ?? "")
            ];
        }

        return $result;
    }

    private function parseKeyValueFile(string $path): array
    {
        $raw = (string) file_get_contents($path);
        return $this->parseKeyValueText($raw);
    }

    private function parseKeyValueText(string $raw): array
    {
        $result = [];
        $lines = preg_split('/\r\n|\r|\n/', $raw) ?: [];
        foreach ($lines as $line) {
            if (strpos($line, ":") === false) {
                continue;
            }
            [$key, $value] = explode(":", $line, 2);
            $key = trim($key);
            $value = trim($value);
            if ($key === "" || $value === "") {
                continue;
            }
            if (!array_key_exists($key, $result)) {
                $result[$key] = $value;
            }
        }

        return $result;
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

    private function singleLine(string $value, int $maxLength): string
    {
        return $this->sanitizeLine($value, $maxLength);
    }

    private function sanitizeFileName(string $name): string
    {
        $name = basename($name);
        $name = preg_replace('/[^A-Za-z0-9._-]/', '', $name);
        return (string) $name;
    }

    private function validateId(string $id): string
    {
        $id = trim($id);
        if (!$this->isValidId($id)) {
            throw new InvalidArgumentException("Invalid submission ID.");
        }

        return $id;
    }

    private function isValidId(string $id): bool
    {
        return preg_match('/^[0-9]{8}-[0-9]{6}-[a-f0-9]{6}$/', $id) === 1;
    }

    private function ensureDir(string $path): void
    {
        if (!is_dir($path) && !mkdir($path, 0755, true) && !is_dir($path)) {
            throw new RuntimeException("Unable to create directory: {$path}");
        }
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

    private function detectMimeType(string $path): string
    {
        $finfo = finfo_open(FILEINFO_MIME_TYPE);
        if ($finfo === false) {
            return "application/octet-stream";
        }

        $mime = (string) finfo_file($finfo, $path);
        finfo_close($finfo);
        if ($mime === "") {
            return "application/octet-stream";
        }

        return $mime;
    }

    private function extensionFromMime(string $mimeType): string
    {
        return match (strtolower($mimeType)) {
            "video/mp4" => "mp4",
            "video/quicktime" => "mov",
            "video/x-msvideo" => "avi",
            "video/x-matroska" => "mkv",
            "video/webm" => "webm",
            "video/x-ms-wmv" => "wmv",
            "video/mpeg" => "mpeg",
            "video/3gpp" => "3gp",
            "video/mp2t" => "ts",
            default => ""
        };
    }
}
