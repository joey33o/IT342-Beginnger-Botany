// ===== WEATHER MAP PAGE: sample data for now; the real weather and plant info come from our server later =====

// Sample plants that grow well in Zone 7a; the plant service will supply this list later.
const PLANTS = [
    { emoji: "🍅", name: "Tomato",      latin: "Solanum lycopersicum",   type: "Vegetable", level: "Easy",      sun: "Full sun (6–8 hours)",   water: "Deeply, 1–2 times a week",     plant: "After the last frost (mid-May)", harvest: "60–85 days",             tip: "Give it a stake or cage to climb." },
    { emoji: "🥔", name: "Potato",      latin: "Solanum tuberosum",      type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "Evenly, about once a week",    plant: "Early spring (March–April)",     harvest: "70–120 days",            tip: "Pile soil around the stems as they grow." },
    { emoji: "🌿", name: "Mint",        latin: "Mentha",                 type: "Herb",      level: "Very easy", sun: "Part shade to full sun", water: "Keep the soil moist",          plant: "Spring",                         harvest: "About 60 days",          tip: "It spreads fast, so grow it in a pot." },
    { emoji: "🌱", name: "Basil",       latin: "Ocimum basilicum",       type: "Herb",      level: "Easy",      sun: "Full sun",               water: "Keep the soil lightly moist",  plant: "After the last frost",           harvest: "60–90 days",             tip: "Pinch off flowers to keep leaves coming." },
    { emoji: "🥬", name: "Lettuce",     latin: "Lactuca sativa",         type: "Vegetable", level: "Very easy", sun: "Sun to part shade",      water: "Keep the soil moist",          plant: "Early spring or late summer",    harvest: "45–55 days",             tip: "Pick outer leaves and it keeps growing." },
    { emoji: "🍃", name: "Spinach",     latin: "Spinacia oleracea",      type: "Vegetable", level: "Easy",      sun: "Sun to part shade",      water: "Keep the soil moist",          plant: "Early spring or fall",           harvest: "40–50 days",             tip: "Likes cool weather; summer heat makes it go to seed." },
    { emoji: "🥬", name: "Kale",        latin: "Brassica oleracea",      type: "Vegetable", level: "Easy",      sun: "Sun to part shade",      water: "About 1 inch a week",          plant: "Early spring or late summer",    harvest: "55–75 days",             tip: "A light frost makes the leaves sweeter." },
    { emoji: "🥕", name: "Carrot",      latin: "Daucus carota",          type: "Vegetable", level: "Medium",    sun: "Full sun",               water: "Evenly; don't let it dry out", plant: "Early spring",                   harvest: "70–80 days",             tip: "Loose, rock-free soil gives straight carrots." },
    { emoji: "🌱", name: "Radish",      latin: "Raphanus sativus",       type: "Vegetable", level: "Very easy", sun: "Full sun",               water: "Keep the soil moist",          plant: "Early spring or fall",           harvest: "25–30 days",             tip: "One of the fastest crops: great for first-timers." },
    { emoji: "🫛", name: "Peas",        latin: "Pisum sativum",          type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "Moderate",                     plant: "Early spring",                   harvest: "60–70 days",             tip: "Give them a fence or string to climb." },
    { emoji: "🌱", name: "Green Beans", latin: "Phaseolus vulgaris",     type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "About 1 inch a week",          plant: "After the last frost",           harvest: "50–60 days",             tip: "Plant the seeds straight in the ground once it's warm." },
    { emoji: "🥒", name: "Zucchini",    latin: "Cucurbita pepo",         type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "Deeply, at the base",          plant: "After the last frost",           harvest: "45–55 days",             tip: "One plant makes a lot, so give it room." },
    { emoji: "🥒", name: "Cucumber",    latin: "Cucumis sativus",        type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "Keep it steady",               plant: "After the last frost",           harvest: "50–70 days",             tip: "Pick often to keep new ones coming." },
    { emoji: "🫑", name: "Bell Pepper", latin: "Capsicum annuum",        type: "Vegetable", level: "Medium",    sun: "Full sun",               water: "Keep it steady",               plant: "2 weeks after the last frost",   harvest: "60–90 days",             tip: "Needs warm soil; start with a young plant." },
    { emoji: "🍓", name: "Strawberry",  latin: "Fragaria × ananassa",    type: "Fruit",     level: "Medium",    sun: "Full sun",               water: "About 1 inch a week",          plant: "Early spring",                   harvest: "Next spring/summer",     tip: "Comes back every year." },
    { emoji: "🧄", name: "Garlic",      latin: "Allium sativum",         type: "Vegetable", level: "Easy",      sun: "Full sun",               water: "Light; stop when leaves yellow", plant: "Fall (October–November)",      harvest: "Next summer",            tip: "Plant now: November is garlic season in Zone 7a." },
    { emoji: "🌿", name: "Thyme",       latin: "Thymus vulgaris",        type: "Herb",      level: "Easy",      sun: "Full sun",               water: "Let the soil dry between",     plant: "Spring",                         harvest: "About 70 days",          tip: "Comes back every year." },
    { emoji: "🌸", name: "Lavender",    latin: "Lavandula angustifolia", type: "Flower",    level: "Medium",    sun: "Full sun",               water: "Light; likes dry soil",        plant: "Spring",                         harvest: "Blooms in its 2nd year", tip: "Needs soil that drains well." },
    { emoji: "🌻", name: "Sunflower",   latin: "Helianthus annuus",      type: "Flower",    level: "Very easy", sun: "Full sun",               water: "Deeply, once a week",          plant: "After the last frost",           harvest: "70–100 days to bloom",   tip: "Tall kinds may need a stake." },
    { emoji: "🌼", name: "Marigold",    latin: "Tagetes",                type: "Flower",    level: "Very easy", sun: "Full sun",               water: "When the top inch is dry",     plant: "After the last frost",           harvest: "50–60 days to bloom",    tip: "Plant near vegetables to keep some bugs away." }
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

// What the page is showing right now (changed by the buttons).
let selectedDay = 0;
let chartType = "temp";
let unit = "F";


// ===== Helpers =====

// Turns a °F number into whichever unit is picked, rounded to a whole number.
function temp(fahrenheit) {
    return Math.round(unit === "F" ? fahrenheit : (fahrenheit - 32) * 5 / 9);
}

// Makes an element with optional class and text (plain text, so nothing can run as code).
function make(tag, className, text) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (text !== undefined) el.textContent = text;
    return el;
}

