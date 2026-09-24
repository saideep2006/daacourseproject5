/* =========================================================
   DAA PATHFINDER
   DIJKSTRA SHORTEST PATH VISUALIZER
   ========================================================= */


/* =========================================================
   CITY DATA
   ========================================================= */

const cities = {

    Hyderabad: {
        x: 430,
        y: 430
    },

    Warangal: {
        x: 590,
        y: 350
    },

    Karimnagar: {
        x: 600,
        y: 250
    },

    Nizamabad: {
        x: 400,
        y: 180
    },

    Khammam: {
        x: 610,
        y: 520
    },

    Nalgonda: {
        x: 470,
        y: 520
    },

    Adilabad: {
        x: 520,
        y: 80
    },

    Mahbubnagar: {
        x: 280,
        y: 560
    },

    Siddipet: {
        x: 500,
        y: 290
    },

    Vijayawada: {
        x: 780,
        y: 500
    },

    Guntur: {
        x: 720,
        y: 540
    },

    Amaravati: {
        x: 740,
        y: 470
    },

    Visakhapatnam: {
        x: 1080,
        y: 300
    },

    Rajahmundry: {
        x: 950,
        y: 400
    },

    Kakinada: {
        x: 1010,
        y: 430
    },

    Nellore: {
        x: 760,
        y: 720
    },

    Tirupati: {
        x: 650,
        y: 820
    },

    Kurnool: {
        x: 390,
        y: 700
    },

    Kadapa: {
        x: 520,
        y: 790
    },

    Anantapur: {
        x: 270,
        y: 780
    },

    Srikakulam: {
        x: 1110,
        y: 190
    },

    Ongole: {
        x: 790,
        y: 650
    }

};


/* =========================================================
   ROAD DATA
   ========================================================= */

const roads = [

    ["Hyderabad", "Warangal", 150],
    ["Hyderabad", "Nalgonda", 100],
    ["Hyderabad", "Mahbubnagar", 100],
    ["Hyderabad", "Nizamabad", 170],

    ["Warangal", "Karimnagar", 80],
    ["Warangal", "Khammam", 120],
    ["Warangal", "Siddipet", 100],

    ["Karimnagar", "Nizamabad", 150],
    ["Karimnagar", "Siddipet", 100],
    ["Karimnagar", "Adilabad", 170],

    ["Nizamabad", "Adilabad", 120],

    ["Nalgonda", "Khammam", 110],
    ["Nalgonda", "Vijayawada", 250],

    ["Mahbubnagar", "Kurnool", 180],

    ["Khammam", "Vijayawada", 120],

    ["Vijayawada", "Guntur", 40],
    ["Vijayawada", "Amaravati", 30],
    ["Vijayawada", "Rajahmundry", 160],
    ["Vijayawada", "Ongole", 180],

    ["Guntur", "Ongole", 150],

    ["Amaravati", "Guntur", 30],

    ["Rajahmundry", "Kakinada", 65],
    ["Rajahmundry", "Visakhapatnam", 190],

    ["Kakinada", "Visakhapatnam", 150],

    ["Visakhapatnam", "Srikakulam", 120],

    ["Ongole", "Nellore", 140],

    ["Nellore", "Tirupati", 130],

    ["Tirupati", "Kadapa", 130],

    ["Kadapa", "Kurnool", 210],
    ["Kadapa", "Anantapur", 190],

    ["Kurnool", "Anantapur", 180]

];


/* =========================================================
   DOM ELEMENTS
   ========================================================= */

const sourceSelect =
    document.getElementById("source");

const destinationSelect =
    document.getElementById("destination");

const findPathBtn =
    document.getElementById("findPath");

const resetBtn =
    document.getElementById("reset");

const graph =
    document.getElementById("graph");

const distanceElement =
    document.getElementById("distance");

const statusElement =
    document.getElementById("status");

const pathDisplay =
    document.getElementById("pathDisplay");

const executionLog =
    document.getElementById("executionLog");

const resultModal =
    document.getElementById("resultModal");

const closeModalBtn =
    document.getElementById("closeModal");

const modalContinueBtn =
    document.getElementById("modalContinue");

const modalSource =
    document.getElementById("modalSource");

const modalDestination =
    document.getElementById("modalDestination");

const modalDistance =
    document.getElementById("modalDistance");

const modalPath =
    document.getElementById("modalPath");


let isRunning = false;


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


function initialize() {

    populateCitySelectors();

    createGraph();

    distanceElement.textContent = "--";

    statusElement.textContent =
        "Ready to find shortest path.";

    pathDisplay.textContent =
        "Select source and destination cities.";

}


/* =========================================================
   CITY DROPDOWNS
   ========================================================= */

