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

require_once dirname(__DIR__) . "/lib/SubmissionStore.php";
require_once dirname(__DIR__) . "/lib/NewsletterStore.php";
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

$store = new SubmissionStore();
$newsletterStore = new NewsletterStore();
$action = strtolower(trim((string) ($_GET["action"] ?? "list")));
$type = strtolower(trim((string) ($_GET["type"] ?? "contact")));

try {
    if (!in_array($type, ["contact", "trial", "newsletter"], true)) {
        throw new InvalidArgumentException("Invalid submission type. Use 'contact', 'trial', or 'newsletter'.");
    }

    switch ($action) {
        case "list":
            $limit = isset($_GET["limit"]) ? (int) $_GET["limit"] : 200;
            if ($type === "contact") {
                $items = $store->listContact($limit);
            } elseif ($type === "trial") {
                $items = $store->listTrial($limit);
            } else {
                $items = $newsletterStore->listSubscribers($limit);
            }

            respondJson(200, [
                "ok" => true,
                "type" => $type,
                "action" => "list",
                "data" => [
                    "items" => $items
                ]
            ]);
            break;

        case "view":
            $id = trim((string) ($_GET["id"] ?? ""));
            if ($id === "") {
                throw new InvalidArgumentException("Missing required 'id' parameter.");
            }

            if ($type === "contact") {
                $data = $store->viewContact($id);
            } elseif ($type === "trial") {
                $data = $store->viewTrial($id);
            } else {
                $data = $newsletterStore->viewSubscriber($id);
            }

            respondJson(200, [
                "ok" => true,
                "type" => $type,
                "action" => "view",
                "data" => $data
            ]);
            break;

        case "download":
            $id = trim((string) ($_GET["id"] ?? ""));
            if ($id === "") {
                throw new InvalidArgumentException("Missing required 'id' parameter.");
            }

            if ($type === "contact") {
                $download = $store->getContactDownload($id);
                streamDownload($download["path"], $download["downloadName"], $download["contentType"]);
            }

            if ($type === "newsletter") {
                $download = $newsletterStore->getSubscriberDownload($id);
                streamDownload($download["path"], $download["downloadName"], $download["contentType"]);
            }

            $file = trim((string) ($_GET["file"] ?? ""));
            if ($file !== "") {
                $download = $store->getTrialFileDownload($id, $file);
                streamDownload($download["path"], $download["downloadName"], $download["contentType"]);
            }

            $download = $store->getTrialInfoDownload($id);
            streamDownload($download["path"], $download["downloadName"], $download["contentType"]);
            break;

        default:
            throw new InvalidArgumentException("Invalid action. Use list, view, or download.");
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
