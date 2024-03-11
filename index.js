
//shapes
const gridWidth = 10

const LShape = [
    [1,2, gridWidth + 1,gridWidth*2+1],
    [gridWidth, gridWidth+1, gridWidth+2, gridWidth*2+2],
    [1, gridWidth+1, gridWidth*2, gridWidth*2+1],
    [gridWidth, gridWidth*2, gridWidth*2+1, gridWidth*2+2]
]

const ZShape = [
    [gridWidth+1, gridWidth+2, gridWidth*2, gridWidth*2+1],
    [0, gridWidth, gridWidth+1, gridWidth*2+1],
    [gridWidth*2, gridWidth*2+1, gridWidth+1, gridWidth+2],
    [0, gridWidth, gridWidth+1, gridWidth*2+1]
]

const TShape = [
    [1, gridWidth, gridWidth+1, gridWidth+2],
    [1, gridWidth+1, gridWidth+2, gridWidth*2+1],
    [gridWidth, gridWidth+1, gridWidth+2, gridWidth*2+1],
    [1, gridWidth, gridWidth+1, gridWidth*2+1]
]

const OShape = [
    [0,1,gridWidth, gridWidth+1],
    [0,1,gridWidth, gridWidth+1],
    [0,1,gridWidth, gridWidth+1],
    [0,1,gridWidth, gridWidth+1]
]

const IShape = [
    [1, gridWidth+1, gridWidth*2+1, gridWidth*3+1],
    [gridWidth, gridWidth+1, gridWidth+2, gridWidth+3],
    [1, gridWidth+1, gridWidth*2+1, gridWidth*3+1],
    [gridWidth, gridWidth+1, gridWidth+2, gridWidth+3]
]

const allShapes = [
    LShape, ZShape, TShape, OShape, IShape
]
const colors = ["blue", "yellow", "red", "orange", "pink"]
let currentColor = Math.floor(Math.random() * colors.length)
let nextColor = colors[currentColor]

let currentPosition = 3 //determina o centro do campo
let currentRotation = 0 //determina a posição no seu próprio eixo
let randomShape = Math.floor(Math.random() * allShapes.length)
let currentShape = allShapes[randomShape][currentRotation]
let $gridSquares = Array.from(document.querySelectorAll(".grid div"))

function draw(){
    currentShape.forEach(squareIndex =>{
        $gridSquares[squareIndex + currentPosition].classList.add("shapePainted",`${colors[currentColor]}`)
    })
}
draw()

function undraw(){
    currentShape.forEach(squareIndex =>{
        $gridSquares[squareIndex + currentPosition]. classList.remove('shapePainted',`${colors[currentColor]}`)
    })
}

const $restartButon = document.getElementById("restart-button")
$restartButon.addEventListener("click", () => {
    window.location.reload()
})

//setInterval(moveDown, 1000) //determina o movimento da peça para baixo em um intervalo de 1 segundo

    let timeMoveDown = 1000

    let timerId = null
    const $startStopButton = document.getElementById("start-button")
    $startStopButton.addEventListener("click", () =>{
        if(timerId){
            clearInterval(timerId)
            timerId = null
        }
        else{
            timerId =setInterval(moveDown, timeMoveDown)
        }
    })

function moveDown(){

    freeze()

    undraw()
    currentPosition += 10 // detrmina o quanto a peça vai se deslocar a cada segundo
    draw()
}
function freeze(){
    if(currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition + gridWidth].classList.contains("filled")
        )) {
            currentShape.forEach(squareIndex => $gridSquares[squareIndex + currentPosition].classList.add("filled"))
        
            currentPosition = 3 
            currentRotation = 0 
            randomShape = nextRandomShape
            currentShape = allShapes[randomShape][currentRotation]
            currentColor = nextColor
            draw()

            checkIfRowIsFilled()
            updateScore(20)
            displayNextShape()
            gameOver()
        }
}

function moveLeft(){
    const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === 0)
        if(isEdgeLimit) return

    const isFilled = currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition - 1].classList.contains("filled")
        )
        if(isFilled) return

    undraw()
    currentPosition--
    draw()
}
function moveRight(){
    const isEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === gridWidth-1)
    if(isEdgeLimit) return

    const isFilled = currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition + 1].classList.contains("filled")
        )
        if(isFilled) return

    undraw()
    currentPosition++
    draw()
}

