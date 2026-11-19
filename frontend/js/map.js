window.authReady.then(function (username) {

    if (username) {

        console.log("Logged in as: " + username);

        // Example: display username somewhere else.
        document.getElementById("customName").textContent = username + "'s Local Garden";


    }else{
        window.location.replace("/html/home.html");
    }

    //we need to make it so that the home page is not accessable by people unless the user is logged in
    //here is where we will also check if a variabele is set and decide which navbar should be used

});


// ===== MAP PAGE: type a ZIP code, get its growing zone, and list plants from easiest to hardest =====

// The three difficulty levels, easiest first.
// Perenual can filter plants by how much watering they need, so we use that:
// less watering = easier for a beginner.
const LEVELS = [
    { name: "Easy", watering: "minimum", className: "level-easy" },
    { name: "Moderate", watering: "average", className: "level-moderate" },
    { name: "Hard", watering: "frequent", className: "level-hard" }
];

// Grab the page parts we use.
const searchForm = document.getElementById("zoneSearch");
const zipInput = document.getElementById("zip");
const searchStatus = document.getElementById("searchStatus");
const zoneChip = document.getElementById("zoneChip");
const plantTitle = document.getElementById("plantTitle");
const plantCount = document.getElementById("plantCount");
const plantList = document.getElementById("plantList");
const listView = document.getElementById("plantListView");
const detailView = document.getElementById("plantDetailView");

let lastPlantButton = null; // the plant that was clicked, so "Back" can return to it


// ===== Small helpers =====

// Makes a page element with a class and some text.
function make(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

// Makes the first letter a capital ("prairie onion" becomes "Prairie onion").
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}

// Perenual's free plan sometimes sends "Upgrade Plans..." instead of real info; this spots that.
function isRealInfo(value) {
    if (!value) {
        return false;
    }
    if (String(value).includes("Upgrade")) {
        return false;
    }
    return true;
}

// Shows a message under the search box (red when it's a problem).
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

// Checks that keys.js has a Perenual key in it.
function hasKey() {
    if (typeof PERENUAL_KEY === "undefined" || PERENUAL_KEY === "") {
        return false;
    }
    return true;
}


// ===== Step 1: ZIP code → growing zone (phzmapi.org, no key needed) =====
async function getZone(zip) {
    const response = await fetch("https://phzmapi.org/" + zip + ".json");
    if (!response.ok) {
        return null;
    }
    return await response.json(); // like { "zone": "7b", "temperature_range": "5 to 10", ... }
}


// ===== Step 2: growing zone → plants (Perenual), easiest first =====
// One request per level (Easy, then Moderate, then Hard), so the list comes out already sorted.
async function getPlants(zoneNumber) {
    const plants = [];

    for (let i = 0; i < LEVELS.length; i++) {
        const level = LEVELS[i];
        const url = "https://perenual.com/api/v2/species-list?key=" + PERENUAL_KEY
            + "&hardiness=" + zoneNumber + "&edible=1&watering=" + level.watering;

        const response = await fetch(url);
        const data = await response.json();

        if (data.data) {
            for (let j = 0; j < data.data.length; j++) {
                const plant = data.data[j];
                plant.level = level; // remember which difficulty this plant is
                plants.push(plant);
            }
        }
    }

    return plants;
}


// ===== The plant list =====

// Fills the list with one button per plant.
function drawPlantList(plants) {
    plantList.innerHTML = "";

    if (plants.length === 0) {
        plantList.appendChild(make("li", "text-muted", "No plants found for this zone."));
        return;
    }

    for (let i = 0; i < plants.length; i++) {
        const plant = plants[i];

        // The button: small photo, then the name with the difficulty under it.
        const button = make("button", "plant-option " + plant.level.className, "");
        button.type = "button";

        if (plant.default_image && isRealInfo(plant.default_image.thumbnail)) {
            const photo = document.createElement("img");
            photo.className = "plant-thumb";
            photo.src = plant.default_image.thumbnail;
            photo.alt = "";
            button.appendChild(photo);
        } else {
            button.appendChild(make("span", "plant-thumb", "🌱"));
        }

        const words = make("span", "plant-option-text", "");
        words.appendChild(make("span", "plant-option-name", capitalize(plant.common_name)));
        words.appendChild(make("span", "plant-option-level", plant.level.name));
        button.appendChild(words);

        button.addEventListener("click", function () {
            lastPlantButton = button;
            showPlant(plant);
        });

        const item = document.createElement("li");
        item.appendChild(button);
        plantList.appendChild(item);
    }
}