function populateCitySelectors() {

    sourceSelect.innerHTML = `
        <option value="">
            Select Source City
        </option>
    `;

    destinationSelect.innerHTML = `
        <option value="">
            Select Destination City
        </option>
    `;


    Object.keys(cities).forEach(city => {

        const sourceOption =
            document.createElement("option");

        sourceOption.value = city;
        sourceOption.textContent = city;

        sourceSelect.appendChild(
            sourceOption
        );


        const destinationOption =
            document.createElement("option");

        destinationOption.value = city;
        destinationOption.textContent = city;

        destinationSelect.appendChild(
            destinationOption
        );

    });

}


/* =========================================================
   CREATE SVG GRAPH
   ========================================================= */

function createGraph() {

    graph.querySelectorAll(
        ".road-line, .road-distance, .city-node"
    ).forEach(element => {

        element.remove();

    });


    /* ---------- ROADS ---------- */

    roads.forEach(
        ([from, to, distance]) => {

            const start =
                cities[from];

            const end =
                cities[to];


            const line =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "line"
                );


            line.setAttribute(
                "x1",
                start.x
            );

            line.setAttribute(
                "y1",
                start.y
            );

            line.setAttribute(
                "x2",
                end.x
            );

            line.setAttribute(
                "y2",
                end.y
            );


            line.classList.add(
                "road-line"
            );


            line.dataset.from = from;
            line.dataset.to = to;


            graph.appendChild(line);


            /* Distance label */

            const label =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );


            label.setAttribute(
                "x",
                (start.x + end.x) / 2
            );

            label.setAttribute(
                "y",
                (start.y + end.y) / 2 - 8
            );


            label.setAttribute(
                "text-anchor",
                "middle"
            );


            label.classList.add(
                "road-distance"
            );


            label.textContent =
                `${distance} km`;


            graph.appendChild(label);

        }
    );


    /* ---------- CITY NODES ---------- */

    Object.entries(cities).forEach(
        ([city, position]) => {

            const group =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "g"
                );


            group.classList.add(
                "city-node"
            );


            group.dataset.city = city;


            const circle =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "circle"
                );


            circle.setAttribute(
                "cx",
                position.x
            );

            circle.setAttribute(
                "cy",
                position.y
            );

            circle.setAttribute(
                "r",
                "14"
            );


            group.appendChild(circle);


            const label =
                document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "text"
                );


            label.setAttribute(
                "x",
                position.x
            );

            label.setAttribute(
                "y",
                position.y + 32
            );


            label.setAttribute(
                "text-anchor",
                "middle"
            );


            label.classList.add(
                "city-label"
            );


            label.textContent = city;


            group.appendChild(label);


            graph.appendChild(group);

        }
    );

}


/* =========================================================
   BUILD ADJACENCY LIST
   ========================================================= */

function buildGraph() {

    const adjacency = {};


    Object.keys(cities).forEach(
        city => {

            adjacency[city] = [];

        }
    );


    roads.forEach(
        ([from, to, distance]) => {

            adjacency[from].push({
                city: to,
                distance: distance
            });


            adjacency[to].push({
                city: from,
                distance: distance
            });

        }
    );


    return adjacency;
}


/* =========================================================
   DELAY
   ========================================================= */

function sleep(milliseconds) {

    return new Promise(
        resolve =>
            setTimeout(
                resolve,
                milliseconds
            )
    );

}


/* =========================================================
   CITY ELEMENT
   ========================================================= */

function getCityElement(city) {

    return document.querySelector(
        `.city-node[data-city="${city}"]`
    );

}


/* =========================================================
   ADD CITY CLASS
   ========================================================= */

function addCityClass(
    city,
    className
) {

    const element =
        getCityElement(city);

    if (element) {
        element.classList.add(
            className
        );
    }

}


/* =========================================================
   REMOVE CITY CLASS
   ========================================================= */

function removeCityClass(
    city,
    className
) {

    const element =
        getCityElement(city);

    if (element) {

        element.classList.remove(
            className
        );

    }

}


/* =========================================================
   ROAD ELEMENT
   ========================================================= */

function getRoadElement(
    city1,
    city2
) {

    return [
        ...document.querySelectorAll(
            ".road-line"
        )
    ].find(line => {

        return (

            (
                line.dataset.from === city1 &&
                line.dataset.to === city2
            )

            ||

            (
                line.dataset.from === city2 &&
                line.dataset.to === city1
            )

        );

    });

}


/* =========================================================
   HIGHLIGHT ROAD
   ========================================================= */

function highlightRoad(
    city1,
    city2,
    className
) {

    const road =
        getRoadElement(
            city1,
            city2
        );


    if (road) {

        road.classList.add(
            className
        );

    }

}


/* =========================================================
   LOG
   ========================================================= */