// Fills a <dl> list with label/answer pairs.
function fillList(list, rows) {
    list.replaceChildren();
    rows.forEach(([label, value]) => list.append(make("dt", "", label), make("dd", "", value)));
}

// The numbers the chart plots for each of the 8 days, for whichever tab is on.
function weeklyValues() {
    if (chartType === "temp") return DAYS.map((d) => temp(d.high));
    return DAYS.map((d) => d.rain);
}


// ===== Plant panel: a scrollable list; clicking a plant swaps in its details =====
const plantList = document.getElementById("plantList");
const listView = document.getElementById("plantListView");
const detailView = document.getElementById("plantDetailView");
let lastPlantButton = null; // remembers which plant was clicked, so "Back" returns there

// Fills the list with one button per plant.
function drawPlantList() {
    document.getElementById("plantCount").textContent = PLANTS.length + " plants that grow well here";
    plantList.replaceChildren();

    PLANTS.forEach((plant) => {
        const button = make("button", "plant-option");
        button.type = "button";
        const text = make("span", "plant-option-text"); // name on top, type (like "Herb") underneath
        text.append(make("span", "plant-option-name", plant.name), make("span", "plant-option-type", plant.type));
        button.append(make("span", "plant-option-emoji", plant.emoji), text);
        button.addEventListener("click", () => {
            lastPlantButton = button;
            showPlant(plant);
        });

        const item = make("li");
        item.append(button);
        plantList.append(item);
    });
}

