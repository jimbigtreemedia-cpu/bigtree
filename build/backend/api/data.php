<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("X-Content-Type-Options: nosniff");

if (($_SERVER["REQUEST_METHOD"] ?? "GET") === "OPTIONS") {
    header("Allow: GET, POST, PUT, DELETE, OPTIONS");
    http_response_code(204);
    exit;
}

require_once dirname(__DIR__) . "/lib/DataStore.php";
$config = require dirname(__DIR__) . "/config.php";

$configuredToken = isset($config["admin_token"]) ? trim((string) $config["admin_token"]) : "";
if ($configuredToken === "" || $configuredToken === "change-this-to-a-long-random-token") {
    respond(500, [
        "ok" => false,
        "error" => "Configure a strong admin_token in backend/config.php before using this API."
    ]);
}

$requestToken = extractRequestToken();
if (!hash_equals($configuredToken, $requestToken)) {
    respond(401, [
        "ok" => false,
        "error" => "Unauthorized. Provide a valid X-Admin-Token header."
    ]);
}

$store = new DataStore();
$method = strtoupper($_SERVER["REQUEST_METHOD"] ?? "GET");

try {
    switch ($method) {
        case "GET":
            handleGet($store);
            break;
        case "POST":
            handlePost($store);
            break;
        case "PUT":
            handlePut($store);
            break;
        case "DELETE":
            handleDelete($store);
            break;
        default:
            respond(405, [
                "ok" => false,
                "error" => "Method not allowed. Use GET, POST, PUT, or DELETE."
            ]);
    }
} catch (InvalidArgumentException $exception) {
    respond(400, [
        "ok" => false,
        "error" => $exception->getMessage()
    ]);
} catch (RuntimeException $exception) {
    respond(500, [
        "ok" => false,
        "error" => $exception->getMessage()
    ]);
} catch (Throwable $exception) {
    respond(500, [
        "ok" => false,
        "error" => "Unexpected server error."
    ]);
}

function handleGet(DataStore $store): void
{
    $path = isset($_GET["path"]) ? (string) $_GET["path"] : "";
    $data = $store->get($path);

    respond(200, [
        "ok" => true,
        "method" => "GET",
        "path" => normalizePath($path),
        "data" => $data
    ]);
}

function handlePost(DataStore $store): void
{
    $payload = readJsonPayload();
    if (!array_key_exists("value", $payload)) {
        throw new InvalidArgumentException("POST payload must include a 'value' field.");
    }

    $path = isset($payload["path"]) ? (string) $payload["path"] : "";
    $key = isset($payload["key"]) ? trim((string) $payload["key"]) : null;
    $createMissing = parseBoolean($payload["createMissing"] ?? false);

    $result = $store->add(
        $path,
        $payload["value"],
        $key === "" ? null : $key,
        $createMissing
    );

    respond(200, [
        "ok" => true,
        "method" => "POST",
        "path" => normalizePath($result["path"] ?? $path),
        "message" => "Value added successfully.",
        "data" => $result["value"] ?? null
    ]);
}

function handlePut(DataStore $store): void
{
    $payload = readJsonPayload();
    if (!array_key_exists("value", $payload)) {
        throw new InvalidArgumentException("PUT payload must include a 'value' field.");
    }

    $path = isset($payload["path"]) ? (string) $payload["path"] : "";
    $createMissing = parseBoolean($payload["createMissing"] ?? false);

    $updatedValue = $store->replace($path, $payload["value"], $createMissing);

    respond(200, [
        "ok" => true,
        "method" => "PUT",
        "path" => normalizePath($path),
        "message" => "Value replaced successfully.",
        "data" => $updatedValue
    ]);
}

function handleDelete(DataStore $store): void
{
    $path = isset($_GET["path"]) ? (string) $_GET["path"] : "";
    if ($path === "") {
        $payload = readJsonPayload(false);
        $path = isset($payload["path"]) ? (string) $payload["path"] : "";
    }

    if (trim($path) === "") {
        throw new InvalidArgumentException("DELETE requires a non-empty 'path'.");
    }

    $removedValue = $store->remove($path);

    respond(200, [
        "ok" => true,
        "method" => "DELETE",
        "path" => normalizePath($path),
        "message" => "Value removed successfully.",
        "data" => $removedValue
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

function readJsonPayload(bool $throwOnEmpty = true): array
{
    $rawBody = file_get_contents("php://input");
    if ($rawBody === false) {
        throw new RuntimeException("Failed to read request body.");
    }

    $trimmed = trim($rawBody);
    if ($trimmed === "") {
        if ($throwOnEmpty) {
            throw new InvalidArgumentException("Request body is required.");
        }
        return [];
    }

    try {
        $decoded = json_decode($trimmed, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $exception) {
        throw new InvalidArgumentException("Invalid JSON body: " . $exception->getMessage(), 0, $exception);
    }

    if (!is_array($decoded)) {
        throw new InvalidArgumentException("JSON body must decode to an object.");
    }

    return $decoded;
}

function normalizePath(string $path): string
{
    return trim($path, "/");
}

function parseBoolean(mixed $value): bool
{
    if (is_bool($value)) {
        return $value;
    }

    if (is_int($value)) {
        return $value === 1;
    }

    if (is_string($value)) {
        $normalized = strtolower(trim($value));
        return in_array($normalized, ["1", "true", "yes", "on"], true);
    }

    return false;
}

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