// ===== One plant's details =====

// Fills the list of facts, like "Sun: full sun".
function fillFacts(facts) {
    const list = document.getElementById("plantFacts");
    list.innerHTML = "";
    for (let i = 0; i < facts.length; i++) {
        list.appendChild(make("dt", "", facts[i][0]));
        list.appendChild(make("dd", "", facts[i][1]));
    }
}

// Hides the list and shows one plant.
async function showPlant(plant) {
    const photo = document.getElementById("plantPhoto");
    const source = document.getElementById("plantSource");
    const levelBadge = document.getElementById("plantLevel");

    // First, show what we already have from the list.
    document.getElementById("plantName").textContent = capitalize(plant.common_name);
    document.getElementById("plantLatin").textContent = plant.scientific_name[0];
    levelBadge.textContent = plant.level.name;
    levelBadge.className = "badge " + plant.level.className;

    photo.hidden = true;
    if (plant.default_image && isRealInfo(plant.default_image.medium_url)) {
        photo.src = plant.default_image.medium_url;
        photo.alt = "Photo of " + plant.common_name;
        photo.hidden = false;
    }

    fillFacts([]);
    source.textContent = "Loading more details...";

    listView.hidden = true;
    detailView.hidden = false;
    document.getElementById("plantName").focus(); // screen readers jump to the plant's name

    // Then ask Perenual for the rest of the details.
    try {
        const url = "https://perenual.com/api/v2/species/details/" + plant.id + "?key=" + PERENUAL_KEY;
        const response = await fetch(url);

        if (!response.ok) {
            source.textContent = "More details aren't available for this plant on our free plan.";
            return;
        }

        const details = await response.json();
        const facts = [];

        if (isRealInfo(details.sunlight)) {
            facts.push(["☀️ Sun", details.sunlight.join(", ")]);
        }
        if (isRealInfo(details.watering)) {
            facts.push(["💧 Water", details.watering]);
        }
        if (isRealInfo(details.care_level)) {
            facts.push(["✋ Care", details.care_level]);
        }
        if (isRealInfo(details.cycle)) {
            facts.push(["🔁 Cycle", details.cycle]);
        }
        if (isRealInfo(details.harvest_season)) {
            facts.push(["🧺 Harvest", details.harvest_season]);
        }
        if (details.hardiness && isRealInfo(details.hardiness.min)) {
            facts.push(["🗺️ Zones", details.hardiness.min + " to " + details.hardiness.max]);
        }

        fillFacts(facts);
        source.textContent = "Plant info from Perenual.";
    } catch (error) {
        source.textContent = "Couldn't load more details. Please try again.";
    }
}

// "Back to plants" shows the list again.
document.getElementById("plantBack").addEventListener("click", function () {
    detailView.hidden = true;
    listView.hidden = false;
    if (lastPlantButton) {
        lastPlantButton.focus();
    }
});


// ===== ZIP search: runs when the 🔍 button is clicked =====

// Removes anything that isn't a number as they type.
zipInput.addEventListener("input", function () {
    zipInput.value = zipInput.value.replace(/\D/g, "");
});

searchForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // stop the page from reloading
    const zip = zipInput.value.trim();

    if (!/^\d{5}$/.test(zip)) {
        showSearchMessage("Enter a 5-digit US ZIP code.", true);
        return;
    }
    if (!hasKey()) {
        showSearchMessage("Add your Perenual key to keys.js first.", true);
        return;
    }

    showSearchMessage("Looking up ZIP " + zip + "...", false);

    try {
        // Step 1: get the zone.
        const zoneData = await getZone(zip);
        if (zoneData === null) {
            showSearchMessage("We couldn't find a growing zone for " + zip + ".", true);
            return;
        }
        const zone = zoneData.zone;          // like "7b"
        const zoneNumber = parseInt(zone);   // Perenual wants just the number, so "7b" becomes 7

        zoneChip.textContent = "📍 ZIP " + zip + " · Zone " + zone;
        showSearchMessage("ZIP " + zip + " is in growing Zone " + zone + ". Finding plants... this can take a few seconds.", false);

        // Step 2: get the plants for that zone.
        const plants = await getPlants(zoneNumber);

        plantTitle.textContent = "Plants for Zone " + zone;
        plantCount.textContent = plants.length + " plants";
        detailView.hidden = true;
        listView.hidden = false;
        drawPlantList(plants);

        showSearchMessage("ZIP " + zip + " is in growing Zone " + zone + ".", false);
    } catch (error) {
        showSearchMessage("Something went wrong. Please try again.", true);
    }
});
