// ===== REGISTER PAGE: checks every box, then sends the new account to our server =====

// Our server's web address. Leave it empty for "demo mode", which pretends sign-up worked so we can test.
const API_BASE = "";

// Grab the page parts we'll use.
const form = document.getElementById("registerForm");
const formMessage = document.getElementById("formMessage");
const passwordInput = document.getElementById("password");

// Password rules, used both to check the password and to tick off the checklist.
const passwordRules = {
    length: (v) => v.length >= 8,        // 8 or more characters
    letter: (v) => /[A-Za-z]/.test(v),   // at least one letter
    number: (v) => /\d/.test(v)          // at least one number
};

// One check per box: gives back an error message, or "" if it's fine (the server must re-check these).
const checks = {
    username: (v) => /^[A-Za-z0-9_.]{3,30}$/.test(v)                      // 3–30 letters, numbers, _ or .
        ? "" : "Use 3–30 letters, numbers, _ or . (no spaces).",
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)                 // roughly something@something.something
        ? "" : "Enter a valid email address.",
    password: (v) => Object.values(passwordRules).every((rule) => rule(v)) // passes every password rule
        ? "" : "Your password doesn't meet all the rules below.",
    confirm: (v) => v !== "" && v === passwordInput.value                  // matches the first password box
        ? "" : "Passwords don't match.",
    zip: (v) => /^\d{5}$/.test(v)                                          // exactly 5 numbers
        ? "" : "Enter a 5-digit US ZIP code."
};


// ===== Helpers =====

// Gets what's typed in a box, trimming extra spaces (except in password boxes, where spaces count).
function valueOf(name) {
    const raw = form[name].value;
    return name === "password" || name === "confirm" ? raw : raw.trim();
}

// Checks one box, shows red or green plus a plain-text message, and gives back true if it's fine.
function checkField(name) {
    const message = checks[name](valueOf(name));
    document.getElementById(name + "Error").textContent = message;
    form[name].classList.toggle("is-invalid", message !== "");
    form[name].classList.toggle("is-valid", message === "");
    form[name].setAttribute("aria-invalid", String(message !== ""));
    return message === "";
}

// Shows the message box under the form; type is "success" (green) or "danger" (red).
function showMessage(text, type) {
    formMessage.textContent = text;
    formMessage.className = "alert mt-3 mb-0 py-2 alert-" + type;
}


// ===== Live re-checking: starts after the first "Create Account" click, so we don't nag mid-typing =====
let triedSubmit = false;

Object.keys(checks).forEach((name) => {
    form[name].addEventListener("input", () => {
        if (triedSubmit) checkField(name);
    });
});


// ===== Password checklist: turns each rule green as the password meets it =====
passwordInput.addEventListener("input", () => {
    const value = passwordInput.value;
    document.querySelectorAll("#passwordRules li").forEach((item) => {
        item.classList.toggle("met", passwordRules[item.dataset.rule](value)); // data-rule says which rule this line is
    });
    if (triedSubmit) checkField("confirm"); // re-check the match if they edit the password
});


// ===== ZIP box: quietly removes anything that isn't a number =====
form.zip.addEventListener("input", () => {
    form.zip.value = form.zip.value.replace(/\D/g, "");
});


// ===== Show / hide password button (switches both password boxes) =====
const toggleButton = document.getElementById("togglePassword");

toggleButton.addEventListener("click", () => {
    const hidden = passwordInput.type === "password"; // are we showing dots right now?
    passwordInput.type = hidden ? "text" : "password";
    form.confirm.type = passwordInput.type;           // keep both boxes the same
    toggleButton.textContent = hidden ? "Hide" : "Show";
    toggleButton.setAttribute("aria-label", hidden ? "Hide password" : "Show password");
});


// ===== Create Account (runs when the button is clicked) =====
form.addEventListener("submit", async (event) => {
    event.preventDefault(); // stop the page from reloading; we handle it here
    formMessage.classList.add("d-none");
    triedSubmit = true;

    // Check every box so all problems show at once; if any failed, jump to the first one.
    const results = Object.keys(checks).map(checkField);
    if (results.includes(false)) {
        form.querySelector(".is-invalid").focus();
        return;
    }

    // Grey out the button while we wait, so it can't be clicked twice.
    const button = document.getElementById("registerBtn");
    button.disabled = true;
    button.textContent = "Creating account...";

    // The new account's details ("confirm password" isn't sent; it was only there to catch typos).
    const newUser = {
        username: valueOf("username"),
        email: valueOf("email"),
        password: valueOf("password"), // the server scrambles this before saving; it's never stored as typed
        zip: valueOf("zip")
    };

    try {
        // Send it to the server (skipped in demo mode); 409 means "that already exists".
        if (API_BASE) {
            const response = await fetch(API_BASE + "/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUser)
            });
            if (response.status === 409) throw new Error("That username or email is already taken.");
            if (!response.ok) throw new Error("We couldn't create your account. Please try again.");
        }

        // It worked: show a green message, then go to the login page after 1.5 seconds.
        showMessage("Account created! Taking you to the login page...", "success");
        setTimeout(() => { window.location.href = "login.html"; }, 1500);
    } catch (err) {
        // It didn't work: show why and let them try again.
        showMessage(err.message, "danger");
        button.disabled = false;
        button.textContent = "Create Account";
    }
});