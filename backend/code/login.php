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
        $_SESSION["username"] = $databaseInfo["username"];
        $_SESSION["logged_in"] = true;
        header("Location: /html/map.html");
        exit();
    } else {
        $error = "Invalid Username or Password";
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
        if ($dbresponse && $cleanJSON["password"] === "qwerty"){
                //the database responded and its valid return the data from DB
                return $dbresponse;
        }
        else{
            error_log("DAtabase fucky qucky");
        }

        //password_verify($arrayOrigin["password"], $dbresponse["password"])
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





<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login | Beginner Botany</title>

    <!-- Bootstrap style kit; the "integrity" code is a fingerprint, so the browser rejects the file if anyone tampers with it. -->
    <link rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/css/bootstrap.min.css"
          integrity="sha384-sRIl4kxILFvY47J16cr9ZwB07vP4J8+LH7qKQnuqkuIAvNWLzeN8tE5YBujZqJLB"
          crossorigin="anonymous">

    <!-- Our styles load after Bootstrap, so ours win (green instead of blue). -->
<body class="auth-bg">

            <!-- The <div>s here are only for Bootstrap's layout; they mean nothing to screen readers. -->
            <div class="container">
                <a class="navbar-brand" href="home.html">🌱 Beginner Botany</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                        data-bs-target="#mainNav" aria-controls="mainNav"
                        aria-expanded="false" aria-label="Open menu">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="mainNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item"><a class="nav-link" href="home.html">Home</a></li>
                        <li class="nav-item"><a class="nav-link" href="map.html">Weather Map</a></li>
                        <li class="nav-item"><a class="nav-link" href="blog.html">Blog</a></li>
                        <li class="nav-item"><a class="nav-link" href="about.html">About Us</a></li>
                        <li class="nav-item"><a class="nav-link active" aria-current="page" href="login.html">Login</a></li>
                    </ul>
                </div>
            </div>
        </nav>
    </header>

    <!-- ===== LOGIN CARD: <main> is the page's main content; the <section> is the white card ===== -->
    <main id="main" class="container d-flex align-items-center justify-content-center py-5">
        <section class="card auth-card shadow w-100" aria-labelledby="pageTitle">

            <!-- STEP 1: username + password ("novalidate" swaps the browser's pop-ups for our own messages). -->
            <form id="loginForm" method="POST" action="/html/login.html" class="card-body p-4 p-sm-5" novalidate>
                <header class="text-center mb-4">
                    <span class="auth-icon" aria-hidden="true">🌿</span>
                    <h1 class="h3 fw-bold mb-1" id="pageTitle">Welcome back</h1>
                    <p class="text-muted mb-0">Log in to check on your garden</p>
                    <p class="text-muted mb-0"><?php echo ($error) ?> </p>
                </header>

                <!-- Each <div> below just groups a label, box and message; aria-describedby links a box to its messages for screen readers. -->
                <div class="mb-3">
                    <label for="username" class="form-label fw-semibold">Username</label>
                    <input type="text" class="form-control" id="username" name="username"
                           autocomplete="username" maxlength="30" required
                           aria-describedby="usernameError">
                    <p class="invalid-feedback mb-0" id="usernameError"></p>
                </div>

                <div class="mb-2">
                    <label for="password" class="form-label fw-semibold">Password</label>
                    <div class="input-group has-validation">
                        <input type="password" class="form-control" id="password" name="password"
                               autocomplete="current-password" maxlength="128" required
                               aria-describedby="passwordError">
                        <button class="btn btn-outline-primary" type="button" id="togglePassword"
                                aria-controls="password" aria-label="Show password">Show</button>
                        <p class="invalid-feedback mb-0" id="passwordError"></p>
                    </div>
                </div>

                <!-- Red alert, hidden until a login fails; role="alert" makes screen readers read it right away. -->
                <p class="alert alert-danger d-none mt-3 mb-0 py-2" id="loginError" role="alert"></p>

                <button type="submit" class="btn btn-primary btn-lg w-100 mt-4" id="loginBtn">
                    Log In
                </button>

                <p class="text-center mt-4 mb-0">
                    New to gardening? <a href="register.html" class="fw-semibold">Create an account</a>
                </p>
            </form>

            <!-- STEP 2: the 6-digit email code, hidden (d-none) until step 1 succeeds. -->
            <form id="codeForm" class="card-body p-4 p-sm-5 d-none" novalidate aria-labelledby="codeTitle">
                <header class="text-center mb-4">
                    <span class="auth-icon" aria-hidden="true">📧</span>
                    <h1 class="h3 fw-bold mb-1" id="codeTitle" tabindex="-1">Check your email</h1>
                    <p class="text-muted mb-0" id="codeHelp">We sent a 6-digit code to the email on your account.</p>
                </header>

                <div class="mb-2">
                    <label for="code" class="form-label fw-semibold">Verification code</label>
                    <input type="text" class="form-control code-input" id="code" name="code"
                           inputmode="numeric" autocomplete="one-time-code" maxlength="6" required
                           aria-describedby="codeHelp codeInvalid">
                    <p class="invalid-feedback mb-0" id="codeInvalid"></p>
                </div>

                <p class="alert alert-danger d-none mt-3 mb-0 py-2" id="codeError" role="alert"></p>

                <button type="submit" class="btn btn-primary btn-lg w-100 mt-4" id="codeBtn">
                    Verify
                </button>

                <p class="text-center mt-4 mb-0">
                    <a href="login.html">Back to login</a>
                </p>
            </form>

        </section>
    </main>

    <!-- ===== FOOTER ===== -->
    <footer class="footer-verdant text-center py-3">
        <small>Beginner Botany &middot; IT 342 Group Project</small>
    </footer>

    <!-- Bootstrap's script makes the phone menu button work (same fingerprint check as above). -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-FKyoEForCGlyvwx9Hj09JcYn3nv7wiPVlz7YYwJrWVcXK/BmnVDxM+D2scQbITxI"
            crossorigin="anonymous"></script>
</body>
</html>
    <!-- ===== TOP MENU: <header> and <nav> let screen readers find or skip the menu ===== -->
    <header>
        <nav class="navbar navbar-expand-md navbar-dark navbar-verdant" aria-label="Main">

    <!-- Hidden until someone presses Tab; lets keyboard users skip past the menu. -->
    <a class="visually-hidden-focusable skip-link" href="#main">Skip to main content</a>
    <link rel="stylesheet" href="../css/theme.css">
    <link rel="stylesheet" href="../css/auth.css">

