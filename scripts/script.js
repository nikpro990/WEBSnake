document.addEventListener("DOMContentLoaded", () =>{
    const canvas = document.getElementById("cvs");
    const ctx = canvas.getContext('2d');

    const MenuSnake = document.getElementById("menusnake_js");
    const buttonReturn = document.getElementById("return_js");
    const counter = document.getElementById("counter_js");
    const counterMenu = document.getElementById("count_js");
    let score = 0;
    let snakePaused = false;

    buttonReturn.addEventListener("click", () => {
        MenuSnake.style.display = 'none';
        snakePaused = false;
    });


    function showMenu(){
        MenuSnake.style.display = 'block';
        snakePaused = true;
        counterMenu.innerText = score;
    }

    const grid = 20;
    const snake = {
        x: 160, y: 160,
        dx: grid, dy: 0,
        cells: [],
        maxHeight: 2
    };
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


     function loop() { 
        requestAnimationFrame(loop);

        if(snakePaused) return;

        if(++count < 6) return;
        count = 0;

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
               let rawData = localStorage.getItem("apple_collection");
               let appleArrays = rawData ? JSON.parse(rawData) : []; 
               appleArrays.push({ points: 1, time: Date.now() });
               localStorage.setItem("apple_collection", JSON.stringify(appleArrays));
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

        ctx.fillStyle='red';
        ctx.fillRect(apple.x, apple.y, grid-1, grid-1);

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

    requestAnimationFrame(loop);
});

    
