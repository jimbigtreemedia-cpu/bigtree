<?php
declare(strict_types=1);

header("Content-Type: application/json; charset=utf-8");
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Pragma: no-cache");
header("X-Content-Type-Options: nosniff");

if (($_SERVER["REQUEST_METHOD"] ?? "GET") === "OPTIONS") {
    header("Allow: POST, OPTIONS");
    http_response_code(204);
    exit;
}

if (strtoupper((string) ($_SERVER["REQUEST_METHOD"] ?? "GET")) !== "POST") {
    respond(405, [
        "ok" => false,
        "error" => "Method not allowed. Use POST."
    ]);
}

require_once dirname(__DIR__) . "/lib/AnalyticsStore.php";

try {
    $payload = readPayload();
    $store = new AnalyticsStore();
    $result = $store->track($payload, $_SERVER);

    respond(200, [
        "ok" => true,
        "message" => "Event tracked.",
        "data" => $result
    ]);
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

function readPayload(): array
{
    $contentType = strtolower(trim((string) ($_SERVER["CONTENT_TYPE"] ?? "")));
    if (!str_starts_with($contentType, "application/json")) {
        throw new InvalidArgumentException("Content-Type must be application/json.");
    }

    $raw = file_get_contents("php://input");
    if ($raw === false) {
        throw new RuntimeException("Failed to read request body.");
    }

    $trimmed = trim($raw);
    if ($trimmed === "") {
        throw new InvalidArgumentException("Request body is required.");
    }

    if (strlen($trimmed) > 12000) {
        throw new InvalidArgumentException("Request body is too large.");
    }

    try {
        $decoded = json_decode($trimmed, true, 512, JSON_THROW_ON_ERROR);
    } catch (JsonException $exception) {
        throw new InvalidArgumentException("Invalid JSON request body.", 0, $exception);
    }

    if (!is_array($decoded)) {
        throw new InvalidArgumentException("Request payload must be a JSON object.");
    }

    return $decoded;
}

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
