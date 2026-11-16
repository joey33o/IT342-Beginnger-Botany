<?php
ini_set('pcre.jit', '0');
//Tells PHP this will be a script expecting JSON instead of the default HTML
header("content-Type: application/json");

//require the database connection
require_once "connection.php";

//initialize session
session_start();

//Grab the raw data from the request body
$rawInput = file_get_contents('php://input');

//if not POST
if($_SERVER["REQUEST_METHOD"] !== "POST") {
        //405 says you made the connectiopn but you are using the wrong HTTP method
        http_response_code(405);
}
elseif($_SERVER["REQUEST_METHOD"] === "POST") {

// 1) Check if valid JSON input

        //turn the data into a PHP array
        try{
                //Check if something is wrong
                $data = json_decode($rawInput, true, 512, JSON_THROW_ON_ERROR);

                //assign variables off of the JSON
                $user = $data["username"];
                $email = $data["email"];
                $password = $data["password"];
                $zipcode = $data["zip"];

                //prepare a valid JSON variable 
                $validUserJSON = [
                        "username" => $user,
                        "email" => $email,
                        "password" => $password,
                        "zip" => $zipcode,
                ];

        } catch (JsonException $error){
                //on an error give bad request code
                http_response_code(452);

                //build out the bad response json
                $badRequest = [
                        "message" => $error
                ];

                //send back error JSON
                echo json_encode($badRequest);
                exit;
        }
}
// 2) Validate the data server wise

        // //check if the JSOn is valid
        // if ($validUserJSON){
        //         //call the function to validate the data
        //         $cleanJSON = validateData($validUserJSON);
        // };

// 3) Attempt to make the PDO request

        //check if the CLEAN Json is there
        if ($validUserJSON){
                // Stop and return a 409 JSON error if the username already exists
                checkUsernameExists($pdo, $validUserJSON["username"]);
                //call the function to make PDO request
                $dbresponse = attemptRegister($pdo, $validUserJSON);

        }

// 4) Return data to the user

        //check if theres a response 
        if ($dbresponse){
            //echo the JSON to the front end
            echo json_encode([
                "success" => true,
                "message" => "Login successful",
                "redirect" => "/html/map.html"
                    ]);
            exit();
        } else {
            $error = "No DB response from register";
            echo json_encode([
                "success" => $error
                    ]);
            exit();
        }
        
/*
--------------------------FUNCTIONS FOR THIS SCRIPT ----------------------------------------------------------------------------
*/

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

//function for checking data validity will EXIT if not valid
function validateData($validUserJSON){
    //Define the regular expressions
    $emailRegex = '/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|edu|org)$/';
    $passwordRegex = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_+-])[A-Za-z\d@$!%*?&#_+-]{8,}$/';
    $nameRegex = "/^[A-Za-z]+$/";

    //check the first name
    if (preg_match($nameRegex, $validUserJSON["firstname"]) === 0) {
        //will send back code 406 for invalid data
            http_response_code(406);
            echo json_encode([
                    'success' => false,
                    'message' => "Invalid First Name"
            ]);
            exit;
    }
    //check the last name
    if (preg_match($nameRegex, $validUserJSON["lastname"]) === 0) {
            http_response_code(406);
            echo json_encode([
                    'success' => false,
                    'message' => "Invalid Last Name"
            ]);
            exit;
    }

    //check the email
    if (preg_match($emailRegex, $validUserJSON["email"]) === 0) {
            //will send back code 406 for invalid data
            http_response_code(406);
            echo json_encode([
                    'success' => false,
                    'message' => "Invalid Email Input\nPlease enter a valid email ending in .com, .edu, or .org"
            ]);
            exit;
    }

    //check the password
    if (preg_match($passwordRegex, $validUserJSON["password"]) === 0) {
            //will send back code 406 for invalid data
            http_response_code(406);
            echo json_encode([
                    'success' => false,
                    'message' => "InvalidPassword"
            ]);
            exit;
    }

    //prepare clean JSON and send back
    $cleanUserJSON = [
                    "firstname" => $validUserJSON["firstname"],
                    "lastname" => $validUserJSON["lastname"],
                    "email" => $validUserJSON["email"],
                    "password" => $validUserJSON["password"],
                    "type" => $validUserJSON["type"]
                ];
    return $cleanUserJSON;
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

?>