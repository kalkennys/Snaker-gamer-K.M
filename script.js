document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreElement = document.getElementById('score');
    const startButton = document.getElementById('startButton');
    
    // Controles touch
    const upBtn = document.getElementById('upBtn');
    const leftBtn = document.getElementById('leftBtn');
    const rightBtn = document.getElementById('rightBtn');
    const downBtn = document.getElementById('downBtn');
    
    // Configuração do jogo
    let box = 20;
    let snake = [];
    let direction = null;
    let food = {};
    let score = 0;
    let game = null;
    let gameRunning = false;
    
    // Ajusta o tamanho do canvas
    function resizeCanvas() {
        const size = Math.min(window.innerWidth - 40, 400);
        canvas.width = size;
        canvas.height = size;
        box = canvas.width / 20;
    }
    
    // Inicializa o jogo
    function initGame() {
        // Limpa o jogo anterior
        if (game) {
            clearInterval(game);
        }
        
        // Configuração inicial
        snake = [
            {x: 9 * box, y: 10 * box},
            {x: 8 * box, y: 10 * box},
            {x: 7 * box, y: 10 * box}
        ];
        direction = 'RIGHT';
        score = 0;
        scoreElement.textContent = score;
        gameRunning = true;
        
        // Cria a primeira comida
        createFood();
        
        // Inicia o loop do jogo
        game = setInterval(draw, 150);
    }
    
    // Cria comida em posição aleatória
    function createFood() {
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
        
        // Verifica se a comida não está em cima da cobra
        for (let i = 0; i < snake.length; i++) {
            if (food.x === snake[i].x && food.y === snake[i].y) {
                createFood();
                return;
            }
        }
    }
    
    // Desenha o jogo
    function draw() {
        if (!gameRunning) return;
        
        // Limpa o canvas
        ctx.fillStyle = '#ecf0f1';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Desenha a cobra
        for (let i = 0; i < snake.length; i++) {
            ctx.fillStyle = (i === 0) ? '#2c3e50' : '#3498db';
            ctx.fillRect(snake[i].x, snake[i].y, box - 1, box - 1);
            
            ctx.strokeStyle = '#ecf0f1';
            ctx.strokeRect(snake[i].x, snake[i].y, box, box);
        }
        
        // Desenha a comida
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(food.x, food.y, box, box);
        
        // Movimento da cobra
        let headX = snake[0].x;
        let headY = snake[0].y;
        
        if (direction === 'LEFT') headX -= box;
        if (direction === 'UP') headY -= box;
        if (direction === 'RIGHT') headX += box;
        if (direction === 'DOWN') headY += box;
        
        // Atravessar bordas
        if (headX < 0) headX = canvas.width - box;
        if (headX >= canvas.width) headX = 0;
        if (headY < 0) headY = canvas.height - box;
        if (headY >= canvas.height) headY = 0;
        
        // Verifica se comeu a comida
        if (headX === food.x && headY === food.y) {
            score++;
            scoreElement.textContent = score;
            createFood();
        } else {
            snake.pop();
        }
        
        // Nova cabeça
        const newHead = {x: headX, y: headY};
        
        // Verifica colisão consigo mesma
        for (let i = 0; i < snake.length; i++) {
            if (newHead.x === snake[i].x && newHead.y === snake[i].y) {
                gameOver();
                return;
            }
        }
        
        snake.unshift(newHead);
    }
    
    // Game over
    function gameOver() {
        gameRunning = false;
        clearInterval(game);
        alert(`Game Over! Pontuação: ${score}`);
        startButton.textContent = 'Jogar Novamente';
        startButton.style.display = 'block';
    }
    
    // Controles de teclado
    document.addEventListener('keydown', (e) => {
        if (!gameRunning) return;
        
        if (e.key === 'ArrowLeft' && direction !== 'RIGHT') {
            direction = 'LEFT';
        } else if (e.key === 'ArrowUp' && direction !== 'DOWN') {
            direction = 'UP';
        } else if (e.key === 'ArrowRight' && direction !== 'LEFT') {
            direction = 'RIGHT';
        } else if (e.key === 'ArrowDown' && direction !== 'UP') {
            direction = 'DOWN';
        }
    });
    
    // Controles touch
    function setupControl(button, dir) {
        button.addEventListener('touchstart', (e) => {
            e.preventDefault();
            if (gameRunning && direction !== oppositeDirection(dir)) {
                direction = dir;
            }
        });
        button.addEventListener('click', () => {
            if (gameRunning && direction !== oppositeDirection(dir)) {
                direction = dir;
            }
        });
    }
    
    function oppositeDirection(dir) {
        const opposites = {
            'LEFT': 'RIGHT',
            'RIGHT': 'LEFT',
            'UP': 'DOWN',
            'DOWN': 'UP'
        };
        return opposites[dir] || null;
    }
    
    setupControl(upBtn, 'UP');
    setupControl(leftBtn, 'LEFT');
    setupControl(rightBtn, 'RIGHT');
    setupControl(downBtn, 'DOWN');
    
    // Inicia o jogo
    startButton.addEventListener('click', () => {
        startButton.style.display = 'none';
        initGame();
    });
    
    // Redimensionamento responsivo
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
});