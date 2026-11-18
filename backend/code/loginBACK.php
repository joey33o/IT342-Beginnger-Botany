<?php

//Get the connection file to connect to the databse
require_once "connection.php";

//Grab the raw data from the request body
$rawInput = file_get_contents('php://input');

//Set the session thing to start recording session variables from the client to php
session_start();

// 1) check if its POST first and then prepare a proper associateive array
    //check for post request
    if ($_SERVER["REQUEST_METHOD"] == "POST" ){

        $data = json_decode($rawInput, true, 512, JSON_THROW_ON_ERROR);

        //assign variables off of the JSON
        $username = $data["username"];
        $password = $data["password"];

        //Get a proper array built for it
        $arrayOrigin = [
            "username" => $username,
            "password" => $password
        ];
    };

// 2) make pDO request to the database and check if it exists

    // if ($arrayOrigin){
    //     //Get the DB array
    //     $cleanJSON = validateData($arrayOrigin);
    // }
    if ($arrayOrigin){
        $databaseInfo = attemptLogIn($pdo, $arrayOrigin);
        // $_SESSION["username"] = $databaseInfo["username"];
        // $_SESSION["logged_in"] = true;
        // header("Location: /html/map.php");
    }
    if ($databaseInfo){
        //Store Session Variables
        $_SESSION["username"] = $databaseInfo["username"];
        $_SESSION["logged_in"] = true;
        //echo the JSON to the front end
        echo json_encode([
            "success" => true,
            "message" => "Login successful",
            "redirect" => "/html/map.html"
                ]);
        exit();
    } else {
        $error = "Invalid Username or Password";
        echo json_encode([
            "success" => $error
                ]);
        exit();
    }




/*

=================== FUNCTIONS USED =====================================================================

*/

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

//function for checking data validity
function validateData($arrayOrigin){

        //Define the regular expressions
        $userRegex = '/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.(com|edu|org)$/';
        $passwordRegex = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#_+-])[A-Za-z\d@$!%*?&#_+-]{8,}$/';

        //check the email
        if (preg_match($userRegex, $arrayOrigin["username"]) === 0) {
                //will send back code 406 for invalid data
                http_response_code(406);
                echo json_encode([
                        'success' => false,
                        'message' => "Invalid Email Input\nPlease enter a valid email ending in .com, .edu, or .org"
                ]);
                exit;
        }

        //check the password
        if (preg_match($passwordRegex, $arrayOrigin["password"]) === 0) {
                //will send back code 406 for invalid data
                http_response_code(406);
                echo json_encode([
                        'success' => false,
                        'message' => "InvalidPassword"
                ]);
                exit;
        }

        //set up return for clean values
        $cleanJSON = [
                "email" => $arrayOrigin["email"],
                "password" => $arrayOrigin["password"]
        ];

        //return the clean JSON
        return $cleanJSON;
}

?>
