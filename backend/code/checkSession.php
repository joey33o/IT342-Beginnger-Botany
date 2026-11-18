<?php

session_start();

header("Content-Type: application/json");

if (isset($_SESSION["logged_in"])) {

    echo json_encode([
        "loggedIn" => true,
        "username" => $_SESSION["username"]
    ]);

} else {

    http_response_code(401);

    echo json_encode([
        "loggedIn" => false
    ]);

}

?>