// Hides the list and shows one plant's details.
function showPlant(plant) {
    document.getElementById("plantEmoji").textContent = plant.emoji;
    document.getElementById("plantName").textContent = plant.name;
    document.getElementById("plantLatin").textContent = plant.latin;

    const tags = document.getElementById("plantTags");
    tags.replaceChildren(make("span", "badge plant-tag", plant.type), " ", make("span", "badge plant-tag", plant.level));

    fillList(document.getElementById("plantFacts"), [
        ["☀️ Sun", plant.sun],
        ["💧 Water", plant.water],
        ["📅 Plant", plant.plant],
        ["🧺 Harvest", plant.harvest]
    ]);
    document.getElementById("plantTip").textContent = "💡 " + plant.tip;

    listView.hidden = true;
    detailView.hidden = false;
    document.getElementById("plantName").focus(); // moves screen readers to the plant's name
}

// "Back to plants" shows the list again, right where they left off.
document.getElementById("plantBack").addEventListener("click", () => {
    detailView.hidden = true;
    listView.hidden = false;
    if (lastPlantButton) lastPlantButton.focus();
});


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
    details.replaceChildren(
        make("li", "", "Precipitation: " + day.rain + "%"),
        make("li", "", "Humidity: " + day.humidity + "%"),
        make("li", "", "Sunlight: " + day.sun + " hrs")
    );
}


// ===== Weather: the weekly chart (one point per day) =====
function drawChart() {
    const svg = document.getElementById("dayChart");
    const title = document.getElementById("chartSummary");
    const values = weeklyValues();
    const lows = DAYS.map((d) => temp(d.low)); // only used on the Temperature tab
    const suffix = chartType === "temp" ? "°" : "%";

    // Fit the heights between y=40 (top) and y=120 (bottom); lows count too so both lines fit on the Temperature tab.
    const all = chartType === "temp" ? values.concat(lows) : values;
    const lowest = Math.min(...all);
    const range = Math.max(...all) - lowest || 1;
    const y = (v) => 120 - ((v - lowest) / range) * 80;
    const x = (i) => 40 + i * 80;  // spreads the 8 days evenly across the chart

    // Clear the old chart but keep the <title>, which screen readers read as the chart's summary.
    svg.replaceChildren(title);
    const ns = "http://www.w3.org/2000/svg";
    const svgEl = (tag, attrs) => {
        const el = document.createElementNS(ns, tag);
        Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        return el;
    };

    // Shaded area under the main line, then the line itself.
    const line = values.map((v, i) => x(i) + "," + y(v)).join(" ");
    svg.append(svgEl("polygon", { points: "0,130 0," + y(values[0]) + " " + line + " 640," + y(values[7]) + " 640,130", class: "chart-area" }));
    svg.append(svgEl("polyline", { points: line, class: "chart-line" }));

    // On the Temperature tab, a fainter dashed line for each day's low.
    if (chartType === "temp") {
        svg.append(svgEl("polyline", { points: lows.map((v, i) => x(i) + "," + y(v)).join(" "), class: "chart-line-low" }));
    }

    // For each day: a dot (bigger for the day you picked), its number above, and its name underneath.
    values.forEach((v, i) => {
        const picked = i === selectedDay;
        svg.append(svgEl("circle", { cx: x(i), cy: y(v), r: picked ? 6 : 3.5, class: picked ? "chart-dot picked" : "chart-dot" }));
        const value = svgEl("text", { x: x(i), y: y(v) - 12, class: "chart-value" });
        value.textContent = v + (chartType === "temp" ? "°" : suffix);
        const name = svgEl("text", { x: x(i), y: 158, class: picked ? "chart-time picked" : "chart-time" });
        name.textContent = DAYS[i].short;
        svg.append(value, name);
    });

    // Spoken summary, e.g. "High temperature this week: Sat 59°, Sun 60°, ..."
    const label = { temp: "High temperature", rain: "Chance of rain" }[chartType];
    title.textContent = label + " this week: " + values.map((v, i) => DAYS[i].short + " " + v + suffix).join(", ");
}


