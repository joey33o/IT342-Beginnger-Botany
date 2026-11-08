// ===== LOGIN PAGE: step 1 is username + password, step 2 is the 6-digit email code =====

// Our server's web address. 
// NOTE: Leave it empty for "demo mode", which skips the server so we can test.
const API_BASE = "";

// Grab the page parts we'll use, by the ids set in login.html.
const loginForm = document.getElementById("loginForm");
const codeForm = document.getElementById("codeForm");
const loginError = document.getElementById("loginError");
const codeError = document.getElementById("codeError");

// A valid username: 3–30 letters, numbers, _ or . (the server must check this too).
const USERNAME_RULE = /^[A-Za-z0-9_.]{3,30}$/;


// ===== Helpers =====

// Turns a box's red outline and error message on or off, and tells screen readers about it.
function markField(input, isValid, errorId, message) {
    input.classList.toggle("is-invalid", !isValid);
    input.setAttribute("aria-invalid", String(!isValid));
    document.getElementById(errorId).textContent = isValid ? "" : message;
}

// Shows a red alert as plain text (so it can't run as code), or hides it if the message is empty.
function showError(box, message) {
    box.textContent = message;
    box.classList.toggle("d-none", !message);
}

// Greys out a button while we wait, so it can't be clicked twice.
function setBusy(button, busy, busyText, normalText) {
    button.disabled = busy;
    button.textContent = busy ? busyText : normalText;
}


// ===== Show / hide password button =====
const passwordInput = document.getElementById("password");
const toggleButton = document.getElementById("togglePassword");

toggleButton.addEventListener("click", () => {
    const hidden = passwordInput.type === "password"; // are we showing dots right now?
    passwordInput.type = hidden ? "text" : "password";
    toggleButton.textContent = hidden ? "Hide" : "Show";
    toggleButton.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
});


// ===== Step 1: username + password (runs when "Log In" is clicked) =====
loginForm.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop the page from reloading; we handle it here
    showError(loginError, "");

    // Read the boxes (extra spaces trimmed from the username, password left as typed).
    const usernameInput = loginForm.username;
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    // Check both boxes and mark any problems.
    const usernameOk = USERNAME_RULE.test(username);
    const passwordOk = password.length > 0;
    markField(usernameInput, usernameOk, "usernameError", "Enter your username (letters, numbers, _ or . only).");
    markField(passwordInput, passwordOk, "passwordError", "Enter your password.");

    // If something's wrong, put the cursor in the first bad box and stop.
    if (!usernameOk || !passwordOk) {
        (usernameOk ? passwordInput : usernameInput).focus();
        return;
    }

    const button = document.getElementById("loginBtn");
    setBusy(button, true, "Checking...", "Log In");

    try {
        // Send the login to the server (skipped in demo mode); if it's right, the server emails the code.
        if (API_BASE) {
            const response = await fetch(API_BASE + "/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password })
            });
            // Same message for a wrong username or password, so nobody can tell which usernames exist.
            if (!response.ok) throw new Error("Wrong username or password.");
        }

        // It worked: swap step 1 for step 2 and put the cursor in the code box.
        loginForm.classList.add("d-none");
        codeForm.classList.remove("d-none");
        codeForm.code.focus();
    } catch (err) {
        showError(loginError, err.message || "Something went wrong. Please try again.");
    } finally {
        setBusy(button, false, "", "Log In"); // make the button clickable again either way
    }
});


// ===== Step 2: the 6-digit email code =====
const codeInput = document.getElementById("code");

// Quietly removes anything that isn't a number as they type.
codeInput.addEventListener("input", () => {
    codeInput.value = codeInput.value.replace(/\D/g, "");
});

// Runs when "Verify" is clicked.
codeForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    showError(codeError, "");

    // The code has to be exactly 6 numbers.
    const code = codeInput.value.trim();
    const codeOk = /^\d{6}$/.test(code);
    markField(codeInput, codeOk, "codeInvalid", "The code is 6 numbers.");
    if (!codeOk) {
        codeInput.focus();
        return;
    }

    const button = document.getElementById("codeBtn");
    setBusy(button, true, "Verifying...", "Verify");

    try {
        // Ask the server if the code matches the one it emailed (skipped in demo mode).
        if (API_BASE) {
            const response = await fetch(API_BASE + "/auth/verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: loginForm.username.value.trim(), code })
            });
            if (!response.ok) throw new Error("That code didn't work. Check your email and try again.");
        }

        window.location.href = "index.html"; // code accepted: off to the home page
    } catch (err) {
        showError(codeError, err.message);
        setBusy(button, false, "", "Verify");
    }
});