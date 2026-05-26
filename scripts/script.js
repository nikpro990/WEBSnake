document.addEventListener("DOMContentLoaded", () =>{
    const canvas = document.getElementById("cvs");
    const ctx = canvas.getContext('2d');
    const MenuSnake = document.getElementById("menusnake_js");
    const buttonReturn = document.getElementById("return_js");
    const counter = document.getElementById("counter_js");
    const counterMenu = document.getElementById("count_js");
    const left = document.getElementById("left_js")
    const right = document.getElementById("right_js")
    const up = document.getElementById("up_js")
    const down = document.getElementById("down_js")
    let score = 0;
    let snakePaused = false;
    let timePaused = false;
    let counterTime = 0;
    let directionQueue = []; 

    buttonReturn.addEventListener("click", () => {
        MenuSnake.style.display = 'none';
        timePaused = false;
        snakePaused = false;
    });

    function showMenu(){
        MenuSnake.style.display = 'block';
        snakePaused = true;
        timePaused = true;
        counterMenu.innerText = score;
        directionQueue = []; 
    }

    const grid = 20;    
    const snake = {
        x: 160, y: 160,
        dx: grid, dy: 0,
        cells: [],
        maxHeight: 2
    };
    
    const appleTexture = new Image()
    appleTexture.src = "../image/apple.png"
    let apple = {x: 100, y: 100};

    let count = 0;

     function drawGrid(){
        ctx.strokeStyle='#90EE90';
        ctx.lineWidth=1;

        for(var x = 0; x <= canvas.width; x += grid){
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, canvas.height);
            ctx.stroke();
        }

        for(var y = 0; y <= canvas.height; y += grid){
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(canvas.width, y);
            ctx.stroke();
        }
     }

     setInterval(() => {
        if(!timePaused){
            counterTime += 1;
            
            let rawDataTime = localStorage.getItem("score_time");
            let timeArrays = [];
            
            try {
                timeArrays = rawDataTime ? JSON.parse(rawDataTime) : [];
                if (!Array.isArray(timeArrays)) timeArrays = [];
            } catch(e) {
                timeArrays = [];
            }

            timeArrays.push({ seconds: 1, time: Date.now() });
            localStorage.setItem("score_time", JSON.stringify(timeArrays));
        }
    }, 1000);


     function loop() { 
        requestAnimationFrame(loop);

        if(snakePaused) return;

        if(++count < 8) return;
        count = 0;


        if (directionQueue.length > 0) {
            const nextDir = directionQueue.shift();
            snake.dx = nextDir.dx;
            snake.dy = nextDir.dy;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        drawGrid();

        snake.x += snake.dx;
        snake.y += snake.dy;

        if(snake.x < 0 || snake.x >= canvas.width || snake.y < 0 || snake.y >= canvas.height){
            showMenu();
            score = 0;
            counter.innerText = score;
            apple.x = 100,
            apple.y = 100,
            snake.x = 160,
            snake.y = 160,
            snake.dx = grid,
            snake.dy = 0,
            snake.cells = [];
            snake.maxHeight = 2;            
        }
    
        snake.cells.unshift({x: snake.x, y: snake.y});
        if(snake.cells.length > snake.maxHeight) snake.cells.pop();
        
        ctx.fillStyle='green';
        snake.cells.forEach((cell, index) => {
            if(index == 0){
              ctx.fillStyle='#0c6600';
            }
            else{
               ctx.fillStyle='green';
            }
            ctx.fillRect(cell.x, cell.y, grid-1, grid-1);
            
            if(cell.x == apple.x && cell.y == apple.y){
               snake.maxHeight++;
               score += 1;
               counter.innerText = score;
               let rawDataApples = localStorage.getItem("score_apples");
               let appleArrays = [];
               
               try {
                   appleArrays = rawDataApples ? JSON.parse(rawDataApples) : [];
                   if (!Array.isArray(appleArrays)) appleArrays = [];
               } catch(e) {
                   appleArrays = [];
               }

               appleArrays.push({ points: 1, time: Date.now() });
               localStorage.setItem("score_apples", JSON.stringify(appleArrays));
               apple.x = Math.floor(Math.random() * 20) * grid;
               apple.y = Math.floor(Math.random() * 20) * grid;
            }

            for(let i = index + 1; i < snake.cells.length; i++){
                if(cell.x == snake.cells[i].x && cell.y == snake.cells[i].y){
                    showMenu();
                    score = 0;
                    counter.innerText = score;
                    apple.x = 100,
                    apple.y = 100,
                    snake.x = 160,
                    snake.y = 160,
                    snake.dx = grid,
                    snake.dy = 0,
                    snake.cells = [];
                    snake.maxHeight = 2;
                }
            }
        });

        ctx.drawImage(appleTexture, apple.x, apple.y, grid - 1, grid - 1);

    }

    function changeDirection(targetDx, targetDy) {
    const lastDir = directionQueue.length > 0 ? directionQueue[directionQueue.length - 1] : { dx: snake.dx, dy: snake.dy };
    
    if (targetDx !== 0 && lastDir.dx !== 0) return; 
    if (targetDy !== 0 && lastDir.dy !== 0) return; 
    if (targetDx === lastDir.dx && targetDy === lastDir.dy) return;

    if (directionQueue.length < 2) {
        directionQueue.push({ dx: targetDx, dy: targetDy });
    }
    }

    document.addEventListener("keydown", (e) => {
        if(snakePaused) return;

        if(e.key === "ArrowLeft" && snake.dx === 0){
            snake.dx = -grid;
            snake.dy = 0;
        }
        if(e.key === "ArrowRight" && snake.dx === 0){
            snake.dx = grid;
            snake.dy = 0;
        }
        if(e.key === "ArrowUp" && snake.dy === 0){
            snake.dx = 0;
            snake.dy = -grid;
        }
        if(e.key === "ArrowDown" && snake.dy === 0){
            snake.dx = 0;
            snake.dy = grid;
        }
    });

    left.addEventListener("click", () => {
       if(snakePaused) return;
       if(snake.dx === 0){
        snake.dx = -grid;
        snake.dy = 0;
       } 
    });
    right.addEventListener("click", () => {
       if(snakePaused) return;
       if(snake.dx === 0){
        snake.dx = grid;
        snake.dy = 0;
       } 
    });
    up.addEventListener("click", () => {
        if(snakePaused) return;
        if(snake.dy === 0){
            snake.dx = 0;
            snake.dy = -grid;
        }
    });
    down.addEventListener("click", () => {
        if(snakePaused) return;
        if(snake.dy === 0){
            snake.dx = 0;
            snake.dy = grid;
        }
    });


    requestAnimationFrame(loop);
});

    
