// ===== WEATHER MAP PAGE: the ZIP search and plant info are live; the weather is still sample data =====

// Our beginner plants; minZone/maxZone are the growing zones each one survives in (veggies grown for one summer work almost anywhere).
const PLANTS = [
    { minZone: 2, maxZone: 11, emoji: "🍅", name: "Tomato",      latin: "Solanum lycopersicum",   type: "Vegetable", level: "Easy",      sun: "Full sun (6–8 hours)",   water: "Deeply, 1–2 times a week",     plant: "After the last frost (mid-May)", harvest: "60–85 days",             tip: "Give it a stake or cage to climb." },
    { minZone: 2, maxZone: 11, emoji: "🥔", name: "Potato",      latin: "Solanum tuberosum",      type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "Evenly, about once a week",    plant: "Early spring (March–April)",     harvest: "70–120 days",            tip: "Pile soil around the stems as they grow." },
    { minZone: 3, maxZone: 8, emoji: "🌿", name: "Mint",        latin: "Mentha",                 type: "Herb",      level: "Very easy", sun: "Part shade to full sun", water: "Keep the soil moist",          plant: "Spring",                         harvest: "About 60 days",          tip: "It spreads fast, so grow it in a pot." },
    { minZone: 2, maxZone: 11, emoji: "🌱", name: "Basil",       latin: "Ocimum basilicum",       type: "Herb",      level: "Easy",      sun: "Full sun",               water: "Keep the soil lightly moist",  plant: "After the last frost",           harvest: "60–90 days",             tip: "Pinch off flowers to keep leaves coming." },
    { minZone: 2, maxZone: 11, emoji: "🥬", name: "Lettuce",     latin: "Lactuca sativa",         type: "Vegetable", level: "Very easy", sun: "Sun to part shade",      water: "Keep the soil moist",          plant: "Early spring or late summer",    harvest: "45–55 days",             tip: "Pick outer leaves and it keeps growing." },
    { minZone: 2, maxZone: 11, emoji: "🍃", name: "Spinach",     latin: "Spinacia oleracea",      type: "Vegetable", level: "Easy",      sun: "Sun to part shade",      water: "Keep the soil moist",          plant: "Early spring or fall",           harvest: "40–50 days",             tip: "Likes cool weather; summer heat makes it go to seed." },
    { minZone: 2, maxZone: 11, emoji: "🥬", name: "Kale",        latin: "Brassica oleracea",      type: "Vegetable", level: "Easy",      sun: "Sun to part shade",      water: "About 1 inch a week",          plant: "Early spring or late summer",    harvest: "55–75 days",             tip: "A light frost makes the leaves sweeter." },
    { minZone: 2, maxZone: 11, emoji: "🥕", name: "Carrot",      latin: "Daucus carota",          type: "Vegetable", level: "Medium",    sun: "Full sun",               water: "Evenly; don't let it dry out", plant: "Early spring",                   harvest: "70–80 days",             tip: "Loose, rock-free soil gives straight carrots." },
    { minZone: 2, maxZone: 11, emoji: "🌱", name: "Radish",      latin: "Raphanus sativus",       type: "Vegetable", level: "Very easy", sun: "Full sun",               water: "Keep the soil moist",          plant: "Early spring or fall",           harvest: "25–30 days",             tip: "One of the fastest crops: great for first-timers." },
    { minZone: 2, maxZone: 11, emoji: "🫛", name: "Peas",        latin: "Pisum sativum",          type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "Moderate",                     plant: "Early spring",                   harvest: "60–70 days",             tip: "Give them a fence or string to climb." },
    { minZone: 2, maxZone: 11, emoji: "🌱", name: "Green Beans", latin: "Phaseolus vulgaris",     type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "About 1 inch a week",          plant: "After the last frost",           harvest: "50–60 days",             tip: "Plant the seeds straight in the ground once it's warm." },
    { minZone: 2, maxZone: 11, emoji: "🥒", name: "Zucchini",    latin: "Cucurbita pepo",         type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "Deeply, at the base",          plant: "After the last frost",           harvest: "45–55 days",             tip: "One plant makes a lot, so give it room." },
    { minZone: 2, maxZone: 11, emoji: "🥒", name: "Cucumber",    latin: "Cucumis sativus",        type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "Keep it steady",               plant: "After the last frost",           harvest: "50–70 days",             tip: "Pick often to keep new ones coming." },
    { minZone: 2, maxZone: 11, emoji: "🫑", name: "Bell Pepper", latin: "Capsicum annuum",        type: "Vegetable", level: "Medium",    sun: "Full sun",               water: "Keep it steady",               plant: "2 weeks after the last frost",   harvest: "60–90 days",             tip: "Needs warm soil; start with a young plant." },
    { minZone: 4, maxZone: 9, emoji: "🍓", name: "Strawberry",  latin: "Fragaria × ananassa",    type: "Fruit",     level: "Medium",    sun: "Full sun",               water: "About 1 inch a week",          plant: "Early spring",                   harvest: "Next spring/summer",     tip: "Comes back every year." },
    { minZone: 3, maxZone: 9, emoji: "🧄", name: "Garlic",      latin: "Allium sativum",         type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "Light; stop when leaves yellow", plant: "Fall (October–November)",      harvest: "Next summer",            tip: "Plant now: November is garlic season in Zone 7a." },
    { minZone: 5, maxZone: 9, emoji: "🌿", name: "Thyme",       latin: "Thymus vulgaris",        type: "Herb",      level: "Easy",      sun: "Full sun",               water: "Let the soil dry between",     plant: "Spring",                         harvest: "About 70 days",          tip: "Comes back every year." },
    { minZone: 5, maxZone: 9, emoji: "🌸", name: "Lavender",    latin: "Lavandula angustifolia", type: "Flower",    level: "Medium",    sun: "Full sun",               water: "Light; likes dry soil",        plant: "Spring",                         harvest: "Blooms in its 2nd year", tip: "Needs soil that drains well." },
    { minZone: 2, maxZone: 11, emoji: "🌻", name: "Sunflower",   latin: "Helianthus annuus",      type: "Flower",    level: "Very easy", sun: "Full sun",               water: "Deeply, once a week",          plant: "After the last frost",           harvest: "70–100 days to bloom",   tip: "Tall kinds may need a stake." },
    { minZone: 2, maxZone: 11, emoji: "🌼", name: "Marigold",    latin: "Tagetes",                type: "Flower",    level: "Very easy", sun: "Full sun",               water: "When the top inch is dry",     plant: "After the last frost",           harvest: "50–60 days to bloom",    tip: "Plant near vegetables to keep some bugs away." }
];

