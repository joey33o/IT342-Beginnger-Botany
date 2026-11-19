
window.authReady.then(function (username) {

    if (username) {

        console.log("Logged in as: " + username);

        document.getElementById("customName").textContent =
            username + "'s Local Garden";

    } else {

        window.location.replace("/html/home.html");

    }

});


// ===== MAP PAGE =====

// Difficulty levels
const LEVELS = [
    { name: "Easy", watering: "minimum", className: "level-easy" },
    { name: "Moderate", watering: "average", className: "level-moderate" },
    { name: "Hard", watering: "frequent", className: "level-hard" }
];


// Grab page elements
const searchForm = document.getElementById("zoneSearch");
const zipInput = document.getElementById("zip");
const searchStatus = document.getElementById("searchStatus");
const zoneChip = document.getElementById("zoneChip");
const plantTitle = document.getElementById("plantTitle");
const plantCount = document.getElementById("plantCount");
const plantList = document.getElementById("plantList");
const listView = document.getElementById("plantListView");
const detailView = document.getElementById("plantDetailView");

let lastPlantButton = null;


// ===== HELPER FUNCTIONS =====

// Creates an HTML element
function make(tag, className, text) {

    const element = document.createElement(tag);

    element.className = className;
    element.textContent = text;

    return element;

}


// Capitalizes first letter
function capitalize(text) {

    return text.charAt(0).toUpperCase() + text.slice(1);

}


// Displays search messages
function showSearchMessage(text, isError) {

    searchStatus.textContent = text;

    if (isError) {

        searchStatus.classList.add("error");
        zipInput.classList.add("is-invalid");

    } else {

        searchStatus.classList.remove("error");
        zipInput.classList.remove("is-invalid");

    }

}


// ===== PLANT LIST =====

// Populates the plant list using PHP response data
function drawPlantList(plants) {

    plantList.innerHTML = "";

    if (!plants || plants.length === 0) {

        plantList.appendChild(
            make("li", "text-muted", "No plants found for this zone.")
        );

        return;

    }

    for (let i = 0; i < plants.length; i++) {

        const plant = plants[i];

        // Create plant button
        const button = make(
            "button",
            "plant-option " + plant.level.className,
            ""
        );

        button.type = "button";

        // Plant image
        if (plant.default_image && plant.default_image.thumbnail) {

            const photo = document.createElement("img");

            photo.className = "plant-thumb";
            photo.src = plant.default_image.thumbnail;
            photo.alt = "";

            button.appendChild(photo);

        } else {

            button.appendChild(
                make("span", "plant-thumb", "🌱")
            );

        }

        // Plant name and difficulty
        const words = make("span", "plant-option-text", "");

        words.appendChild(
            make("span", "plant-option-name", capitalize(plant.common_name))
        );

        words.appendChild(
            make("span", "plant-option-level", plant.level.name)
        );

        button.appendChild(words);


        // Plant selection
        button.addEventListener("click", function () {

            lastPlantButton = button;

            showPlant(plant);

        });


        const item = document.createElement("li");

        item.appendChild(button);

        plantList.appendChild(item);

    }

}


// ===== PLANT DETAILS =====

// Populates plant facts
function fillFacts(facts) {

    const list = document.getElementById("plantFacts");

    list.innerHTML = "";

    for (let i = 0; i < facts.length; i++) {

        list.appendChild(make("dt", "", facts[i][0]));

        list.appendChild(make("dd", "", facts[i][1]));

    }

}


// Displays selected plant
async function showPlant(plant) {

    const photo = document.getElementById("plantPhoto");
    const source = document.getElementById("plantSource");
    const levelBadge = document.getElementById("plantLevel");

    document.getElementById("plantName").textContent =
        capitalize(plant.common_name);

    document.getElementById("plantLatin").textContent =
        plant.scientific_name[0];

    levelBadge.textContent = plant.level.name;

    levelBadge.className = "badge " + plant.level.className;


    photo.hidden = true;

    if (plant.default_image && plant.default_image.medium_url) {

        photo.src = plant.default_image.medium_url;

        photo.alt = "Photo of " + plant.common_name;

        photo.hidden = false;

    }


    // No detail API request here yet.
    // Plant details will need their own request to /plantAPI
    // when that functionality is implemented.

    fillFacts([]);

    source.textContent = "Plant details will be available soon.";

    listView.hidden = true;

    detailView.hidden = false;

    document.getElementById("plantName").focus();

}


// ===== BACK BUTTON =====

document.getElementById("plantBack").addEventListener("click", function () {

    detailView.hidden = true;

    listView.hidden = false;

    if (lastPlantButton) {

        lastPlantButton.focus();

    }

});


// ===== ZIP INPUT =====

// Only allow numbers
zipInput.addEventListener("input", function () {

    zipInput.value = zipInput.value.replace(/\D/g, "");

});


// ===== ZIP SEARCH =====

searchForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const zip = zipInput.value.trim();


    // Validate ZIP
    if (!/^\d{5}$/.test(zip)) {

        showSearchMessage("Enter a 5-digit US ZIP code.", true);

        return;

    }


    showSearchMessage("Looking up ZIP " + zip + "...", false);


    try {

        // Send ZIP to backend
        const response = await fetch("/plantAPI", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                zip: zip
            })

        });


        // Receive PHP response
        const data = await response.json();


        // Handle backend errors
        if (!response.ok || data.status !== "success") {

            showSearchMessage(
                data.message || "Unable to retrieve plant information.",
                true
            );

            return;

        }


        // Populate page using returned data
        zoneChip.textContent =
            "📍 ZIP " + data.zip + " · Zone " + data.zone;

        plantTitle.textContent =
            "Plants for Zone " + data.zone;

        plantCount.textContent =
            data.plants.length + " plants";


        // Display plants
        detailView.hidden = true;

        listView.hidden = false;

        drawPlantList(data.plants);


        showSearchMessage(
            "ZIP " + data.zip + " is in growing Zone " + data.zone + ".",
            false
        );


    } catch (error) {

        console.error("Plant API Error:", error);

        showSearchMessage(
            "Something went wrong. Please try again.",
            true
        );

    }

});