// ===== Weather: the 8-day row =====
function drawDays() {
    const list = document.getElementById("dayList");
    list.replaceChildren();

    DAYS.forEach((day, i) => {
        const button = make("button", "day-btn" + (i === selectedDay ? " selected" : ""));
        button.type = "button";
        button.setAttribute("aria-pressed", String(i === selectedDay));
        button.setAttribute("aria-label", day.long + ", " + day.condition + ", high " + temp(day.high) + "°, low " + temp(day.low) + "°");

        // What you see in each box: day name, icon, then high (bold) and low.
        const temps = make("span", "day-temps");
        temps.append(make("strong", "", temp(day.high) + "°"), " ", make("span", "text-muted", temp(day.low) + "°"));
        button.append(make("span", "day-name", day.short), make("span", "day-icon", day.icon), temps);

        // Clicking a day shows its weather everywhere on the panel.
        button.addEventListener("click", () => {
            selectedDay = i;
            drawAll();
            list.children[i].querySelector("button").focus(); // keep the keyboard spot on the clicked day
        });

        const item = make("li");
        item.append(button);
        list.append(item);
    });

    updateArrows();
}

// Redraws the whole weather panel (used after any button changes something).
function drawAll() {
    drawNow();
    drawChart();
    drawDays();
}


// ===== ‹ › arrows: scroll the day row, and only show up when the days don't all fit =====
const dayList = document.getElementById("dayList");
const prevButton = document.getElementById("weekPrev");
const nextButton = document.getElementById("weekNext");

function updateArrows() {
    // Hide the arrows first so they don't take up room while we measure whether the days fit.
    prevButton.hidden = true;
    nextButton.hidden = true;
    const fits = dayList.scrollWidth <= dayList.clientWidth + 1;
    prevButton.hidden = fits;
    nextButton.hidden = fits;
    prevButton.disabled = dayList.scrollLeft <= 0;
    nextButton.disabled = dayList.scrollLeft + dayList.clientWidth >= dayList.scrollWidth - 1;
}

// Each click scrolls by most of the visible width.
prevButton.addEventListener("click", () => dayList.scrollBy({ left: -dayList.clientWidth * 0.8, behavior: "smooth" }));
nextButton.addEventListener("click", () => dayList.scrollBy({ left: dayList.clientWidth * 0.8, behavior: "smooth" }));
dayList.addEventListener("scroll", updateArrows);
window.addEventListener("resize", updateArrows);


// ===== Chart tabs: Temperature / Precipitation =====
document.querySelectorAll(".chart-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
        chartType = tab.dataset.chart;
        document.querySelectorAll(".chart-tab").forEach((t) => t.setAttribute("aria-pressed", String(t === tab)));
        drawChart();
    });
});


// ===== °F / °C switch =====
document.querySelectorAll(".unit-btn").forEach((button) => {
    button.addEventListener("click", () => {
        unit = button.dataset.unit;
        document.querySelectorAll(".unit-btn").forEach((b) => b.setAttribute("aria-pressed", String(b === button)));
        drawAll();
    });
});


// ===== "Local zone" search: checks the ZIP for now; live lookups come once the server is ready =====
const searchForm = document.getElementById("zoneSearch");
const zipInput = document.getElementById("zip");
const searchStatus = document.getElementById("searchStatus");

// Quietly removes anything that isn't a number as they type.
zipInput.addEventListener("input", () => {
    zipInput.value = zipInput.value.replace(/\D/g, "");
});

searchForm.addEventListener("submit", (event) => {
    event.preventDefault(); // stop the page from reloading; we handle it here
    const zip = zipInput.value.trim();
    const valid = /^\d{5}$/.test(zip);

    zipInput.classList.toggle("is-invalid", !valid);
    zipInput.setAttribute("aria-invalid", String(!valid));
    searchStatus.classList.toggle("error", !valid);
    searchStatus.textContent = valid
        ? "Thanks! Live results for " + zip + " are coming soon. For now this page shows sample data."
        : "Enter a 5-digit US ZIP code.";
});


// ===== Draw the plant list and weather panel when the page first opens =====
drawPlantList();
drawAll();