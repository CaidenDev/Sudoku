let numSelected = null;
let tileSelected = null;

let errors = 0;

let timer;
let elapsedTime = 0;
let timerElement;
let isGameRunning = false;

let boards = [
    [
    "--74916-5",
    "2---6-3-9",
    "-----7-1-",
    "-586----4",
    "--3----9-",
    "--62--187",
    "9-4-7---2",
    "67-83----",
    "81--45---"
    ],

    [
        "-7-583-2-",
        "-592--3--",
        "34---65-7",
        "795---632",
        "--36971--",
        "68---27--",
        "914835-76",
        "-3-7-1495",
        "567429-13"
        
    ],

    [
        "3----5-62",
        "---76--8-",
        "56--283--",
        "83----496",
        "745-9--1-",
        "-9-2----3",
        "98467---1",
        "6--5--8--",
        "-5--31-4-"
        
    ]
    ];

let solutions = [
    [
    "387491625",
    "241568379",
    "569327418",
    "758619234",
    "123784596",
    "496253187",
    "934176852",
    "675832941",
    "812945763"
],

[
    "176583924",
    "859274361",
    "342916587",
    "795148632",
    "423697158",
    "681352749",
    "914835276",
    "238761495",
    "567429813"
    
],

[
    "378415962",
    "429763185",
    "561928374",
    "832157496",
    "745396218",
    "196284753",
    "984672531",
    "613549827",
    "257831649"
    
]

];


//select random board to be displayed
let selectedBoard, selectedSolution;

function selectRandomBoard() {
    let randomIndex = Math.floor(Math.random() * boards.length);
    selectedBoard = boards[randomIndex];
    selectedSolution = solutions[randomIndex];
}


//TIMER
function startTimer() {
    timerElement = document.getElementById("timer");
    timer = setInterval(function() {
        elapsedTime++;
        let minutes = Math.floor(elapsedTime / 60);
        let seconds = elapsedTime % 60;
        timerElement.innerText = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function stopTimer() {
    clearInterval(timer);
}


let counts = {};

// Initialize the counts 
for (let i = 1; i <= 9; i++) {
    counts[i] = 0;
}

//What to do when window loads
window.onload = function() {
    selectRandomBoard();
    setGame();
    elapsedTime = 0; //reset elapsed time
    startTimer();
    isGameRunning = true; 
}

function setGame() {
    // Generate digits 1-9
    for (let i = 1; i <= 9; i++) {
        //<div id="1" class="number">1</div>
        let number = document.createElement("div");
        number.id = "digit-" + i;
        number.innerText = i;
        number.addEventListener("click", selectNumber)
        number.classList.add("number");
        document.getElementById("digits").appendChild(number);
    }

    // Generate board 9x9   r = row,  c = column
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            //<div id = "O-0" class = "tile"> </div>
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();

            // generate game numbers, ignoring dashes -
            if (selectedBoard[r][c] != "-") {
                tile.innerText = selectedBoard[r][c];
                tile.classList.add("tile-start");

                // initialize count for pre-filled numbers
                counts[selectedBoard[r][c]] += 1; 
            }
            if (r == 2 || r == 5) {
                tile.classList.add("horizontal-line");
            }
            if (c == 2 || c == 5) {
                tile.classList.add("vertical-line");
            }

            tile.addEventListener("click", selectTile);
            tile.classList.add("tile");
            document.getElementById("board").append(tile);
        }
    }

    // Check for any numbers that are complete
    for (let num in counts) {
        if (counts[num] == 9) {
            markNumberComplete(num);
        }
    }
}

function selectNumber() {
    if (numSelected != null) {
        numSelected.classList.remove("number-selected");
    }
    numSelected = this;
    numSelected.classList.add("number-selected");
}

function selectTile() {
    if (!isGameRunning || numSelected == null) {
        return;
    }

    if (this.innerText != "") {
        return;
    }

    let coords = this.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);

    if (selectedSolution[r][c] == numSelected.innerText) {
        this.innerText = numSelected.innerText;
        counts[numSelected.innerText] += 1;

        if (counts[numSelected.innerText] == 9) {
            markNumberComplete(numSelected.innerText);
        }


        if (isGameComplete()) {
            stopTimer();
            isGameRunning = false;
            showWinPopup();
        }
    } else {
        this.classList.add("tile-error");
        setTimeout(() => {
            this.classList.remove("tile-error");
        }, 500);
        errors += 1;
        document.getElementById("errors").innerText = errors;
    }
}

function markNumberComplete(num) {
    // make numbers green if all instances are correct
    let tiles = document.getElementsByClassName("tile");
    for (let tile of tiles) {
        if (tile.innerText == num) {
            tile.classList.add("number-complete");
            console.log("number complete!");
        }
    }
    // update the digit at the bottom to be green
    let digit = document.getElementById("digit-" + num);
    if (digit) {
        digit.classList.add("number-complete");
    }
}


//Checks if game is complete
function isGameComplete() {
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (document.getElementById(r.toString() + "-" + c.toString()).innerText !== selectedSolution[r][c]) {
                return false;
            }
        }
    }
    return true;
}

//what to do when game is complete:
function showWinPopup() {
    let winPopup = document.getElementById("win-popup");
    winPopup.style.display = "flex";
    let minutes = Math.floor(elapsedTime / 60);
    let seconds = elapsedTime % 60;
    document.getElementById("win-time").innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    document.getElementById("win-mistakes").innerText = errors;
}

function closePopup() {
    let winPopup = document.getElementById("win-popup");
    winPopup.style.display = "none";
}