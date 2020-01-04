
const player = (name, sign) => {
    const getName = name;
    const getSign = sign;
    return {getName, getSign};
};

const gameBoard = (() => {
    let gameboard = [];

    const getGameBoard = () => {
        return gameboard;
    };

    const create = () => {
        for(let i = 0; i < 9 ; i++) {
            gameboard[i] = " ";
        }
    };

    const render = () => {
        for(let i = 0; i < gameboard.length ; i++) {
            displayController.updateTextOnElement(i, gameboard[i]);
        }
    };

    const reset = () => {
        for(let i = 0; i < gameboard.length ; i++) {
            gameboard[i] = " ";
        }
        gameBoard.render();
    };

    return {create, reset, getGameBoard, render};
}
)();

const gamePlay = (() => {
    let player1 = player("player1", "X");
    let player2 = player("player2", "0");
    let gameActive = true;
    let round = 0;
    let gameboard = gameBoard.getGameBoard();

    const updatePlayerValues = () => {
        player1 = player(document.getElementById("p1name").value, document.getElementById("p1sign").value);
        player2 = player(document.getElementById("p2name").value, document.getElementById("p2sign").value);
    };
    //Gamelogic check for win or tie condition.
    //Returns false if not fulfilled else the symbol of the winning player
    const checkWin = () => {
        if (round > 4) {
            if (gameboard[0] != " ")  {
                if((gameboard[0] == gameboard[1] && gameboard[0] == gameboard[2]) || (gameboard[0] == gameboard[3] && gameboard[0] == gameboard[6]) || (gameboard[0] == gameboard[4] && gameboard[0] == gameboard[8])) {
                    return gameboard[0];
                }
            }
            if (gameboard[2] != " ") {
                if ((gameboard[2] == gameboard[5] && gameboard[2] == gameboard[8]) || (gameboard[2] == gameboard[4] && gameboard[2] == gameboard[6])) {
                    return gameboard[2];
                }
            }
            if (gameboard[7] != " ") {
                if ((gameboard[7] == gameboard[6] && gameboard[7] == gameboard[8]) || (gameboard[7] == gameboard[4] && gameboard[7] == gameboard[1])) {
                    return gameboard[7];
                }
            }
            if (gameboard[4] != " ") {
                if (gameboard[4] == gameboard[3] && gameboard[4] == gameboard[5]) {
                    return gameboard[4];
                }
            }
            if (gameboard[0] != " " && gameboard[1] != " " && gameboard[2] != " " && gameboard[3] != " " && gameboard[4] != " " && gameboard[5] != " " && gameboard[6] != " " && gameboard[7] != " " && gameboard[8] != " ") {
                return "TIE";
            }
        }
        return false;
    }
    //Adds a marker to the displaysquare if empty and checks for wincondition. 
    const addMarker = (e) => {
        if (e.target.textContent == " " && gameActive) {
            if (round%2 == 0) {
                gameboard[e.target.id] = player1.getSign;
            }
            else {
                gameboard[e.target.id] = player2.getSign;
            }
            round++;
            gameBoard.render();
            const win = checkWin();
            if (win) {
                if (win === player1.getSign) {
                    displayController.updateTextOnElement("announcement", player1.getName + " Wins!");    
                }
                if (win === player2.getSign) {
                    displayController.updateTextOnElement("announcement", player2.getName + " Wins!");
                }
                if (win === "TIE") {
                    displayController.updateTextOnElement("announcement", "TIE!");
                }
                gameActive = false;
            }
        }
    };
    const reset = () => {
        round = 0;
        gameActive = true;
        displayController.updateTextOnElement("announcement", "");
        gameBoard.reset();
    }

    return{addMarker, reset, updatePlayerValues};
}
)();

const displayController = (() => {
    const container = document.getElementById("container");

    //Creates a gameplaysquare and attatches listener.
    const addGameSquare = (gameContainer,id) => {
        const element = document.createElement("div");
        element.setAttribute('id', "box"+id);
        element.setAttribute('class', "boardelement");
        element.addEventListener('click', gamePlay.addMarker);
        const content = document.createElement("div");
        content.textContent = " ";
        content.className = "boxcontent";
        content.id = id;
        element.appendChild(content);
        gameContainer.appendChild(element);
    };
    //Updates the corresponding element to item_id with the content.
    const updateTextOnElement = (item_id, content) => {
        let element = document.getElementById(item_id);
        element.textContent = content;
    };
    //Creates and returns an input element with the id and value.
    const createInputElement = (id, value) => {
        let input = document.createElement("input");
        input.id = id;
        input.className = "textinput";
        input.value = value;
        input.type = "text";
        return input;
    }

    const createStartScreen = () => {
        let form = document.createElement("form");
        form.setAttribute('id', "startmenu");

        let p1Name = createInputElement("p1name","Player1");
        form.appendChild(p1Name);

        let p1Sign = createInputElement("p1sign","X");
        form.appendChild(p1Sign);

        let p2Name = createInputElement("p2name","Player2");
        form.appendChild(p2Name);

        let p2Sign = createInputElement("p2sign","0");
        form.appendChild(p2Sign);

        container.appendChild(form);

        let startbutton = document.createElement("button");
        startbutton.textContent = "Start Game";
        startbutton.id = "startbutton";
        startbutton.addEventListener('click', function () {
            hideStartScreen();
            createGameBoard();
        });
        container.appendChild(startbutton);

    };

    const hideStartScreen = () => {
        let startScreen = document.getElementById("startmenu");
        let startButton = document.getElementById("startbutton");
        startScreen.style.display = "none";
        startButton.style.display = "none";
    }

    const createGameBoard = () => {
        let gameboard = document.createElement("div");
        gameboard.className = "gameboard";
        for(let i = 0; i < 9; i++) {
            addGameSquare(gameboard, i);
        }
        container.appendChild(gameboard);

        let resetButton = document.createElement("button");
        resetButton.textContent = "Reset";
        resetButton.id = "resetbutton";
        resetButton.addEventListener('click', function() {
            gamePlay.reset();
            container.removeChild(gameboard);
            container.removeChild(resetButton);
            showStartScreen();
        });
        container.appendChild(resetButton);
        gamePlay.updatePlayerValues();
        gameBoard.create()
    };

    const showStartScreen = () => {
        let startScreen = document.getElementById("startmenu");
        let startButton = document.getElementById("startbutton");
        startScreen.style.display = "flex";
        startButton.style.display = "flex";
    };

    return {updateTextOnElement, createStartScreen};
}
)();
displayController.createStartScreen();