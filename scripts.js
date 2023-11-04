const gameGrid = document.querySelector('.game-grid');
const winnerModal = document.getElementById('winnerModal');
const winnerName = document.getElementById('winnerName');
const winnerSymbol = document.getElementById('winnerSymbol');
const modalRestart = document.getElementById('modal-restart');
const modalQuit = document.getElementById('modal-quit');


let currentPlayer = 'X';

document.addEventListener('DOMContentLoaded', function() {
    setupSelectionPage();
    setupGamePage();
});

function setupSelectionPage() {
    const readyPlayer1Btn = document.getElementById('readyPlayer1');
    const readyPlayer2Btn = document.getElementById('readyPlayer2');
    const startGameBtn = document.getElementById('startGameBtn');

    if (readyPlayer1Btn && readyPlayer2Btn && startGameBtn) {
        readyPlayer1Btn.addEventListener('click', function() {
            document.getElementById('player1ID').disabled = true;
            readyPlayer1Btn.disabled = true;
            document.getElementById('player2ID').disabled = false;
            document.getElementById('readyPlayer2').disabled = false;
        });

        readyPlayer2Btn.addEventListener('click', function() {
            document.getElementById('player2ID').disabled = true;
            readyPlayer2Btn.disabled = true;
            startGameBtn.disabled = false;
        });

        startGameBtn.addEventListener('click', function() {
            const gridSize = document.querySelector('input[name="gridSize"]:checked').value;
            const player1ID = document.getElementById('player1ID').value;
            const player2ID = document.getElementById('player2ID').value;

            sessionStorage.setItem('gridSize', gridSize);
            sessionStorage.setItem('player1ID', player1ID);
            sessionStorage.setItem('player2ID', player2ID);

            window.location.href = "index.html";
        });
    }
}

function setupGamePage() {
    const player1ID = sessionStorage.getItem('player1ID');
    const player2ID = sessionStorage.getItem('player2ID');
    const gridSize = parseInt(sessionStorage.getItem('gridSize'), 10);

    if (player1ID && player2ID) {
        document.querySelector('.dashboard-left .player-name').textContent = player1ID;
        document.querySelector('.dashboard-right .player-name').textContent = player2ID;
    }

    if (gridSize) {
        generateGrid(gridSize);
    }

    // Ajoutez ici d'autres fonctionnalités de la page de jeu, par exemple :
    gameGrid.addEventListener('click', handleCellClick);
}


function generateGrid(size) {
    gameGrid.innerHTML = ''; // Supprime tout le contenu existant
    gameGrid.style.gridTemplateColumns = `repeat(${size}, 50px)`;
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement('div');
        cell.className = 'cell';
        gameGrid.appendChild(cell);
    }
}

function handleCellClick(event) {
    const cell = event.target;

    if (!cell.classList.contains('cell') || cell.textContent !== '') return;

    cell.textContent = currentPlayer;
    cell.style.color = currentPlayer === 'X' ? 'blue' : 'red';
    
    
    if (checkWinner()) {
        winnerName.textContent = currentPlayer === 'X' ? document.querySelector('.dashboard-left .player-name').textContent : document.querySelector('.dashboard-right .player-name').textContent;
        winnerSymbol.textContent = currentPlayer;
        winnerModal.style.display = "block";
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
}

function checkWinner() {
    const rows = [];
    const cells = Array.from(document.querySelectorAll('.cell'));
    const size = Math.sqrt(cells.length); // Calcul de la taille en fonction du nombre de cellules
    while (cells.length) rows.push(cells.splice(0, size));

    // Vérification des lignes
    for (const row of rows) {
        if (row.every(cell => cell.textContent === currentPlayer)) return true;
    }

    // Vérification des colonnes
    for (let i = 0; i < size; i++) {
        if (rows.every(row => row[i].textContent === currentPlayer)) return true;
    }

    // Vérification des diagonales
    if (rows.every((row, index) => row[index].textContent === currentPlayer)) return true;
    if (rows.every((row, index) => row[size - 1 - index].textContent === currentPlayer)) return true;

    return false;
}


function reinitializeBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.style.backgroundColor = '#f4f4f4';
    });
    currentPlayer = 'X';
}


// Rafraîchir la page pour le bouton "Recommencer"
modalRestart.addEventListener('click', () => {
    location.reload();
});

// Rediriger vers la page de sélection pour le bouton "Quitter"
modalQuit.addEventListener('click', () => {
    window.location.href = 'selection.html';
});

// Fermer le modal avec la touche "ESC"
document.addEventListener('keyup', (e) => {
    if (e.key === 'Escape' && getComputedStyle(winnerModal).display === 'block') {
        winnerModal.style.display = 'none';
    }
});


document.getElementById('reset-game').addEventListener('click', function() {
    // Actualisez simplement la page
    location.reload();
});

document.getElementById('abandon').addEventListener('click', function() {
    let abandoningPlayerName;
    
    if (currentPlayer === 'X') {
        abandoningPlayerName = sessionStorage.getItem('player1ID');
    } else {
        abandoningPlayerName = sessionStorage.getItem('player2ID');
    }

    // Stockez le nom du joueur qui a abandonné pour l'utiliser plus tard
    sessionStorage.setItem('abandoningPlayerName', abandoningPlayerName);

    // Redirigez vers la page d'abandon
    window.location.href = 'abandon.html';
});
