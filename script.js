const gamesBoardContainer = document.querySelector('#gamesboard-container');
const optionContainer = document.querySelector('#option-container');
const flipButton = document.querySelector('#sens-button');
const startButton = document.querySelector('#start-button');
const info = document.querySelector('#info');
const turn = document.querySelector('#turn-display');

flipButton.addEventListener('click', flip);

let angle = 0;

function flip() {
    const optionShips = Array.from(optionContainer.children);
    if (angle === 0) {
        angle = 90;
        optionShips.forEach(optionShip => optionShip.style.transform = `rotate(90deg)`);
        optionContainer.style.height = 200+"px";
        flipButton.textContent = 'Horizontale';
    } else if (angle === 90) {
        angle = 0;
        optionShips.forEach(optionShip => optionShip.style.transform = `rotate(0deg)`);
        optionContainer.style.height = 40+"px";
        flipButton.textContent = 'Verticale';
    }
}

const width = 10;

function createBoard(user) {
    const usersContainer = document.createElement('div');
    usersContainer.classList.add('users');
    usersContainer.id = user+"-container";



    const usersPicture = document.createElement('img');
    usersPicture.classList.add('userPicture')

    const gameBoardContainer = document.createElement('div');
    gameBoardContainer.classList.add('game-board');
    gameBoardContainer.id = user;


    for (let i = 0; i < width * width; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.id = i;
        gameBoardContainer.append(block);
    }

    usersContainer.append(gameBoardContainer, usersPicture);
    gamesBoardContainer.append(usersContainer);
}
createBoard('player');
createBoard('computer');

class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
    }
}

const portAvion = new Ship('portAvion', 5);
const destroyer = new Ship('destroyer', 3);
const submarin = new Ship('submarin', 3);
const patrouilleur = new Ship('patrouilleur', 2);

const ships = [portAvion, destroyer, submarin, patrouilleur];
let notDropped;

function getValidity(allBoardBlocks, isHorizontal, startIndex, ship) {
    let validStart = isHorizontal ? (startIndex <= width * width - ship.length ? startIndex : width * width - ship.length) :
        (startIndex <= width * width - width * ship.length ? startIndex : startIndex - ship.length * width + width);

    let shipBlocks = [];

    for (let i = 0; i < ship.length; i++) {
        if (isHorizontal) {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
        } else {
            shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
        }
    }

    let valid = true;


    if (isHorizontal) {
        shipBlocks.every((_shipBlock, index) =>
            valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)));
    } else {
        shipBlocks.every((_shipBlock, index) =>
            valid = shipBlocks[0].id < 90 + (width * index + 1));
    }

    const notToken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));
    return { shipBlocks, valid, notToken };
}

function addShipPiece(user, ship, startId) {
    const allBoardBlocks = document.querySelectorAll(`#${user} div`);
    let randomBoolean = Math.random() < 0.5;
    let isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
    let randomStartIndex = Math.floor(Math.random() * width * width);

    let startIndex = startId ? startId : randomStartIndex;

    const { shipBlocks, valid, notToken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

    if (valid && notToken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add(ship.name);
            shipBlock.classList.add('taken');
        });
    } else {
        if (user === 'computer') addShipPiece(user, ship, startId);
        if (user === 'player') notDropped = true;
    }
}
ships.forEach(ship => addShipPiece('computer', ship));

// Drag des bateaux du joueur
let draggedShip;
const optionShips = Array.from(optionContainer.children);
optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart));

const allPlayerBlocks = document.querySelectorAll('#player div');
allPlayerBlocks.forEach(playerBlock => {
    playerBlock.addEventListener('dragover', dragOver);
    playerBlock.addEventListener('drop', dropShip);
});

function dragStart(e) {
    notDropped = false;
    draggedShip = e.target;
}

function dragOver(e) {
    e.preventDefault();
    const ship = ships[draggedShip.id];
    highlightArea(e.target.id, ship);
}

function dropShip(e) {
    const startId = e.target.id;
    const ship = ships[draggedShip.id];
    addShipPiece('player', ship, startId);
    if (!notDropped) {
        draggedShip.remove();
    }
}

function highlightArea(startIndex, ship) {
    const allBoardBlocks = document.querySelectorAll(`#player div`);
    let isHorizontal = angle === 0;

    const { shipBlocks, valid, notToken } = getValidity(allBoardBlocks, isHorizontal, startIndex, ship);

    if (valid && notToken) {
        shipBlocks.forEach(shipBlock => {
            shipBlock.classList.add('hover');
            setTimeout(() => shipBlock.classList.remove('hover'), 500);
        });
    }
}

