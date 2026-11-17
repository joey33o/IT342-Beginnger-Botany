// ===== REGISTER PAGE: checks every box, then sends the new account to our server =====

// Our server's web address.
// NOTE: Leave it empty for "demo mode", which pretends sign-up worked so we can test.
const API_BASE = "";

// The rules for each box.
const usernamePattern = /^[A-Za-z0-9_.]{3,30}$/;        // 3 to 30 letters, numbers, _ or .
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;  // something@something.something
const zipPattern = /^\d{5}$/;                           // exactly 5 numbers

// Grab the page parts we use.
const form = document.getElementById("registerForm");
const usernameBox = document.getElementById("username");
const emailBox = document.getElementById("email");
const passwordBox = document.getElementById("password");
const confirmBox = document.getElementById("confirm");
const zipBox = document.getElementById("zip");
const showButton = document.getElementById("togglePassword");
const registerButton = document.getElementById("registerBtn");
const formMessage = document.getElementById("formMessage");

// Becomes true after the first "Create Account" click; then boxes re-check as you type.
let triedSubmit = false;


// ===== Helpers =====

// Password needs 8+ characters, a letter and a number.
function passwordIsGood(value) {
    return value.length >= 8 && /[A-Za-z]/.test(value) && /\d/.test(value);
}

// Turns a box red with a message, or green when the message is empty.
function markBox(box, errorId, message) {
    document.getElementById(errorId).textContent = message;
    if (message === "") {
        box.classList.remove("is-invalid");
        box.classList.add("is-valid");
        box.setAttribute("aria-invalid", "false");
    } else {
        box.classList.remove("is-valid");
        box.classList.add("is-invalid");
        box.setAttribute("aria-invalid", "true");
    }
}

// Checks every box, shows any problems, and gives back true if they're all fine.
function checkAllBoxes() {
    let allGood = true;

    if (usernamePattern.test(usernameBox.value.trim())) {
        markBox(usernameBox, "usernameError", "");
    } else {
        markBox(usernameBox, "usernameError", "Use 3–30 letters, numbers, _ or . (no spaces).");
        allGood = false;
    }

    if (emailPattern.test(emailBox.value.trim())) {
        markBox(emailBox, "emailError", "");
    } else {
        markBox(emailBox, "emailError", "Enter a valid email address.");
        allGood = false;
    }

    if (passwordIsGood(passwordBox.value)) {
        markBox(passwordBox, "passwordError", "");
    } else {
        markBox(passwordBox, "passwordError", "Your password doesn't meet all the rules below.");
        allGood = false;
    }

    if (confirmBox.value !== "" && confirmBox.value === passwordBox.value) {
        markBox(confirmBox, "confirmError", "");
    } else {
        markBox(confirmBox, "confirmError", "Passwords don't match.");
        allGood = false;
    }

    if (zipPattern.test(zipBox.value.trim())) {
        markBox(zipBox, "zipError", "");
    } else {
        markBox(zipBox, "zipError", "Enter a 5-digit US ZIP code.");
        allGood = false;
    }

    return allGood;
}

// Turns one checklist line green (met) or grey (not met).
function markRule(rule, isMet) {
    const line = document.querySelector('#passwordRules li[data-rule="' + rule + '"]');
    if (isMet) {
        line.classList.add("met");
    } else {
        line.classList.remove("met");
    }
}

// Shows the message box under the form; type is "success" (green) or "danger" (red).
function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "alert mt-3 mb-0 py-2 alert-" + type;
}


// ===== Re-check as they type, but only after the first "Create Account" click =====
form.addEventListener("input", function () {
    if (triedSubmit) {
        checkAllBoxes();
    }
});


// ===== Password checklist: each rule turns green as the password meets it =====
passwordBox.addEventListener("input", function () {
    const value = passwordBox.value;
    markRule("length", value.length >= 8);
    markRule("letter", /[A-Za-z]/.test(value));
    markRule("number", /\d/.test(value));
});


// ===== ZIP box: removes anything that isn't a number =====
zipBox.addEventListener("input", function () {
    zipBox.value = zipBox.value.replace(/\D/g, "");
});


// ===== Show / hide password button (changes both password boxes) =====
showButton.addEventListener("click", function () {
    if (passwordBox.type === "password") {
        passwordBox.type = "text";
        confirmBox.type = "text";
        showButton.textContent = "Hide";
        showButton.setAttribute("aria-label", "Hide password");
    } else {
        passwordBox.type = "password";
        confirmBox.type = "password";
        showButton.textContent = "Show";
        showButton.setAttribute("aria-label", "Show password");
    }
});


// ===== Create Account (runs when the button is clicked) =====
form.addEventListener("submit", async function (event) {
    event.preventDefault(); // stop the page from reloading
    formMessage.classList.add("d-none");
    triedSubmit = true;

    // If any box is wrong, put the cursor in the first bad one and stop.
    if (!checkAllBoxes()) {
        form.querySelector(".is-invalid").focus();
        return;
    }

    // Grey out the button while we wait.
    registerButton.disabled = true;
    registerButton.textContent = "Creating account...";

    // The new account ("confirm password" isn't sent; it only catches typos).
    const newUser = {
        username: usernameBox.value.trim(),
        email: emailBox.value.trim(),
        password: passwordBox.value,
        zip: zipBox.value.trim()
    };

    try {
        // Send it to the server as JSON (skipped in demo mode).
        if (API_BASE !== "") {
            const response = await fetch(API_BASE + "/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });

            // 409 means the username or email is already used.
            if (response.status === 409) {
                showMessage("That username or email is already taken.", "danger");
                registerButton.disabled = false;
                registerButton.textContent = "Create Account";
                return;
            }
            if (!response.ok) {
                showMessage("We couldn't create your account. Please try again.", "danger");
                registerButton.disabled = false;
                registerButton.textContent = "Create Account";
                return;
            }
        }

        // It worked: show a green message, then go to the login page after 1.5 seconds.
        showMessage("Account created! Taking you to the login page...", "success");
        setTimeout(function () {
            window.location.href = "login.html";
        }, 1500);
    } catch (error) {
        showMessage("Something went wrong. Please try again.", "danger");
        registerButton.disabled = false;
        registerButton.textContent = "Create Account";
    }
});
