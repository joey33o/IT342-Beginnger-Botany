
<?php

header("Content-Type: application/json");

// ==========================================
// CONFIGURATION
// ==========================================

// Keep this file OUTSIDE the public web directory.
// It should define $PERENUAL_KEY.
require_once "/var/www/private/keys.php";


// ==========================================
// RESPONSE HELPER
// ==========================================

function sendResponse($statusCode, $data) {

    http_response_code($statusCode);

    echo json_encode($data, JSON_UNESCAPED_SLASHES);

    exit;
}


// ==========================================
// API REQUEST HELPER
// ==========================================

// Makes an external GET request and returns decoded JSON.
function apiRequest($url) {

    $curl = curl_init();

    curl_setopt_array($curl, [
        CURLOPT_URL => $url,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CONNECTTIMEOUT => 10,
        CURLOPT_TIMEOUT => 30
    ]);

    $response = curl_exec($curl);

    if ($response === false) {

        $error = curl_error($curl);

        curl_close($curl);

        throw new Exception("External API connection failed: " . $error);

    }

    $httpCode = curl_getinfo($curl, CURLINFO_HTTP_CODE);

    curl_close($curl);

    if ($httpCode < 200 || $httpCode >= 300) {

        throw new Exception("External API returned HTTP " . $httpCode);

    }

    $data = json_decode($response, true);

    if (!is_array($data)) {

        throw new Exception("Invalid JSON received from external API.");

    }

    return $data;

}


// ==========================================
// STEP 1: ZIP CODE -> GROWING ZONE
// ==========================================

function getGrowingZone($zip) {

    $url = "https://phzmapi.org/" . $zip . ".json";

    $data = apiRequest($url);

    if (!isset($data["zone"])) {

        throw new Exception("Growing zone not found.");

    }

    return $data["zone"];

}


// ==========================================
// STEP 2: GROWING ZONE -> PLANTS
// ==========================================

function getPlants($zoneNumber, $apiKey) {

    // Difficulty classifications
    $levels = [

        [
            "name" => "Easy",
            "watering" => "minimum",
            "className" => "level-easy"
        ],

        [
            "name" => "Moderate",
            "watering" => "average",
            "className" => "level-moderate"
        ],

        [
            "name" => "Hard",
            "watering" => "frequent",
            "className" => "level-hard"
        ]

    ];

    $plants = [];

    // Make one Perenual request per difficulty level.
    foreach ($levels as $level) {

        $parameters = [

            "key" => $apiKey,
            "hardiness" => $zoneNumber,
            "edible" => 1,
            "watering" => $level["watering"]

        ];

        $url = "https://perenual.com/api/v2/species-list?"
            . http_build_query($parameters);

        $data = apiRequest($url);

        if (!isset($data["data"]) || !is_array($data["data"])) {

            throw new Exception("Invalid plant data received from Perenual.");

        }

        // Process each returned plant.
        foreach ($data["data"] as $plant) {

            // Ignore malformed entries.
            if (!is_array($plant) || !isset($plant["id"])) {
                continue;
            }

            // Ignore API upgrade messages.
            if (
                !isset($plant["common_name"]) ||
                strpos((string)$plant["common_name"], "Upgrade") !== false
            ) {
                continue;
            }

            // Ensure JavaScript receives the expected data types.
            $plant["common_name"] = (string)$plant["common_name"];

            $plant["scientific_name"] =
                isset($plant["scientific_name"]) &&
                is_array($plant["scientific_name"])
                    ? $plant["scientific_name"]
                    : [];

            $plant["default_image"] =
                isset($plant["default_image"]) &&
                is_array($plant["default_image"])
                    ? $plant["default_image"]
                    : null;

            // Assign difficulty information.
            $plant["level"] = [

                "name" => $level["name"],
                "className" => $level["className"]

            ];

            $plants[] = $plant;

        }

    }

    return $plants;

}


// ==========================================
// STEP 3: PLANT ID -> PLANT DETAILS
// ==========================================

function getPlantDetails($plantId, $apiKey) {

    $parameters = [
        "key" => $apiKey
    ];

    $url = "https://perenual.com/api/v2/species/details/"
        . $plantId . "?"
        . http_build_query($parameters);

    $data = apiRequest($url);

    if (!isset($data["id"])) {

        throw new Exception("Plant details not found.");

    }

    return $data;

}


// ==========================================
// MAIN REQUEST HANDLER
// ==========================================

// Only accept POST requests.
if ($_SERVER["REQUEST_METHOD"] !== "POST") {

    header("Allow: POST");

    sendResponse(405, [
        "status" => "error",
        "message" => "POST requests only."
    ]);

}


// Retrieve JSON from frontend.
$request = json_decode(file_get_contents("php://input"), true);


// Validate request.
if (!is_array($request)) {

    sendResponse(400, [
        "status" => "error",
        "message" => "Invalid request data."
    ]);

}


// Validate API key.
if (!isset($PERENUAL_KEY) || $PERENUAL_KEY === "") {

    error_log("Perenual API key is missing.");

    sendResponse(500, [
        "status" => "error",
        "message" => "Plant service is currently unavailable."
    ]);

}


// Determine requested action.
// If no action is provided, default to ZIP search.
$action = $request["action"] ?? "search";


// ==========================================
// ACTION 1: GET PLANT DETAILS
// ==========================================

if ($action === "details") {

    // Retrieve plant ID.
    $plantId = filter_var(
        $request["plantId"] ?? null,
        FILTER_VALIDATE_INT
    );

    // Validate plant ID.
    if ($plantId === false || $plantId === null || $plantId <= 0) {

        sendResponse(400, [
            "status" => "error",
            "message" => "Invalid plant ID."
        ]);

    }

    try {

        // Retrieve details for the selected plant.
        $plant = getPlantDetails($plantId, $PERENUAL_KEY);

        // Return plant details to JavaScript.
        sendResponse(200, [

            "status" => "success",
            "plant" => $plant

        ]);

    } catch (Exception $error) {

        error_log("Plant Details Error: " . $error->getMessage());

        sendResponse(502, [
            "status" => "error",
            "message" => "Unable to retrieve plant details."
        ]);

    }

}


// ==========================================
// ACTION 2: ZIP SEARCH
// ==========================================

elseif ($action === "search") {

    // Retrieve ZIP code.
    $zip = $request["zip"] ?? "";

    // Validate ZIP code.
    if (!preg_match("/^[0-9]{5}$/", $zip)) {

        sendResponse(400, [
            "status" => "error",
            "message" => "Enter a valid 5-digit ZIP code."
        ]);

    }

    try {

        // API CALL 1:
        // Retrieve growing zone using ZIP code.
        $zone = getGrowingZone($zip);

        // Convert zone "7b" into integer 7.
        $zoneNumber = (int)$zone;

        // API CALL 2:
        // Retrieve plants using the growing zone.
        // Internally performs three Perenual requests.
        $plants = getPlants($zoneNumber, $PERENUAL_KEY);

        // Return final response to JavaScript.
        sendResponse(200, [

            "status" => "success",
            "zip" => $zip,
            "zone" => $zone,
            "plants" => $plants

        ]);

    } catch (Exception $error) {

        error_log("Plant API Error: " . $error->getMessage());

        sendResponse(502, [
            "status" => "error",
            "message" => "Unable to retrieve plant information. Please try again."
        ]);

    }

}


// ==========================================
// INVALID ACTION
// ==========================================

else {

    sendResponse(400, [
        "status" => "error",
        "message" => "Invalid API action."
    ]);

}

?>
