const yourShip = document.querySelector('#player');
const playArea = document.querySelector('#game');
const enemies = ['&#128126;', '&#129302;', '&#128123;'];
const enemiesPosition = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550];
let score = 0;
const instructions = document.querySelector('#instructions');
const startButton = document.querySelector('#start');

let enemiesInterval;

// movimentação e ação
function flyShip(event){
  if(event.key === 'ArrowUp'){
    event.preventDefault();
    moveUp();
  }else if(event.key === 'ArrowDown'){
    event.preventDefault();
    moveDown();
  }else if(event.key === ' '){
    event.preventDefault();
    fireLaser();
  }
}

// mover para cima
function moveUp(){
  let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
  if(topPosition === '0px'){
    return;
  }else{
    let topPositionValue = parseInt(topPosition);
    topPositionValue -= 50;
    yourShip.style.top = `${topPositionValue}px`;
  }
}

// mover para baixo
function moveDown(){
  let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
  if(topPosition === '550px'){
    return;
  }else{
    let topPositionValue = parseInt(topPosition);
    topPositionValue += 50;
    yourShip.style.top = `${topPositionValue}px`;
  }
}
// disparar 
function fireLaser(){
  let laser = createLaserElement();
  playArea.appendChild(laser);
  moveLaser(laser);
}

// criando disparo
function createLaserElement(){
  let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
  let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
  let newLaser = document.createElement('div');
  newLaser.innerHTML = `&#9732;&#65039;`
  newLaser.classList.add('laser');
  newLaser.style.left = `${xPosition}px`;
  newLaser.style.top = `${yPosition}px`;
  return newLaser;
}

// animação do disparo
function moveLaser(laser){
  let laserInterval = setInterval(() => {
    let xPosition = parseInt(laser.style.left);
    let enemiesOnScreen = document.querySelectorAll('.enemy');

    enemiesOnScreen.forEach( enemy => {
      if(checkCollision(laser, enemy)){
        enemy.innerHTML = `&#128165;`;
        enemy.classList.remove('enemy');
        enemy.classList.add('dead-enemy');
        score++;
        console.log(score);  // PONTUAÇÃO
        laser.remove();
        clearInterval(laserInterval)
      }
    })

    if(xPosition >= 500){
      laser.remove();
      clearInterval(laserInterval)
    }else{
      laser.style.left = `${xPosition+4}px`;
    }
  }, 10);
}

// criando inimigos aleatórios
function createEnemies(){
  let newEnemy = document.createElement('div');
  let enemySprite = enemies[Math.floor(Math.random() * enemies.length)];
  newEnemy.innerHTML = enemySprite;
  newEnemy.classList.add('enemy');
  newEnemy.classList.add('enemy-transition');
  newEnemy.style.left = '550px';
  let enemyY = enemiesPosition[Math.floor(Math.random() * enemiesPosition.length)]
  newEnemy.style.top = `${enemyY}px`;

  playArea.appendChild(newEnemy);
  moveEnemy(newEnemy);
}

// movimento dos inimigos
function moveEnemy(enemy){
  let moveEnemyInterval = setInterval( () => {
    let xPosition = parseInt(window.getComputedStyle(enemy).getPropertyValue('left'));
    if(xPosition < 20){
      if(enemy.classList.contains('dead-enemy')){
        enemy.remove();
        clearInterval(moveEnemyInterval);
      }else{
       gameOver();
      }
    }else{
      enemy.style.left = `${xPosition-4}px`;
    }
  }, 30);
}

//colisão
function checkCollision(laser, enemy){
  let laserTop = parseInt(laser.style.top);
  let laserLeft = parseInt(laser.style.left);
  //let laserBottom = laserTop - 20;

  let enemyTop = parseInt(enemy.style.top);
  let enemyLeft = parseInt(enemy.style.left);
  //let enemyBottom = enemyTop - 30;

  if(laserLeft!=550 && laserLeft + 50 >= enemyLeft){
    if(laserTop==enemyTop){
      return true;
    }else{
      return false;
    }
  }else{
    return false;
  }
}

// iniciar jogo
function startGame(){
  instructions.style.display = 'none';
  window.addEventListener('keydown', flyShip);
  enemiesInterval = setInterval( () => {
    createEnemies();
  }, 2000);

}

startButton.addEventListener('click', startGame);

// fim de jogo
function gameOver(){
  window.removeEventListener('keydown', flyShip);
  clearInterval(enemiesInterval);
  let enemies2 = document.querySelectorAll('.enemy');
  enemies2.forEach( enemy => enemy.remove());
  let lasers = document.querySelectorAll('.laser');
  lasers.forEach( laser => laser.remove());
  score = 0;
  setTimeout( () => {
    alert('Game Over!');
    yourShip.style.top = '250px';
    startButton.style.display = 'block';
    instructions.style.display = 'flex';
  })
}