<?php
declare(strict_types=1);

final class AnalyticsStore
{
    private string $baseDir;
    private string $eventsPath;
    private string $lockPath;
    private int $maxProperties;
    private int $maxDepth;

    public function __construct(array $options = [])
    {
        $this->baseDir = $options["base_dir"] ?? dirname(__DIR__) . DIRECTORY_SEPARATOR . "analytics";
        $this->eventsPath = $options["events_path"] ?? $this->baseDir . DIRECTORY_SEPARATOR . "events.ndjson";
        $this->lockPath = $options["lock_path"] ?? $this->baseDir . DIRECTORY_SEPARATOR . ".lock";
        $this->maxProperties = max(1, (int) ($options["max_properties"] ?? 40));
        $this->maxDepth = max(1, (int) ($options["max_depth"] ?? 3));

        $this->ensureDir($this->baseDir);
    }

    public function track(array $payload, array $server): array
    {
        $eventName = $this->sanitizeEventName((string) ($payload["event"] ?? ""));
        $sessionId = $this->sanitizeText((string) ($payload["sessionId"] ?? ""), 120);
        $path = $this->sanitizeText((string) ($payload["path"] ?? ""), 500);
        $title = $this->sanitizeText((string) ($payload["title"] ?? ""), 300);
        $referrer = $this->sanitizeText((string) ($payload["referrer"] ?? ""), 800);
        $timestampClient = $this->sanitizeText((string) ($payload["timestampClient"] ?? ""), 100);
        $ipAddress = $this->sanitizeText((string) ($server["REMOTE_ADDR"] ?? "unknown"), 80);
        $userAgent = $this->sanitizeText((string) ($server["HTTP_USER_AGENT"] ?? "unknown"), 500);

        $propertiesRaw = $payload["properties"] ?? [];
        $properties = $this->normalizeProperties($propertiesRaw, $this->maxDepth);

        $record = [
            "id" => $this->createEventId(),
            "event" => $eventName,
            "timestampServerUtc" => gmdate("Y-m-d H:i:s") . " UTC",
            "timestampClient" => $timestampClient,
            "path" => $path,
            "title" => $title,
            "referrer" => $referrer,
            "sessionId" => $sessionId,
            "ipAddress" => $ipAddress,
            "userAgent" => $userAgent,
            "properties" => $properties
        ];

        $json = json_encode($record, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
        if ($json === false) {
            throw new RuntimeException("Failed to encode analytics event.");
        }

        $this->appendLineWithLock($json . PHP_EOL);

        return [
            "id" => $record["id"],
            "event" => $eventName
        ];
    }

    public function listEvents(
        int $limit = 200,
        string $eventFilter = "",
        string $pathFilter = "",
        string $fromFilter = "",
        string $toFilter = ""
    ): array
    {
        $limit = max(1, min($limit, 2000));
        $eventNeedle = strtolower(trim($eventFilter));
        $pathNeedle = strtolower(trim($pathFilter));
        [$fromTimestamp, $toTimestamp] = $this->parseRangeBounds($fromFilter, $toFilter);
        $buffer = [];

        $this->forEachEvent(function (array $raw) use (
            &$buffer,
            $limit,
            $eventNeedle,
            $pathNeedle,
            $fromTimestamp,
            $toTimestamp
        ): void {
            $record = $this->normalizeStoredRecord($raw);
            if ($record === null) {
                return;
            }

            if ($eventNeedle !== "" && !str_contains($record["event"], $eventNeedle)) {
                return;
            }

            if ($pathNeedle !== "" && !str_contains(strtolower($record["path"]), $pathNeedle)) {
                return;
            }

            $timestampUnix = (int) ($record["timestampUnix"] ?? 0);
            if (($fromTimestamp !== null || $toTimestamp !== null) && $timestampUnix <= 0) {
                return;
            }
            if ($fromTimestamp !== null && $timestampUnix < $fromTimestamp) {
                return;
            }
            if ($toTimestamp !== null && $timestampUnix > $toTimestamp) {
                return;
            }

            $buffer[] = $record;
            if (count($buffer) > $limit) {
                array_shift($buffer);
            }
        });

        return array_reverse($buffer);
    }

    public function summarize(
        string $eventFilter = "",
        string $pathFilter = "",
        string $fromFilter = "",
        string $toFilter = ""
    ): array
    {
        $eventNeedle = strtolower(trim($eventFilter));
        $pathNeedle = strtolower(trim($pathFilter));
        [$fromTimestamp, $toTimestamp] = $this->parseRangeBounds($fromFilter, $toFilter);

        $totalEvents = 0;
        $firstEventAtUtc = "";
        $lastEventAtUtc = "";
        $firstEventTimestamp = 0;
        $lastEventTimestamp = 0;
        $eventCounts = [];
        $pathCounts = [];
        $ctaCounts = [];
        $sessions = [];
        $referrerCounts = [];
        $hourBucketCounts = [];
        $dayBucketCounts = [];
        $weekBucketCounts = [];
        $hourOfDayCounts = [];
        $weekdayCounts = [];

        $this->forEachEvent(function (array $raw) use (
            &$totalEvents,
            &$firstEventAtUtc,
            &$lastEventAtUtc,
            &$firstEventTimestamp,
            &$lastEventTimestamp,
            &$eventCounts,
            &$pathCounts,
            &$ctaCounts,
            &$sessions,
            &$referrerCounts,
            &$hourBucketCounts,
            &$dayBucketCounts,
            &$weekBucketCounts,
            &$hourOfDayCounts,
            &$weekdayCounts,
            $eventNeedle,
            $pathNeedle,
            $fromTimestamp,
            $toTimestamp
        ): void {
            $record = $this->normalizeStoredRecord($raw);
            if ($record === null) {
                return;
            }

            if ($eventNeedle !== "" && !str_contains($record["event"], $eventNeedle)) {
                return;
            }

            if ($pathNeedle !== "" && !str_contains(strtolower($record["path"]), $pathNeedle)) {
                return;
            }

            $timestampUnix = (int) ($record["timestampUnix"] ?? 0);
            if (($fromTimestamp !== null || $toTimestamp !== null) && $timestampUnix <= 0) {
                return;
            }
            if ($fromTimestamp !== null && $timestampUnix < $fromTimestamp) {
                return;
            }
            if ($toTimestamp !== null && $timestampUnix > $toTimestamp) {
                return;
            }

            $totalEvents++;
            if ($firstEventAtUtc === "") {
                $firstEventAtUtc = $record["timestampServerUtc"];
                $firstEventTimestamp = $timestampUnix;
            }
            if ($firstEventTimestamp <= 0 && $timestampUnix > 0) {
                $firstEventTimestamp = $timestampUnix;
            }
            $lastEventAtUtc = $record["timestampServerUtc"];
            if ($timestampUnix > 0) {
                $lastEventTimestamp = $timestampUnix;
            }

            if ($record["sessionId"] !== "") {
                $sessions[$record["sessionId"]] = true;
            }

            $eventName = $record["event"];
            $eventCounts[$eventName] = (int) ($eventCounts[$eventName] ?? 0) + 1;

            if ($record["path"] !== "") {
                $pathCounts[$record["path"]] = (int) ($pathCounts[$record["path"]] ?? 0) + 1;
            }

            if ($eventName === "cta_click") {
                $ctaId = $this->sanitizeText((string) ($record["properties"]["ctaId"] ?? ""), 100);
                if ($ctaId !== "") {
                    $ctaCounts[$ctaId] = (int) ($ctaCounts[$ctaId] ?? 0) + 1;
                }
            }

            if ($record["referrer"] !== "") {
                $referrerHost = $this->extractReferrerHost($record["referrer"]);
                if ($referrerHost !== "") {
                    $referrerCounts[$referrerHost] = (int) ($referrerCounts[$referrerHost] ?? 0) + 1;
                }
            }

            if ($timestampUnix > 0) {
                $hourBucket = intdiv($timestampUnix, 3600) * 3600;
                $dayBucket = intdiv($timestampUnix, 86400) * 86400;
                $weekBucket = intdiv($timestampUnix, 604800) * 604800;
                $hourBucketCounts[$hourBucket] = (int) ($hourBucketCounts[$hourBucket] ?? 0) + 1;
                $dayBucketCounts[$dayBucket] = (int) ($dayBucketCounts[$dayBucket] ?? 0) + 1;
                $weekBucketCounts[$weekBucket] = (int) ($weekBucketCounts[$weekBucket] ?? 0) + 1;

                $hourOfDay = (int) gmdate("G", $timestampUnix);
                $weekday = (int) gmdate("w", $timestampUnix);
                $hourOfDayCounts[$hourOfDay] = (int) ($hourOfDayCounts[$hourOfDay] ?? 0) + 1;
                $weekdayCounts[$weekday] = (int) ($weekdayCounts[$weekday] ?? 0) + 1;
            }
        });

        $effectiveFrom = $fromTimestamp ?? ($firstEventTimestamp > 0 ? $firstEventTimestamp : null);
        $effectiveTo = $toTimestamp ?? ($lastEventTimestamp > 0 ? $lastEventTimestamp : null);
        $trend = $this->buildTrendSeries($hourBucketCounts, $dayBucketCounts, $weekBucketCounts, $effectiveFrom, $effectiveTo);

        return [
            "totalEvents" => $totalEvents,
            "uniqueSessions" => count($sessions),
            "uniquePaths" => count($pathCounts),
            "firstEventAtUtc" => $firstEventAtUtc,
            "lastEventAtUtc" => $lastEventAtUtc,
            "range" => [
                "fromUtc" => $effectiveFrom !== null ? gmdate("Y-m-d H:i:s", $effectiveFrom) . " UTC" : "",
                "toUtc" => $effectiveTo !== null ? gmdate("Y-m-d H:i:s", $effectiveTo) . " UTC" : "",
                "fromFilter" => $fromFilter,
                "toFilter" => $toFilter
            ],
            "funnel" => [
                "pageView" => (int) ($eventCounts["page_view"] ?? 0),
                "ctaClick" => (int) ($eventCounts["cta_click"] ?? 0),
                "freeTrialClick" => (int) ($eventCounts["free_trial_click"] ?? 0),
                "uploadStart" => $this->metricCount($eventCounts, ["upload_start", "free_trial_upload_start"]),
                "uploadSuccess" => $this->metricCount($eventCounts, ["upload_success", "free_trial_upload_success"]),
                "contactSubmit" => $this->metricCount($eventCounts, ["contact_submit", "contact_submit_success"])
            ],
            "trend" => $trend,
            "eventsByHour" => $this->hourDistribution($hourOfDayCounts),
            "eventsByWeekday" => $this->weekdayDistribution($weekdayCounts),
            "topEvents" => $this->topCounts($eventCounts, 10),
            "topPaths" => $this->topCounts($pathCounts, 10),
            "topCtas" => $this->topCounts($ctaCounts, 10),
            "topReferrers" => $this->topCounts($referrerCounts, 10)
        ];
    }

    public function getEventsFilePath(): string
    {
        return $this->eventsPath;
    }

    private function sanitizeEventName(string $value): string
    {
        $value = strtolower(trim($value));
        if ($value === "") {
            throw new InvalidArgumentException("Event name is required.");
        }
        if (preg_match('/^[a-z0-9:_-]{2,64}$/', $value) !== 1) {
            throw new InvalidArgumentException("Invalid event name format.");
        }
        return $value;
    }

    private function normalizeStoredEventName(string $value): string
    {
        $value = strtolower(trim($value));
        if (preg_match('/^[a-z0-9:_-]{2,64}$/', $value) !== 1) {
            return "";
        }
        return $value;
    }

    private function sanitizeText(string $value, int $maxLength): string
    {
        $clean = preg_replace('/\s+/', ' ', trim($value));
        $clean = $clean ?? "";
        if (mb_strlen($clean) > $maxLength) {
            return mb_substr($clean, 0, $maxLength);
        }
        return $clean;
    }

    private function normalizeProperties(mixed $value, int $depth): array
    {
        if ($depth <= 0 || !is_array($value)) {
            return [];
        }

        $result = [];
        $count = 0;
        foreach ($value as $key => $item) {
            if ($count >= $this->maxProperties) {
                break;
            }

            $name = $this->sanitizeText((string) $key, 80);
            if ($name === "") {
                continue;
            }

            $normalized = $this->normalizePropertyValue($item, $depth - 1);
            if ($normalized === null) {
                continue;
            }

            $result[$name] = $normalized;
            $count++;
        }

        return $result;
    }

    private function normalizePropertyValue(mixed $value, int $depth): mixed
    {
        if ($value === null) {
            return null;
        }

        if (is_bool($value) || is_int($value) || is_float($value)) {
            return $value;
        }

        if (is_string($value)) {
            return $this->sanitizeText($value, 500);
        }

        if (is_array($value) && $depth > 0) {
            if ($this->isList($value)) {
                $list = [];
                $limit = min(count($value), $this->maxProperties);
                for ($index = 0; $index < $limit; $index++) {
                    $item = $this->normalizePropertyValue($value[$index], $depth - 1);
                    if ($item !== null) {
                        $list[] = $item;
                    }
                }
                return $list;
            }
            return $this->normalizeProperties($value, $depth);
        }

        return null;
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

    private function ensureDir(string $path): void
    {
        if (!is_dir($path) && !mkdir($path, 0755, true) && !is_dir($path)) {
            throw new RuntimeException("Unable to create analytics directory.");
        }
    }

    private function appendLineWithLock(string $line): void
    {
        $lock = fopen($this->lockPath, "c+");
        if ($lock === false) {
            throw new RuntimeException("Failed to open analytics lock.");
        }

        try {
            if (!flock($lock, LOCK_EX)) {
                throw new RuntimeException("Failed to lock analytics stream.");
            }

            $bytes = file_put_contents($this->eventsPath, $line, FILE_APPEND | LOCK_EX);
            if ($bytes === false) {
                throw new RuntimeException("Failed to write analytics event.");
            }
        } finally {
            flock($lock, LOCK_UN);
            fclose($lock);
        }
    }

    private function createEventId(): string
    {
        return gmdate("Ymd-His") . "-" . substr(bin2hex(random_bytes(4)), 0, 6);
    }

    private function forEachEvent(callable $callback): void
    {
        if (!is_file($this->eventsPath)) {
            return;
        }

        $stream = fopen($this->eventsPath, "rb");
        if ($stream === false) {
            throw new RuntimeException("Failed to read analytics events file.");
        }

        try {
            while (!feof($stream)) {
                $line = fgets($stream);
                if ($line === false) {
                    continue;
                }

                $trimmed = trim($line);
                if ($trimmed === "") {
                    continue;
                }

                try {
                    $decoded = json_decode($trimmed, true, 512, JSON_THROW_ON_ERROR);
                } catch (JsonException $exception) {
                    continue;
                }

                if (!is_array($decoded)) {
                    continue;
                }

                $callback($decoded);
            }
        } finally {
            fclose($stream);
        }
    }

    private function normalizeStoredRecord(array $raw): ?array
    {
        $eventName = $this->normalizeStoredEventName((string) ($raw["event"] ?? ""));
        if ($eventName === "") {
            return null;
        }

        $id = $this->sanitizeText((string) ($raw["id"] ?? ""), 80);
        $timestampServerUtc = $this->sanitizeText((string) ($raw["timestampServerUtc"] ?? ""), 100);
        $timestampClient = $this->sanitizeText((string) ($raw["timestampClient"] ?? ""), 100);
        $path = $this->sanitizeText((string) ($raw["path"] ?? ""), 500);
        $title = $this->sanitizeText((string) ($raw["title"] ?? ""), 300);
        $referrer = $this->sanitizeText((string) ($raw["referrer"] ?? ""), 800);
        $sessionId = $this->sanitizeText((string) ($raw["sessionId"] ?? ""), 120);
        $ipAddress = $this->sanitizeText((string) ($raw["ipAddress"] ?? ""), 80);
        $userAgent = $this->sanitizeText((string) ($raw["userAgent"] ?? ""), 500);
        $propertiesRaw = $raw["properties"] ?? [];
        $properties = $this->normalizeProperties($propertiesRaw, $this->maxDepth);
        $timestampUnix = $this->parseStoredTimestamp($timestampServerUtc, $timestampClient);

        return [
            "id" => $id,
            "event" => $eventName,
            "timestampServerUtc" => $timestampServerUtc,
            "timestampClient" => $timestampClient,
            "timestampUnix" => $timestampUnix,
            "path" => $path,
            "title" => $title,
            "referrer" => $referrer,
            "sessionId" => $sessionId,
            "ipAddress" => $ipAddress,
            "userAgent" => $userAgent,
            "properties" => $properties
        ];
    }

    /**
     * @return array{0:?int,1:?int}
     */
    private function parseRangeBounds(string $fromFilter, string $toFilter): array
    {
        $from = $this->parseRangeBound($fromFilter, false);
        $to = $this->parseRangeBound($toFilter, true);
        if ($from !== null && $to !== null && $from > $to) {
            throw new InvalidArgumentException("Invalid range: from must be before to.");
        }
        return [$from, $to];
    }

    private function parseRangeBound(string $value, bool $endOfDay): ?int
    {
        $raw = trim($value);
        if ($raw === "") {
            return null;
        }

        if (preg_match('/^\d{4}-\d{2}-\d{2}$/', $raw) === 1) {
            $raw .= $endOfDay ? " 23:59:59 UTC" : " 00:00:00 UTC";
        } elseif (preg_match('/(z|utc|[+-]\d{2}:?\d{2})$/i', $raw) !== 1) {
            $raw .= " UTC";
        }

        $timestamp = strtotime($raw);
        if ($timestamp === false) {
            throw new InvalidArgumentException("Invalid analytics range filter format.");
        }
        return (int) $timestamp;
    }

    private function parseStoredTimestamp(string $timestampServerUtc, string $timestampClient): int
    {
        $server = strtotime(trim($timestampServerUtc));
        if ($server !== false) {
            return (int) $server;
        }

        $clientRaw = trim($timestampClient);
        if ($clientRaw === "") {
            return 0;
        }
        if (preg_match('/(z|utc|[+-]\d{2}:?\d{2})$/i', $clientRaw) !== 1) {
            $clientRaw .= " UTC";
        }
        $client = strtotime($clientRaw);
        if ($client === false) {
            return 0;
        }
        return (int) $client;
    }

    private function buildTrendSeries(
        array $hourBucketCounts,
        array $dayBucketCounts,
        array $weekBucketCounts,
        ?int $fromTimestamp,
        ?int $toTimestamp
    ): array {
        if ($fromTimestamp === null || $toTimestamp === null || $fromTimestamp <= 0 || $toTimestamp <= 0 || $toTimestamp < $fromTimestamp) {
            return [
                "granularity" => "day",
                "points" => []
            ];
        }

        $rangeSeconds = max(1, $toTimestamp - $fromTimestamp);
        if ($rangeSeconds <= 72 * 3600) {
            $granularity = "hour";
            $step = 3600;
            $source = $hourBucketCounts;
        } elseif ($rangeSeconds <= 120 * 86400) {
            $granularity = "day";
            $step = 86400;
            $source = $dayBucketCounts;
        } else {
            $granularity = "week";
            $step = 604800;
            $source = $weekBucketCounts;
        }

        $start = intdiv($fromTimestamp, $step) * $step;
        $end = intdiv($toTimestamp, $step) * $step;
        $maxPoints = 520;
        $points = [];
        for ($cursor = $start; $cursor <= $end && count($points) < $maxPoints; $cursor += $step) {
            $points[] = [
                "bucketStartUtc" => gmdate("Y-m-d H:i:s", $cursor) . " UTC",
                "count" => (int) ($source[$cursor] ?? 0)
            ];
        }

        return [
            "granularity" => $granularity,
            "points" => $points
        ];
    }

    private function hourDistribution(array $hourOfDayCounts): array
    {
        $rows = [];
        for ($hour = 0; $hour < 24; $hour++) {
            $rows[] = [
                "name" => str_pad((string) $hour, 2, "0", STR_PAD_LEFT) . ":00",
                "count" => (int) ($hourOfDayCounts[$hour] ?? 0)
            ];
        }
        return $rows;
    }

    private function weekdayDistribution(array $weekdayCounts): array
    {
        $weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        $rows = [];
        foreach ($weekdayNames as $index => $name) {
            $rows[] = [
                "name" => $name,
                "count" => (int) ($weekdayCounts[$index] ?? 0)
            ];
        }
        return $rows;
    }

    private function extractReferrerHost(string $referrer): string
    {
        $value = trim($referrer);
        if ($value === "") {
            return "";
        }

        $host = parse_url($value, PHP_URL_HOST);
        if (!is_string($host) || $host === "") {
            $host = parse_url("https://" . ltrim($value, "/"), PHP_URL_HOST);
        }
        if (!is_string($host) || $host === "") {
            return "";
        }

        return strtolower($this->sanitizeText($host, 180));
    }

    private function metricCount(array $eventCounts, array $aliases): int
    {
        foreach ($aliases as $name) {
            if (isset($eventCounts[$name])) {
                return (int) $eventCounts[$name];
            }
        }
        return 0;
    }

    private function topCounts(array $counts, int $limit): array
    {
        $items = [];
        foreach ($counts as $name => $count) {
            $label = $this->sanitizeText((string) $name, 160);
            if ($label === "") {
                continue;
            }
            $items[] = [
                "name" => $label,
                "count" => max(0, (int) $count)
            ];
        }

        usort($items, static function (array $left, array $right): int {
            $countComparison = $right["count"] <=> $left["count"];
            if ($countComparison !== 0) {
                return $countComparison;
            }
            return strcmp((string) $left["name"], (string) $right["name"]);
        });

        return array_slice($items, 0, max(1, $limit));
    }
}
