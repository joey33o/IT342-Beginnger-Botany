// ===== LOGIN PAGE: step 1 is username + password, step 2 is the 6-digit email code =====

// Our server's web address.
// NOTE: Leave it empty for "demo mode", which skips the server so we can test.
const API_BASE = "";

// Username rule: 3 to 30 letters, numbers, _ or .
const usernamePattern = /^[A-Za-z0-9_.]{3,30}$/;

// Grab the page parts we use.
const loginForm = document.getElementById("loginForm");
const codeForm = document.getElementById("codeForm");
const usernameBox = document.getElementById("username");
const passwordBox = document.getElementById("password");
const codeBox = document.getElementById("code");
const showButton = document.getElementById("togglePassword");
const loginButton = document.getElementById("loginBtn");
const codeButton = document.getElementById("codeBtn");
const loginError = document.getElementById("loginError");
const codeError = document.getElementById("codeError");


// ===== Helpers =====

// Turns a box red with a message, or clears it.
function markBox(box, errorId, message) {
    const errorText = document.getElementById(errorId);
    errorText.textContent = message;
    if (message === "") {
        box.classList.remove("is-invalid");
        box.setAttribute("aria-invalid", "false");
    } else {
        box.classList.add("is-invalid");
        box.setAttribute("aria-invalid", "true");
    }
}

// Shows a red alert box with a message, or hides it when the message is empty.
function showAlert(alertBox, message) {
    alertBox.textContent = message;
    if (message === "") {
        alertBox.classList.add("d-none");
    } else {
        alertBox.classList.remove("d-none");
    }
}


// ===== Show / hide password button =====
showButton.addEventListener("click", function () {
    if (passwordBox.type === "password") {
        passwordBox.type = "text";
        showButton.textContent = "Hide";
        showButton.setAttribute("aria-label", "Hide password");
    } else {
        passwordBox.type = "password";
        showButton.textContent = "Show";
        showButton.setAttribute("aria-label", "Show password");
    }
});


// ===== Step 1: username + password (runs when "Log In" is clicked) =====
loginForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // stop the page from reloading
    showAlert(loginError, "");

    const username = usernameBox.value.trim();
    const password = passwordBox.value;

    // Check the username.
    let usernameOk = usernamePattern.test(username);
    if (usernameOk) {
        markBox(usernameBox, "usernameError", "");
    } else {
        markBox(usernameBox, "usernameError", "Enter your username (letters, numbers, _ or . only).");
    }

    // Check the password isn't empty.
    let passwordOk = password !== "";
    if (passwordOk) {
        markBox(passwordBox, "passwordError", "");
    } else {
        markBox(passwordBox, "passwordError", "Enter your password.");
    }

    // If something's wrong, put the cursor in the first bad box and stop.
    if (!usernameOk) {
        usernameBox.focus();
        return;
    }
    if (!passwordOk) {
        passwordBox.focus();
        return;
    }

    // Grey out the button while we wait.
    loginButton.disabled = true;
    loginButton.textContent = "Checking...";

    try {
        // Send the login to the server as JSON (skipped in demo mode); if it's right, the server emails the code.
        if (API_BASE !== "") {
            const response = await fetch(API_BASE + "/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: username, password: password })
            });

            // Same message for a wrong username or password, so nobody can guess which usernames exist.
            if (!response.ok) {
                showAlert(loginError, "Wrong username or password.");
                loginButton.disabled = false;
                loginButton.textContent = "Log In";
                return;
            }
        }

        // It worked: hide step 1, show step 2.
        loginForm.classList.add("d-none");
        codeForm.classList.remove("d-none");
        codeBox.focus();
    } catch (error) {
        showAlert(loginError, "Something went wrong. Please try again.");
    }

    loginButton.disabled = false;
    loginButton.textContent = "Log In";
});


// ===== Step 2: the 6-digit email code =====

// Removes anything that isn't a number as they type.
codeBox.addEventListener("input", function () {
    codeBox.value = codeBox.value.replace(/\D/g, "");
});

// Runs when "Verify" is clicked.
codeForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    showAlert(codeError, "");

    // The code has to be exactly 6 numbers.
    const code = codeBox.value.trim();
    if (!/^\d{6}$/.test(code)) {
        markBox(codeBox, "codeInvalid", "The code is 6 numbers.");
        codeBox.focus();
        return;
    }
    markBox(codeBox, "codeInvalid", "");

    codeButton.disabled = true;
    codeButton.textContent = "Verifying...";

    try {
        // Ask the server if the code matches the one it emailed (skipped in demo mode).
        if (API_BASE !== "") {
            const response = await fetch(API_BASE + "/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: usernameBox.value.trim(), code: code })
            });

            if (!response.ok) {
                showAlert(codeError, "That code didn't work. Check your email and try again.");
                codeButton.disabled = false;
                codeButton.textContent = "Verify";
                return;
            }
        }

        // Code accepted: go to the home page.
        window.location.href = "home.html";
    } catch (error) {
        showAlert(codeError, "Something went wrong. Please try again.");
        codeButton.disabled = false;
        codeButton.textContent = "Verify";
    }
});
