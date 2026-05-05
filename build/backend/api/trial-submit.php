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

require_once dirname(__DIR__) . "/lib/SubmissionStore.php";

try {
    $payload = is_array($_POST) ? $_POST : [];

    // Honeypot field for basic bot filtering.
    if (trim((string) ($payload["website"] ?? "")) !== "") {
        respond(200, [
            "ok" => true,
            "message" => "Submission received."
        ]);
    }

    $store = new SubmissionStore();
    $saved = $store->saveTrial($payload, $_FILES, $_SERVER);

    respond(200, [
        "ok" => true,
        "message" => "Free trial submitted successfully.",
        "data" => $saved
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

function respond(int $statusCode, array $payload): void
{
    http_response_code($statusCode);
    echo json_encode($payload, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}
