<?php

header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Allow: POST");
    rejectLoginInput(405, "Send a POST request.");
}

try {
    $data = json_decode(file_get_contents("php://input"), true, 512, JSON_THROW_ON_ERROR);
} catch (JsonException $error) {
    rejectLoginInput(400, "Send valid JSON.");
}

$username = $data["username"] ?? null;
$password = $data["password"] ?? null;

// Match the login form: a valid username and any nonempty password.
if (!is_string($username) || preg_match('/\A[A-Za-z0-9_.]{3,30}\z/', $username) !== 1) {
    rejectLoginInput(400, "Use 3–30 letters, numbers, _ or . in your username.");
}
if (!is_string($password) || $password === "") {
    rejectLoginInput(400, "Enter your password.");
}

require_once __DIR__ . "/connection.php";
session_start();

$databaseInfo = attemptLogIn($pdo, [
    "username" => $username,
    "password" => $password,
]);

if ($databaseInfo) {
    $_SESSION["username"] = $databaseInfo["username"];
    $_SESSION["logged_in"] = true;
    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "redirect" => "/html/map.html",
    ]);
} else {
    echo json_encode(["success" => "Invalid Username or Password"]);
}

function rejectLoginInput($status, $message)
{
    http_response_code($status);
    echo json_encode(["success" => false, "message" => $message]);
    exit;
}

//function for checking if user exists
function attemptLogIn($pdo, $cleanJSON){
        //prepare SQL to grab everything where email matches
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        //execute the PDO request
        $stmt->execute([$cleanJSON["username"]]);
        //Get the result as an associative array and store it in a variable
        $dbresponse = $stmt->fetch(PDO::FETCH_ASSOC);

        //check if the database responded with something
        //ALSO check if password hash matches the hash on the database
        if ($dbresponse && password_verify($cleanJSON["password"], $dbresponse["password"])){
                //the database responded and its valid return the data from DB
                return $dbresponse;
        }
        else{
            error_log("DAtabase fucky qucky");
        }

}
