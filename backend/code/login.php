<?php

//Get the connection file to connect to the databse 
require_once "connection.php";

//Set the session thing to start recording session variables from the client to php
session_start();

// 1) check if its POST first and then prepare a proper associateive array
    //check for post request
    if ($_SERVER["REQUEST_METHOD"] == "POST" ){

        $username = $_POST["username"];
        $password = $_POST["password"];

        //Get a proper array built for it 
        $arrayOrigin = [
            "username" => $username,
            "password" => $password
        ];
    };

// 2) make pDO request to the database and check if it exists 

    if ($arrayOrigin){
        //Get the DB array
        $databaseInfo = attemptLogIn($pdo, $arrayOrigin);
        //Get the variables on the session 
        $_SESSION["username"] = $databaseInfo["username"];
        $_SESSION["logged_in"] = true;
    }
    if ($databaseInfo){
        header("Location: map.php");
    }




/*

=================== FUNCTIONS USED =====================================================================

*/

//function for checking if user exists
function attemptLogIn($pdo, $arrayOrigin){
        //prepare SQL to grab everything where email matches
        $stmt = $pdo->prepare("SELECT * FROM users WHERE username = ?");
        //execute the PDO request
        $stmt->execute([$arrayOrigin["username"]]);
        //Get the result as an associative array and store it in a variable
        $dbresponse = $stmt->fetch(PDO::FETCH_ASSOC);

        //check if the database responded with something 
        //ALSO check if password hash matches the hash on the database
        if ($dbresponse && $arrayOrigin["password"] === "qwerty"){
                //the database responded and its valid return the data from DB
                return $dbresponse;
        }
        else{
            error_log("DAtabase fucky qucky");
        }

        //password_verify($arrayOrigin["password"], $dbresponse["password"])
}



?>