function addLog(
    message,
    type = ""
) {

    if (
        executionLog.querySelector(
            ".empty-log"
        )
    ) {

        executionLog.innerHTML = "";

    }


    const item =
        document.createElement("div");


    item.className =
        `log-item ${type}`;


    const time =
        new Date().toLocaleTimeString(
            [],
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            }
        );


    item.innerHTML = `

        <span class="log-time">
            ${time}
        </span>

        <span class="log-message">
            ${message}
        </span>

    `;


    executionLog.appendChild(item);


    executionLog.scrollTop =
        executionLog.scrollHeight;

}


/* =========================================================
   RESET GRAPH
   ========================================================= */

function resetGraphOnly() {

    document
        .querySelectorAll(".city-node")
        .forEach(node => {

            node.classList.remove(
                "source-node",
                "destination-node",
                "current-node",
                "checking-node",
                "visited-node",
                "path-node"
            );

        });


    document
        .querySelectorAll(".road-line")
        .forEach(line => {

            line.classList.remove(
                "active-road",
                "path-road"
            );

        });

}


/* =========================================================
   ANIMATED DIJKSTRA
   ========================================================= */

async function runDijkstra(
    source,
    destination
) {

    const adjacency =
        buildGraph();


    const distances = {};
    const previous = {};
    const visited = new Set();


    Object.keys(cities).forEach(
        city => {

            distances[city] =
                Infinity;

            previous[city] =
                null;

        }
    );


    distances[source] = 0;


    /* SOURCE */

    addCityClass(
        source,
        "source-node"
    );


    addCityClass(
        destination,
        "destination-node"
    );


    statusElement.textContent =
        `Starting from ${source}...`;


    addLog(
        `Starting Dijkstra from ${source}. Distance = 0 km.`,
        "start"
    );


    await sleep(900);


    /* =====================================================
       DIJKSTRA MAIN LOOP
       ===================================================== */

    while (
        visited.size <
        Object.keys(cities).length
    ) {

        let current = null;

        let smallestDistance =
            Infinity;


        /* Find closest unvisited node */

        Object.keys(cities).forEach(
            city => {

                if (
                    !visited.has(city) &&
                    distances[city] <
                    smallestDistance
                ) {

                    smallestDistance =
                        distances[city];

                    current = city;

                }

            }
        );


        if (current === null) {
            break;
        }


        /* Current node */

        removeCityClass(
            current,
            "checking-node"
        );


        addCityClass(
            current,
            "current-node"
        );


        statusElement.textContent =
            `Visiting ${current} — current distance ${smallestDistance} km`;


        addLog(
            `Selected ${current}; smallest known distance = ${smallestDistance} km.`,
            "visit"
        );


        await sleep(700);


        /* =================================================
           CHECK ALL NEIGHBORS
           ================================================= */

        for (
            const neighbor
            of adjacency[current]
        ) {

            if (
                visited.has(
                    neighbor.city
                )
            ) {

                continue;

            }


            /* Highlight neighbor */

            addCityClass(
                neighbor.city,
                "checking-node"
            );


            highlightRoad(
                current,
                neighbor.city,
                "active-road"
            );


            statusElement.textContent =
                `Checking nearby node: ${neighbor.city}`;


            addLog(
                `Checking ${neighbor.city} from ${current} — road distance ${neighbor.distance} km.`,
                "check"
            );


            await sleep(700);


            /* Calculate new distance */

            const newDistance =
                distances[current] +
                neighbor.distance;


            if (
                newDistance <
                distances[neighbor.city]
            ) {

                distances[
                    neighbor.city
                ] =
                    newDistance;


                previous[
                    neighbor.city
                ] =
                    current;


                addLog(
                    `Updated ${neighbor.city}: shortest known distance = ${newDistance} km.`,
                    "update"
                );

            } else {

                addLog(
                    `Kept existing route to ${neighbor.city}; it is already shorter.`,
                    "check"
                );

            }


            removeCityClass(
                neighbor.city,
                "checking-node"
            );


            await sleep(250);

        }


        /* Mark current visited */

        visited.add(current);


        removeCityClass(
            current,
            "current-node"
        );


        addCityClass(
            current,
            "visited-node"
        );


        /* Restore source/destination colors */

        if (
            current === source
        ) {

            addCityClass(
                source,
                "source-node"
            );

        }


        if (
            current === destination
        ) {

            addCityClass(
                destination,
                "destination-node"
            );

        }


        addLog(
            `${current} has been permanently visited.`,
            "visited"
        );


        await sleep(450);


        /* Destination reached */

        if (
            current === destination
        ) {

            addLog(
                `Destination ${destination} reached.`,
                "complete"
            );

            break;

        }

    }


    /* =====================================================
       RECONSTRUCT SHORTEST PATH
       ===================================================== */

    const path = [];

    let current =
        destination;


    while (
        current !== null
    ) {

        path.unshift(
            current
        );


        if (
            current === source
        ) {

            break;

        }


        current =
            previous[current];

    }


    if (
        path[0] !== source
    ) {

        statusElement.textContent =
            "No route found.";

        addLog(
            "No route exists between the selected cities.",
            "error"
        );

        return;

    }


    /* =====================================================
       FINAL PATH ANIMATION
       ===================================================== */

    statusElement.textContent =
        "Dijkstra completed. Building shortest path...";


    addLog(
        "All required nodes processed. Reconstructing shortest path...",
        "complete"
    );


    await sleep(900);


    for (
        let i = 0;
        i < path.length;
        i++
    ) {

        const city =
            path[i];


        addCityClass(
            city,
            "path-node"
        );


        if (i > 0) {

            highlightRoad(
                path[i - 1],
                path[i],
                "path-road"
            );

        }


        statusElement.textContent =
            `Shortest path: ${path
                .slice(0, i + 1)
                .join(" → ")}`;


        await sleep(700);

    }


    /* =====================================================
       FINAL RESULT
       ===================================================== */

    const finalDistance =
        distances[destination];


    distanceElement.textContent =
        `${finalDistance} km`;


    statusElement.textContent =
        "Shortest path calculation complete.";


    /* Path display */

    pathDisplay.innerHTML =
        path
            .map(
                (city, index) => {

                    if (
                        index ===
                        path.length - 1
                    ) {

                        return `
                            <span class="path-city">
                                ${city}
                            </span>
                        `;

                    }


                    return `
                        <span class="path-city">
                            ${city}
                        </span>

                        <span class="path-arrow">
                            →
                        </span>
                    `;

                }
            )
            .join("");


    addLog(
        `Final shortest distance = ${finalDistance} km.`,
        "complete"
    );


    addLog(
        `Shortest route = ${path.join(" → ")}`,
        "complete"
    );


    /* =====================================================
       MODAL
       ===================================================== */

    modalSource.textContent =
        source;

    modalDestination.textContent =
        destination;

    modalDistance.textContent =
        `${finalDistance} km`;

    modalPath.textContent =
        path.join(" → ");


    showModal();

}