// Sample forecast for 8 days (temperatures in °F, rain in %, sunlight in hours).
const DAYS = [
    { short: "Sat", long: "Saturday, Nov 7",  icon: "⛅", condition: "Partly cloudy",      high: 59, low: 47, rain: 7,  humidity: 72, sun: 9.5, tip: "Water new seedlings in the morning." },
    { short: "Sun", long: "Sunday, Nov 8",    icon: "☀️", condition: "Sunny",              high: 60, low: 45, rain: 0,  humidity: 60, sun: 10,  tip: "Great day to turn your soil." },
    { short: "Mon", long: "Monday, Nov 9",    icon: "☀️", condition: "Sunny",              high: 56, low: 42, rain: 2,  humidity: 58, sun: 10,  tip: "Plant garlic now for a summer harvest." },
    { short: "Tue", long: "Tuesday, Nov 10",  icon: "☀️", condition: "Sunny",              high: 62, low: 42, rain: 3,  humidity: 55, sun: 9.5, tip: "Give potted herbs a deep drink." },
    { short: "Wed", long: "Wednesday, Nov 11", icon: "⛅", condition: "Partly cloudy",     high: 62, low: 42, rain: 10, humidity: 63, sun: 8,   tip: "Last warm day this week: finish any planting." },
    { short: "Thu", long: "Thursday, Nov 12", icon: "🌧️", condition: "Rain",               high: 52, low: 40, rain: 85, humidity: 90, sun: 2,   tip: "Skip watering; the rain has it covered." },
    { short: "Fri", long: "Friday, Nov 13",   icon: "🌨️", condition: "Rain and snow",       high: 41, low: 37, rain: 70, humidity: 88, sun: 3,   tip: "Frost tonight: cover tender plants." },
    { short: "Sat", long: "Saturday, Nov 14", icon: "☁️", condition: "Cloudy",             high: 44, low: 37, rain: 20, humidity: 75, sun: 4,   tip: "Check pots for drainage after the storm." }
];


