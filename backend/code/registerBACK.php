<?php

ini_set("pcre.jit", "0");
header("Content-Type: application/json");

if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    header("Allow: POST");
    rejectRegistrationInput(405, "Send a POST request.");
}

try {
    $data = json_decode(file_get_contents("php://input"), true, 512, JSON_THROW_ON_ERROR);
} catch (JsonException $error) {
    rejectRegistrationInput(400, "Send valid JSON.");
}

$username = $data["username"] ?? null;
$email = $data["email"] ?? null;
$password = $data["password"] ?? null;
$zip = $data["zip"] ?? null;

if (!is_string($username) || preg_match('/\A[A-Za-z0-9_.]{3,30}\z/', $username) !== 1) {
    rejectRegistrationInput(400, "Use 3–30 letters, numbers, _ or . in your username.");
}

// Match JavaScript's whitespace characters and exclude @ inside each email part.
$emailPart = '[^\p{Zs}\x{0009}-\x{000D}\x{2028}\x{2029}\x{FEFF}@]';
// A single supplementary character counts as two in JavaScript.
$emailSuffix = '(?:' . $emailPart . '{2,}|[\x{10000}-\x{10FFFF}])';
$emailRegex = '/\A' . $emailPart . '+@' . $emailPart . '+\.' . $emailSuffix . '\z/u';
if (!is_string($email) || preg_match($emailRegex, $email) !== 1) {
    rejectRegistrationInput(400, "Enter a valid email address.");
}

if (!is_string($password) || !validRegistrationPassword($password)) {
    rejectRegistrationInput(400, "Use at least 8 characters with a letter and a number.");
}

if (!is_string($zip) || preg_match('/\A[0-9]{5}\z/', $zip) !== 1) {
    rejectRegistrationInput(400, "Enter a 5-digit US ZIP code.");
}

require_once __DIR__ . "/connection.php";
session_start();

checkUsernameExists($pdo, $username);
$dbresponse = attemptRegister($pdo, [
    "username" => $username,
    "email" => $email,
    "password" => $password,
    "zip" => $zip,
]);

if ($dbresponse) {
    echo json_encode([
        "success" => true,
        "message" => "Login successful",
        "redirect" => "/html/map.html",
    ]);
} else {
    echo json_encode(["success" => "No DB response from register"]);
}

function validRegistrationPassword($password)
{
    // JavaScript counts UTF-16 units. Supplementary characters count twice.
    $length = preg_match_all('/./us', $password)
        + preg_match_all('/[\x{10000}-\x{10FFFF}]/u', $password);

    return $length >= 8
        && preg_match('/[A-Za-z]/', $password) === 1
        && preg_match('/[0-9]/', $password) === 1;
}

function rejectRegistrationInput($status, $message)
{
    http_response_code($status);
    echo json_encode(["success" => false, "message" => $message]);
    exit;
}

//PDO to register the USER
function attemptRegister($pdo, $cleanJSON){
            //Set up PDO request 
            $sql = "INSERT INTO users (username, email, password, zip)
                    VALUES (:username, :email, :password, :zip)";

            //Use a try catch to look for any errors
            try {
                $stmt = $pdo->prepare($sql);
                
                //will hold true or false if the SQL worked 
                $result = $stmt->execute([
                    ":username" => $cleanJSON["username"],
                    ":email"     => $cleanJSON["email"],
                    //using password_hash to hash the password before inserting into the DB
                    ":password"  => password_hash($cleanJSON["password"], PASSWORD_DEFAULT),
                    ":zip"      => $cleanJSON["zip"]
                ]);

                //check if the SQL succeded return true or false
                if ($result) {
                    //this is MySQL code to get the last inputed index and use that to grab the user data from table
                    $newUserId = $pdo->lastInsertId();

                    //prepre the sql to get everything where id = the id we got above
                    $userStmt = $pdo->prepare("SELECT * FROM users WHERE id = :id");
                    $userStmt->execute([':id' => $newUserId]);
                    
                    //return the proper JSON
                    return $userStmt->fetch(PDO::FETCH_ASSOC);

                } else {
                    return false;
                }
            } catch (PDOException $e) {
                //Log the error message for debugging
                error_log("Registration SQL error: " . $e->getMessage());
                return false;
            }       
}

//function to grab user data to prepare to send it back to client
function serverReturn($dbresponse){
        //if the data exists
        if($dbresponse){

                //establish proper http code
                http_response_code(200);

                //get Session Token
                $sessionToken = 123;

                //$sessionToken = require createToken.php

                //build out template for proper response
                $goodResponse = [
                        "token" => $sessionToken,
                        "userID" => $dbresponse["id"],
                        "name" => $dbresponse["firstname"],
                        "type" => $dbresponse["type"]
                ];

                //send out data and exit
                echo json_encode($goodResponse);
                exit;
        }else {
                //create an error response for the front end to catch
                http_response_code(400);

                //build out template for bad response
                $badRequest = [
                        "message" => "nothing from DB"
                ];

                //send data back and exit
                echo json_encode($badRequest);
                exit;
        }
}

//check if the username already exists
function checkUsernameExists($pdo, $username) {
    $stmt = $pdo->prepare("SELECT id FROM users WHERE username = :username LIMIT 1");
    $stmt->execute([":username" => $username]);

    if ($stmt->fetch(PDO::FETCH_ASSOC)) {
        http_response_code(409); // 409 Conflict
        echo json_encode([
            "success" => false,
            "message" => "That username is already taken. Please choose another."
        ]);
        exit();
    }
}