let gameOver = false;
let playerTurn = true;

// début du jeu
function startGame() {
    if (playerTurn) {
        if (optionContainer.children.length !== 0) {
            info.textContent = 'Veuillez placer tous vos bateaux en premier';
        } else {
            const allBoardBlocks = document.querySelectorAll('#computer div');
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick));
            playerTurn = true;
            turn.textContent = "C'est à vous !";
            info.textContent = "La partie commence !";
            optionContainer.style.display = "none";
            document.getElementById('sens-button').style.display = "none";
        }
    }
}
startButton.addEventListener('click', startGame);

let playerHits = [];
let computerHit = [];
const playerSunkShips = [];
const computerSunkShips = [];

function handleClick(e) {
    if (!gameOver) {
        if (e.target.classList.contains('taken')) {
            e.target.classList.add('boom');
            info.textContent = 'Touché !';
            let classes = Array.from(e.target.classList);
            classes = classes.filter(className => className !== 'block');
            classes = classes.filter(className => className !== 'boom');
            classes = classes.filter(className => className !== 'taken');
            playerHits.push(...classes);
            checkScore('player', playerHits, playerSunkShips);
        }
        if (!e.target.classList.contains('taken')) {
            info.textContent = 'Dans l’eau !';
            e.target.classList.add('vide');
        }
        playerTurn = false;
        const allBoardBlocks = document.querySelectorAll('#computer div');
        allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)));
        setTimeout(computerGo, 3000);
    }
}

// définir le tour de l'ordinateur
function computerGo() {
    if (!gameOver) {
        turn.textContent = 'Au tour de l ordinateur';
        info.textContent = 'En attente du tour de l ordinateur';

        setTimeout(() => {
            let randomGO = Math.floor(Math.random() * width * width);
            const allBoardBlocks = document.querySelectorAll('#player div');

            if (allBoardBlocks[randomGO].classList.contains('taken') &&
                allBoardBlocks[randomGO].classList.contains('boom')) {
                computerGo();
            } else if (allBoardBlocks[randomGO].classList.contains('taken') &&
                !allBoardBlocks[randomGO].classList.contains('boom')) {
                allBoardBlocks[randomGO].classList.add('boom');
                info.textContent = 'L ordinateur a touché votre navire';
                let classes = Array.from(allBoardBlocks[randomGO].classList);
                classes = classes.filter(className => className !== 'block');
                classes = classes.filter(className => className !== 'boom');
                classes = classes.filter(className => className !== 'taken');
                computerHit.push(...classes);
                checkScore('computer', computerHit, computerSunkShips);
            } else {
                info.textContent = 'Dans l eau pour l ordinateur';
                allBoardBlocks[randomGO].classList.add('vide');
            }
        }, 3000);

        setTimeout(() => {
            playerTurn = true;
            turn.textContent = 'A votre tour !';
            info.textContent = '....';
            const allBoardBlocks = document.querySelectorAll('#computer div');
            allBoardBlocks.forEach(block => block.addEventListener('click', handleClick));
        }, 6000);
    } else {
            document.getElementById('overlay').style.display = "block";
            document.getElementById('popup').style.display = "grid";
    }
}

function checkScore(user, userHits, userSunkShips) {
    function checkShip(shipName, shipLength) {
        const hitsOfType = userHits.filter(storedShipName => storedShipName === shipName);
        if (hitsOfType.length === shipLength) {
            if (user === 'player') {
                playerHits = playerHits.filter(storedShipName => storedShipName !== shipName);
                info.textContent = `${user} à coulé le ${shipName} de l'ordinateur`;
            }
            if (user === 'computer') {
                computerHit = computerHit.filter(storedShipName => storedShipName !== shipName);
                info.textContent = `${user} à coulé le ${shipName} du joueur`;
            }
            userSunkShips.push(shipName);
        }
    }
    checkShip('destroyer', 3);
    checkShip('submarin', 3);
    checkShip('patrouilleur', 2);
    checkShip('portAvion', 5);

    console.log('playerHits', playerHits);
    console.log('playerSunkShips', playerSunkShips);

    if (playerSunkShips.length === 4) {
        info.textContent = 'Vous avez coulé tous les navires de guerre ennemis. Well Done !';
        gameOver = true;
    }
    if (computerSunkShips.length === 4) {
        info.textContent = 'Vous avez perdu tous vos navires de guerre. Try again !';
        gameOver = true;
    }
}

//restart game
document.getElementById('restart-button').addEventListener('click', function () {
    location.reload();
})