/* =========================================================
   FIND PATH BUTTON
   ========================================================= */

findPathBtn.addEventListener(
    "click",
    async () => {

        if (isRunning) {
            return;
        }


        const source =
            sourceSelect.value;

        const destination =
            destinationSelect.value;


        /* Validate */

        if (
            !source ||
            !destination
        ) {

            alert(
                "Please select both FROM and TO cities."
            );

            return;

        }


        if (
            source === destination
        ) {

            alert(
                "FROM and TO cities must be different."
            );

            return;

        }


        isRunning = true;


        findPathBtn.disabled =
            true;

        resetBtn.disabled =
            true;


        resetGraphOnly();


        distanceElement.textContent =
            "--";


        pathDisplay.textContent =
            "Running Dijkstra algorithm...";


        executionLog.innerHTML = "";


        try {

            await runDijkstra(
                source,
                destination
            );

        } catch (error) {

            console.error(error);


            statusElement.textContent =
                "Algorithm error.";

            addLog(
                "An unexpected error occurred while running the algorithm.",
                "error"
            );

        }


        isRunning = false;


        findPathBtn.disabled =
            false;

        resetBtn.disabled =
            false;

    }
);


/* =========================================================
   RESET
   ========================================================= */

resetBtn.addEventListener(
    "click",
    () => {

        if (isRunning) {
            return;
        }


        resetGraphOnly();


        sourceSelect.value =
            "";

        destinationSelect.value =
            "";


        distanceElement.textContent =
            "--";


        statusElement.textContent =
            "Ready to find shortest path.";


        pathDisplay.textContent =
            "Select source and destination cities.";


        executionLog.innerHTML = `

            <div class="empty-log">
                Algorithm execution will appear here.
            </div>

        `;


        closeModal();

    }
);


/* =========================================================
   SHOW MODAL
   ========================================================= */

function showModal() {

    resultModal.classList.add(
        "show"
    );


    resultModal.setAttribute(
        "aria-hidden",
        "false"
    );


    document.body.classList.add(
        "modal-open"
    );

}


/* =========================================================
   CLOSE MODAL
   ========================================================= */

function closeModal() {

    resultModal.classList.remove(
        "show"
    );


    resultModal.setAttribute(
        "aria-hidden",
        "true"
    );


    document.body.classList.remove(
        "modal-open"
    );

}


/* =========================================================
   MODAL BUTTONS
   ========================================================= */

closeModalBtn.addEventListener(
    "click",
    closeModal
);


modalContinueBtn.addEventListener(
    "click",
    closeModal
);


/* =========================================================
   CLICK OUTSIDE MODAL
   ========================================================= */

resultModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            resultModal
        ) {

            closeModal();

        }

    }
);


/* =========================================================
   ESC KEY
   ========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeModal();

        }

    }
);