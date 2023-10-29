

const gameBoard = document.querySelector("#gameboard")
const player = document.querySelector("#player")
const infoDisplay = document.querySelector("#info-display")
const undoButton = document.querySelector("#undo-button")
let movingPieceImageElement;
let movingPieceStartElement;
let movingStartSquare;
let movingEndSquare;

const currentBoard = new board();
function startGame() {
    currentBoard.board.forEach((row, j) => {
        row.forEach((piece, i) => {
            const square = document.createElement("div");
            square.classList.add("square");
            square.id = 8 * j + i;
            switch((i + j) % 2) {
                case 0:
                    square.classList.add("white");
                    break;
                case 1:
                    square.classList.add("black");
                    break;
            }
            if (piece != "--") {
                let pieceImage = pieceImages[piece];
                square.innerHTML = pieceImage;
            };
            
            square.addEventListener("dragstart", (event) => {
                dragPiece(event);
            });
            square.addEventListener("dragover", (event) => {
                event.preventDefault();
            });
            square.addEventListener("drop", (event) => {
                event.stopPropagation();
                dropPiece(event);
                
            });
            gameBoard.append(square)
        });
    });
    undoButton.addEventListener("click", () => {
        currentBoard.undoMove()
    });
};

function dragPiece(event) {
    movingPieceImageElement = event.target;
    movingPieceStartElement = event.target.parentNode;
    let parentID = movingPieceStartElement.id;
    movingStartSquare = [parentID % 8, Math.floor(parentID / 8)];
};

function dropPiece(event) {
    let target;
    let targetIsImage = false;
    if (event.target.tagName == "IMG") {
        target = event.target.parentNode;
        targetIsImage = true;
    } else {
        target = event.target;
    };
    let parentID = target.id;
    movingEndSquare = [parentID % 8, Math.floor(parentID / 8)];
    console.log(movingStartSquare, movingEndSquare, target);
    let movingPieceIsPawn = movingPieceImageElement.classList.contains("P");
    let movingPieceIsKing = movingPieceImageElement.classList.contains("K");
    let isPromotion = false;
    let isCastling = false;
    let isAnPassant = false;
    if (movingPieceIsPawn) {
        isPromotion = parentID < 8 || parentID > 55;
        whiteAnPassant = (movingStartSquare[1] == 3 && movingEndSquare[1] == 2 && Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 1);
        blackAnPassant = (movingStartSquare[1] == 4 && movingEndSquare[1] == 5 && Math.abs(movingEndSquare[0] - movingStartSquare[0]) == 1);
        isAnPassant = whiteAnPassant || blackAnPassant;
    } else if (movingPieceIsKing) {
        isCastleStart = movingStartSquare[0] == 4 && (movingStartSquare[1] == 0 || movingStartSquare[1] == 7);
        isCastleEnd = (parentID == 2) || (parentID == 6) || (parentID == 58) || (parentID == 62);
        isCastling = isCastleStart && isCastleEnd;
    };
    let currentMove = new Move(movingStartSquare, movingEndSquare, isPromotion, isCastling, isAnPassant);
    let [moveMade, squaresToBeUpdated] = currentBoard.makeMove(currentMove);
    if (moveMade) {
        updateSquares(squaresToBeUpdated);
    };
};

function updateSquares(squaresToBeUpdated) {
    player.textContent = currentBoard.whiteToMove ? "white" : "black";
    squaresToBeUpdated.forEach((pos) => {
        let [i, j] = pos;
        let id = i + j * 8;
        let squareToBeUppdated = document.querySelector(`[id="${id}"]`)
        let piece = currentBoard.board[j][i]
        if (piece != "--") {
            squareToBeUppdated.innerHTML = pieceImages[piece];
        } else {
            squareToBeUppdated.innerHTML = "";
        };
    });
};

startGame();