
<?php

// Start the existing PHP session.
session_start();

// Clear all session variables.
$_SESSION = [];

// Destroy the server-side session.
session_destroy();

// Redirect to login page.
header("Location: /html/login.html");
exit();

?>
