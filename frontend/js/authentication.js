/*
    so now with this we are able to set up any global variables we want to have to make sure the page is personalized 
    we need to add this to eery page and then have a sctipt per page that determines whch nvbar and whatnot should go there 
*/

// Global variable accessible to other JavaScript files.
window.currentUser = null;

// Check the user's session when the page loads.
window.authReady = (async function () {

    try {

        const response = await fetch("/html/checkSession.html");

        if (!response.ok) {
            return null;
        }

        const data = await response.json();

        if (data.loggedIn) {

            window.currentUser = data.username;

            // Update navbar.
            document.getElementById("guestLinks")?.classList.add("d-none");
            document.getElementById("userLinks")?.classList.remove("d-none");

            // Display username.
            const usernameDisplay = document.getElementById("welcomeUser");

            if (usernameDisplay) {
                usernameDisplay.textContent = window.currentUser;
            }

            return window.currentUser;
        }

        return null;

    } catch (error) {

        console.error("Session check failed:", error);
        return null;

    }

})();