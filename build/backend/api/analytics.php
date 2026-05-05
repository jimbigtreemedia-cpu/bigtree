<?php
declare(strict_types=1);

header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("X-Content-Type-Options: nosniff");

if (($_SERVER["REQUEST_METHOD"] ?? "GET") === "OPTIONS") {
    header("Allow: GET, OPTIONS");
    http_response_code(204);
    exit;
}

require_once dirname(__DIR__) . "/lib/AnalyticsStore.php";
$config = require dirname(__DIR__) . "/config.php";

$configuredToken = isset($config["admin_token"]) ? trim((string) $config["admin_token"]) : "";
if ($configuredToken === "" || $configuredToken === "change-this-to-a-long-random-token") {
    respondJson(500, [
        "ok" => false,
        "error" => "Configure a strong admin_token in backend/config.php before using this API."
    ]);
}

$requestToken = extractRequestToken();
if (!hash_equals($configuredToken, $requestToken)) {
    respondJson(401, [
        "ok" => false,
        "error" => "Unauthorized. Provide a valid X-Admin-Token header."
    ]);
}

if (strtoupper((string) ($_SERVER["REQUEST_METHOD"] ?? "GET")) !== "GET") {
    respondJson(405, [
        "ok" => false,
        "error" => "Method not allowed. Use GET."
    ]);
}

$store = new AnalyticsStore();
$action = strtolower(trim((string) ($_GET["action"] ?? "summary")));
$eventFilter = trim((string) ($_GET["event"] ?? ""));
$pathFilter = trim((string) ($_GET["path"] ?? ""));
$fromFilter = trim((string) ($_GET["from"] ?? ""));
$toFilter = trim((string) ($_GET["to"] ?? ""));

try {
    switch ($action) {
        case "summary":
            $summary = $store->summarize($eventFilter, $pathFilter, $fromFilter, $toFilter);
            respondJson(200, [
                "ok" => true,
                "action" => "summary",
                "data" => $summary
            ]);
            break;

        case "list":
            $limit = isset($_GET["limit"]) ? (int) $_GET["limit"] : 200;
            $items = $store->listEvents($limit, $eventFilter, $pathFilter, $fromFilter, $toFilter);

            respondJson(200, [
                "ok" => true,
                "action" => "list",
                "data" => [
                    "items" => $items,
                    "filters" => [
                        "limit" => max(1, min($limit, 2000)),
                        "event" => $eventFilter,
                        "path" => $pathFilter,
                        "from" => $fromFilter,
                        "to" => $toFilter
                    ]
                ]
            ]);
            break;

        case "download":
            $eventsPath = $store->getEventsFilePath();
            if (!is_file($eventsPath) || !is_readable($eventsPath)) {
                respondJson(404, [
                    "ok" => false,
                    "error" => "Analytics event file not found."
                ]);
            }

            streamDownload($eventsPath, "analytics-events.ndjson", "application/x-ndjson; charset=utf-8");
            break;

        default:
            throw new InvalidArgumentException("Invalid action. Use summary, list, or download.");
    }
} catch (InvalidArgumentException $exception) {
    respondJson(400, [
        "ok" => false,
        "error" => $exception->getMessage()
    ]);
} catch (RuntimeException $exception) {
    respondJson(500, [
        "ok" => false,
        "error" => $exception->getMessage()
    ]);
} catch (Throwable $exception) {
    respondJson(500, [
        "ok" => false,
        "error" => "Unexpected server error."
    ]);
}

function extractRequestToken(): string
{
    $headerToken = trim((string) ($_SERVER["HTTP_X_ADMIN_TOKEN"] ?? ""));
    if ($headerToken !== "") {
        return $headerToken;
    }

    $authorizationHeader = trim((string) ($_SERVER["HTTP_AUTHORIZATION"] ?? ""));
    if (str_starts_with($authorizationHeader, "Bearer ")) {
        return trim(substr($authorizationHeader, 7));
    }

    return "";
}

function respondJson(int $statusCode, array $payload): void
{
    header("Content-Type: application/json; charset=utf-8");
    http_response_code($statusCode);
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function streamDownload(string $path, string $downloadName, string $contentType): void
{
    if (!is_file($path) || !is_readable($path)) {
        respondJson(404, [
            "ok" => false,
            "error" => "Download file not found."
        ]);
    }

    $size = (int) filesize($path);
    header("Content-Type: " . $contentType);
    header('Content-Disposition: attachment; filename="' . addcslashes($downloadName, '"\\') . '"');
    header("Content-Length: {$size}");
    header("Content-Transfer-Encoding: binary");
    header("Expires: 0");
    header("Pragma: public");

    $stream = fopen($path, "rb");
    if ($stream === false) {
        respondJson(500, [
            "ok" => false,
            "error" => "Failed to open download stream."
        ]);
    }

    while (!feof($stream)) {
        echo fread($stream, 8192);
    }
    fclose($stream);
    exit;
}