// What the page is showing right now (the buttons change these).
let selectedDay = 0;       // which of the 8 days is picked
let chartType = "temp";    // "temp" or "rain"
let unit = "F";            // "F" or "C"
let shownPlants = PLANTS;  // the plants in the list (changes after a ZIP search)
let lastPlantButton = null; // the plant that was clicked, so "Back" can return to it


// ===== Small helpers =====

// Turns a °F number into the picked unit, rounded.
function temp(fahrenheit) {
    if (unit === "F") {
        return Math.round(fahrenheit);
    } else {
        return Math.round((fahrenheit - 32) * 5 / 9);
    }
}

// Makes a page element with a class and some text.
function make(tag, className, text) {
    const element = document.createElement(tag);
    element.className = className;
    element.textContent = text;
    return element;
}

// Fills a list of facts, like "Sun: Full sun".
function fillFacts(facts) {
    const list = document.getElementById("plantFacts");
    list.innerHTML = "";
    for (let i = 0; i < facts.length; i++) {
        list.appendChild(make("dt", "", facts[i][0]));
        list.appendChild(make("dd", "", facts[i][1]));
    }
}


// ===== Plant panel: the list, and one plant's details =====
const plantList = document.getElementById("plantList");
const listView = document.getElementById("plantListView");
const detailView = document.getElementById("plantDetailView");