function rotate(){
    undraw()
        if(currentRotation === currentShape.length-1){
            currentRotation = 0
        }
        else{
            currentRotation++
        }

        currentShape = allShapes[randomShape][currentRotation]

    const isLeftEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth ===0)
    const isRightEdgeLimit = currentShape.some(squareIndex => (squareIndex + currentPosition) % gridWidth === gridWidth -1)
    if(isLeftEdgeLimit && isRightEdgeLimit){
        if( currentRotation === 0){
            currentRotation = currentShape.length - 1
        }
        else{
            currentRotation--
        }
        currentShape = allShapes[randomShape][currentRotation]
    }

    const isFiled = currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition].classList.contains("filled")
        )
        if(isFiled){
            if( currentRotation === 0){
                currentRotation = currentShape.length - 1
            }
            else{
                currentRotation--
            }
            currentShape = allShapes[randomShape][currentRotation]
        }


    draw()
}

let $grid = document.querySelector(".grid")
function checkIfRowIsFilled(){
    for ( var row = 0; row < $gridSquares.length; row += gridWidth){
        let currentRow = []

        for (var square = row; square < row + gridWidth; square++){
            currentRow.push(square)
        }

        const isRowPainted = currentRow.every(square =>
            $gridSquares[square].classList.contains("shapePainted")
        )
    if (isRowPainted){
        const squaresRemoved = $gridSquares.splice(row, gridWidth)
        squaresRemoved.forEach(square =>
            //square.classList.remove("shapePainted", "filled")
            square.removeAttribute("class")
            )
        $gridSquares = squaresRemoved.concat($gridSquares)
        $gridSquares.forEach(square => $grid.appendChild(square))

        updateScore(100)
        //completedLineAudio.play()
        }
        
    }
}

const $miniGridSquares = document.querySelectorAll(".mini-grid div")
const miniGridWidth = 6
const nextPosition = 2
const possibleNextShapes = [
    [1,2, miniGridWidth + 1,miniGridWidth*2+1],
    [miniGridWidth+1, miniGridWidth+2, miniGridWidth*2, miniGridWidth*2+1],
    [1, miniGridWidth, miniGridWidth+1, miniGridWidth+2],
    [0,1,miniGridWidth, miniGridWidth+1],
    [1, miniGridWidth+1, miniGridWidth*2+1, miniGridWidth*3+1]
]

let nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)

function displayNextShape(){

    $miniGridSquares.forEach(square => square.classList.remove("shapePainted",`${colors[nextColor]}`))
    nextRandomShape = Math.floor(Math.random() * possibleNextShapes.length)
    nextColor = Math.floor(Math.random() * colors.length)
    const nextShape = possibleNextShapes[nextRandomShape]
    nextShape.forEach(squareIndex =>
        $miniGridSquares[squareIndex + nextPosition + miniGridWidth].classList.add("shapePainted",`${colors[nextColor]}`)
        )
}
displayNextShape()

const $score = document.querySelector(".score")
let score = 0
function updateScore(updateScore){
    score += updateScore
    $score.textContent = score

    clearInterval(timerId)

    if(score <= 1000){
        timeMoveDown =900;
    }else if(1000 < score && score <=2000){
        timeMoveDown =800;
    }else if(2000 < score && score <=3000){
        timeMoveDown =700;
    }else if(3000 < score && score <=4000){
        timeMoveDown =600;
    }else if(4000 < score && score <=5000){
        timeMoveDown =500;
    }else if(5000 < score && score <=6000){
        timeMoveDown =400;
    }else if(6000 < score && score <=7000){
        timeMoveDown =300;
    }else if(7000 < score && score <8000){
        timeMoveDown =200;
    }else{
        timeMoveDown =100;
    }
    timerId = setInterval(moveDown, timeMoveDown)

}

function gameOver(){
    if(currentShape.some(squareIndex =>
        $gridSquares[squareIndex + currentPosition]. classList.contains("filled")))
        {
            updateScore(-20)
            clearInterval(timerId)
            timerId = null
            $startStopButton.disabled= true
            gameOverAudio.play()
            $score.innerHTML += "<br />" + "GAME OVER"

        }
}

document.addEventListener("keydown", controlKeyboard) //determina a função do teclado

function controlKeyboard(event){
    if(timerId){
    if(event.key === "ArrowLeft"){
        moveLeft()
    }
    else if(event.key === "ArrowRight"){
        moveRight()
    }
    else if(event.key === "ArrowDown"){
        moveDown()
    }
    else if(event.key === "ArrowUp"){
        rotate()
    }
}

}

const isMobile = window.matchMedia('(max-width: 800px)').matches
    if(isMobile){
        const $mobileButtons = document.querySelectorAll(".mobile-buttons-container button")
        $mobileButtons.forEach(button => button.addEventListener("click", () =>{
        if(timerId){
            if(button.classList[0] === "left-button"){
                moveLeft()
            }else if(button.classList[0] === "right-button"){
                moveRight()
            }else if(button.classList[0] ==="down-button"){
                moveDown()
            }else if(button.classList[0] ==="rotate-button"){
                rotate()
            }
        }
        }))
    }