// Fills the list with one button per plant.
function drawPlantList() {
    document.getElementById("plantCount").textContent = shownPlants.length + " plants that grow well here";
    plantList.innerHTML = "";

    for (let i = 0; i < shownPlants.length; i++) {
        const plant = shownPlants[i];

        // The button shows the emoji, then the name with the type under it.
        const button = make("button", "plant-option", "");
        button.type = "button";
        const words = make("span", "plant-option-text", "");
        words.appendChild(make("span", "plant-option-name", plant.name));
        words.appendChild(make("span", "plant-option-type", plant.type));
        button.appendChild(make("span", "plant-option-emoji", plant.emoji));
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

// Hides the list and shows one plant's details.
function showPlant(plant) {
    document.getElementById("plantEmoji").textContent = plant.emoji;
    document.getElementById("plantName").textContent = plant.name;
    document.getElementById("plantLatin").textContent = plant.latin;

    const tags = document.getElementById("plantTags");
    tags.innerHTML = "";
    tags.appendChild(make("span", "badge plant-tag", plant.type));
    tags.appendChild(document.createTextNode(" "));
    tags.appendChild(make("span", "badge plant-tag", plant.level));

    fillFacts([
        ["☀️ Sun", plant.sun],
        ["💧 Water", plant.water],
        ["📅 Plant", plant.plant],
        ["🧺 Harvest", plant.harvest]
    ]);
    document.getElementById("plantTip").textContent = "💡 " + plant.tip;

    listView.hidden = true;
    detailView.hidden = false;
    document.getElementById("plantName").focus(); // screen readers jump to the plant's name

    loadPerenualInfo(plant);
}

// "Back to plants" shows the list again.
document.getElementById("plantBack").addEventListener("click", function () {
    detailView.hidden = true;
    listView.hidden = false;
    if (lastPlantButton) {
        lastPlantButton.focus();
    }
});


// ===== Perenual: adds a real photo and care info to the plant you clicked =====

// The free plan sometimes sends "Upgrade Plans..." instead of real info; this spots that.
function isRealInfo(value) {
    if (!value) {
        return false;
    }
    if (String(value).includes("Upgrade")) {
        return false;
    }
    return true;
}

async function loadPerenualInfo(plant) {
    const photo = document.getElementById("plantPhoto");
    const source = document.getElementById("plantSource");
    photo.hidden = true;

    // No key yet: keep our own info.
    if (typeof PERENUAL_KEY === "undefined" || PERENUAL_KEY === "") {
        source.textContent = "Add a Perenual key in keys.js to see a photo and live care info.";
        return;
    }

    source.textContent = "Loading photo and care info from Perenual...";

    try {
        // Request 1: search by the Latin name to get Perenual's ID for this plant.
        const searchUrl = "https://perenual.com/api/v2/species-list?key=" + PERENUAL_KEY + "&q=" + encodeURIComponent(plant.latin);
        const searchResponse = await fetch(searchUrl);
        const searchData = await searchResponse.json();

        if (!searchData.data || searchData.data.length === 0) {
            source.textContent = "Perenual doesn't have this plant, so we're showing our own info.";
            return;
        }

        // Request 2: get the details for that ID.
        const id = searchData.data[0].id;
        const detailUrl = "https://perenual.com/api/v2/species/details/" + id + "?key=" + PERENUAL_KEY;
        const detailResponse = await fetch(detailUrl);
        const details = await detailResponse.json();

        // Show the photo if there is one.
        if (details.default_image && isRealInfo(details.default_image.medium_url)) {
            photo.src = details.default_image.medium_url;
            photo.alt = "Photo of " + plant.name;
            photo.hidden = false;
        }

        // Use Perenual's sun and water info when it's real, otherwise ours.
        let sun = plant.sun;
        if (isRealInfo(details.sunlight)) {
            sun = details.sunlight.join(", ");
        }
        let water = plant.water;
        if (isRealInfo(details.watering)) {
            water = details.watering;
        }

        const facts = [
            ["☀️ Sun", sun],
            ["💧 Water", water],
            ["📅 Plant", plant.plant],
            ["🧺 Harvest", plant.harvest]
        ];
        if (isRealInfo(details.cycle)) {
            facts.push(["🔁 Cycle", details.cycle]);
        }
        fillFacts(facts);

        source.textContent = "Photo and sun/water info from Perenual.";
    } catch (error) {
        source.textContent = "Couldn't reach Perenual, so we're showing our own info.";
    }
}


// ===== Weather: the "right now" area at the top =====
function drawNow() {
    const day = DAYS[selectedDay];

    const icon = document.getElementById("nowIcon");
    icon.textContent = day.icon;
    icon.setAttribute("aria-label", day.condition);

    document.getElementById("nowTemp").textContent = temp(day.high) + "°";
    document.getElementById("nowDay").textContent = day.long;
    document.getElementById("nowCondition").textContent = day.condition;
    document.getElementById("gardenTip").textContent = day.tip;

    const details = document.getElementById("nowDetails");
    details.innerHTML = "";
    details.appendChild(make("li", "", "Precipitation: " + day.rain + "%"));
    details.appendChild(make("li", "", "Humidity: " + day.humidity + "%"));
    details.appendChild(make("li", "", "Sunlight: " + day.sun + " hrs"));
}


// ===== Weather: the weekly chart =====

// SVG drawings need this special version of createElement.
function makeSvg(tag) {
    return document.createElementNS("http://www.w3.org/2000/svg", tag);
}

function drawChart() {
    const svg = document.getElementById("dayChart");
    const title = document.getElementById("chartSummary");

    // Get the numbers to draw: highs and lows for Temperature, or rain chances for Precipitation.
    const values = [];
    const lows = [];
    for (let i = 0; i < DAYS.length; i++) {
        if (chartType === "temp") {
            values.push(temp(DAYS[i].high));
            lows.push(temp(DAYS[i].low));
        } else {
            values.push(DAYS[i].rain);
        }
    }

    let symbol = "%";
    if (chartType === "temp") {
        symbol = "°";
    }

    // Find the smallest and biggest number, so the line fits in the chart.
    const allNumbers = values.concat(lows);
    let smallest = Math.min.apply(null, allNumbers);
    let biggest = Math.max.apply(null, allNumbers);
    if (biggest === smallest) {
        biggest = smallest + 1; // avoids dividing by zero when every day is the same
    }

    // Where each point goes: days spread left to right, bigger numbers higher up (y from 120 down to 40).
    function xFor(dayNumber) {
        return 40 + dayNumber * 80;
    }
    function yFor(number) {
        return 120 - (number - smallest) / (biggest - smallest) * 80;
    }

    // Clear the old chart but keep its title (screen readers read it).
    svg.innerHTML = "";
    svg.appendChild(title);

    // The main line, connecting each day's point.
    let points = "";
    for (let i = 0; i < values.length; i++) {
        points = points + xFor(i) + "," + yFor(values[i]) + " ";
    }
    const line = makeSvg("polyline");
    line.setAttribute("points", points);
    line.setAttribute("class", "chart-line");
    svg.appendChild(line);

    // On the Temperature tab, a dashed line for the lows.
    if (chartType === "temp") {
        let lowPoints = "";
        for (let i = 0; i < lows.length; i++) {
            lowPoints = lowPoints + xFor(i) + "," + yFor(lows[i]) + " ";
        }
        const lowLine = makeSvg("polyline");
        lowLine.setAttribute("points", lowPoints);
        lowLine.setAttribute("class", "chart-line-low");
        svg.appendChild(lowLine);
    }

    // For each day: a dot, its number above it, and the day's name at the bottom.
    for (let i = 0; i < values.length; i++) {
        const isPicked = (i === selectedDay);

        const dot = makeSvg("circle");
        dot.setAttribute("cx", xFor(i));
        dot.setAttribute("cy", yFor(values[i]));
        if (isPicked) {
            dot.setAttribute("r", 6);
            dot.setAttribute("class", "chart-dot picked");
        } else {
            dot.setAttribute("r", 3.5);
            dot.setAttribute("class", "chart-dot");
        }
        svg.appendChild(dot);

        const number = makeSvg("text");
        number.setAttribute("x", xFor(i));
        number.setAttribute("y", yFor(values[i]) - 12);
        number.setAttribute("class", "chart-value");
        number.textContent = values[i] + symbol;
        svg.appendChild(number);

        const dayName = makeSvg("text");
        dayName.setAttribute("x", xFor(i));
        dayName.setAttribute("y", 158);
        if (isPicked) {
            dayName.setAttribute("class", "chart-time picked");
        } else {
            dayName.setAttribute("class", "chart-time");
        }
        dayName.textContent = DAYS[i].short;
        svg.appendChild(dayName);
    }

    // A spoken summary for screen readers, like "High temperature this week: Sat 59°, Sun 60°, ..."
    let summary = "Chance of rain this week: ";
    if (chartType === "temp") {
        summary = "High temperature this week: ";
    }
    for (let i = 0; i < values.length; i++) {
        summary = summary + DAYS[i].short + " " + values[i] + symbol + ", ";
    }
    title.textContent = summary;
}


// ===== Weather: the row of 8 days =====
const dayList = document.getElementById("dayList");

function drawDays() {
    dayList.innerHTML = "";

    for (let i = 0; i < DAYS.length; i++) {
        const day = DAYS[i];

        const button = make("button", "day-btn", "");
        button.type = "button";
        if (i === selectedDay) {
            button.classList.add("selected");
            button.setAttribute("aria-pressed", "true");
        } else {
            button.setAttribute("aria-pressed", "false");
        }
        button.setAttribute("aria-label", day.long + ", " + day.condition + ", high " + temp(day.high) + "°, low " + temp(day.low) + "°");

        // Each box shows: day name, icon, then the high (bold) and low.
        const temps = make("span", "day-temps", "");
        temps.appendChild(make("strong", "", temp(day.high) + "°"));
        temps.appendChild(document.createTextNode(" "));
        temps.appendChild(make("span", "text-muted", temp(day.low) + "°"));
        button.appendChild(make("span", "day-name", day.short));
        button.appendChild(make("span", "day-icon", day.icon));
        button.appendChild(temps);

        // Clicking a day shows that day's weather.
        button.addEventListener("click", function () {
            selectedDay = i;
            drawWeather();
            dayList.children[i].querySelector("button").focus();
        });

        const item = document.createElement("li");
        item.appendChild(button);
        dayList.appendChild(item);
    }

    updateArrows();
}

// Redraws the whole weather side.
function drawWeather() {
    drawNow();
    drawChart();
    drawDays();
}


// ===== ‹ › arrows: only show up when the 8 days don't fit on the screen =====
const prevButton = document.getElementById("weekPrev");
const nextButton = document.getElementById("weekNext");

function updateArrows() {
    // Hide them first, then check if the days fit without them.
    prevButton.hidden = true;
    nextButton.hidden = true;
    if (dayList.scrollWidth > dayList.clientWidth) {
        prevButton.hidden = false;
        nextButton.hidden = false;
    }
}

prevButton.addEventListener("click", function () {
    dayList.scrollLeft = dayList.scrollLeft - 200;
});
nextButton.addEventListener("click", function () {
    dayList.scrollLeft = dayList.scrollLeft + 200;
});
window.addEventListener("resize", updateArrows);


// ===== Chart tabs: Temperature / Precipitation =====
const chartTabs = document.querySelectorAll(".chart-tab");

for (let i = 0; i < chartTabs.length; i++) {
    chartTabs[i].addEventListener("click", function () {
        chartType = chartTabs[i].dataset.chart;
        for (let j = 0; j < chartTabs.length; j++) {
            chartTabs[j].setAttribute("aria-pressed", "false");
        }
        chartTabs[i].setAttribute("aria-pressed", "true");
        drawChart();
    });
}


// ===== °F / °C buttons =====
const unitButtons = document.querySelectorAll(".unit-btn");

for (let i = 0; i < unitButtons.length; i++) {
    unitButtons[i].addEventListener("click", function () {
        unit = unitButtons[i].dataset.unit;
        for (let j = 0; j < unitButtons.length; j++) {
            unitButtons[j].setAttribute("aria-pressed", "false");
        }
        unitButtons[i].setAttribute("aria-pressed", "true");
        drawWeather();
    });
}


// ===== ZIP search: finds the growing zone and shows the plants for it =====
const searchForm = document.getElementById("zoneSearch");
const zipInput = document.getElementById("zip");
const searchStatus = document.getElementById("searchStatus");

// Removes anything that isn't a number as they type.
zipInput.addEventListener("input", function () {
    zipInput.value = zipInput.value.replace(/\D/g, "");
});

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

searchForm.addEventListener("submit", async function (event) {
    event.preventDefault(); // stop the page from reloading
    const zip = zipInput.value.trim();

    if (!/^\d{5}$/.test(zip)) {
        showSearchMessage("Enter a 5-digit US ZIP code.", true);
        return;
    }

    showSearchMessage("Looking up ZIP " + zip + "...", false);

    try {
        // Ask phzmapi.org for this ZIP's growing zone, like "7b".
        const response = await fetch("https://phzmapi.org/" + zip + ".json");
        if (!response.ok) {
            showSearchMessage("We couldn't find a growing zone for " + zip + ".", true);
            return;
        }
        const data = await response.json();
        const zone = data.zone;
        const zoneNumber = parseInt(zone); // "7b" becomes 7

        // Keep only the plants that survive in this zone.
        shownPlants = [];
        for (let i = 0; i < PLANTS.length; i++) {
            if (zoneNumber >= PLANTS[i].minZone && zoneNumber <= PLANTS[i].maxZone) {
                shownPlants.push(PLANTS[i]);
            }
        }

        // Update the plant panel.
        document.getElementById("plantTitle").textContent = "Plants for Zone " + zone;
        plantList.setAttribute("aria-label", "Plants for Zone " + zone + ", scrollable");
        detailView.hidden = true;
        listView.hidden = false;
        drawPlantList();

        showSearchMessage("ZIP " + zip + " is in growing Zone " + zone + " (coldest winter nights: " + data.temperature_range + "°F).", false);
    } catch (error) {
        showSearchMessage("We couldn't reach the zone lookup. Please try again.", true);
    }
});


// ===== When the page opens, draw everything =====
drawPlantList();
drawWeather();
