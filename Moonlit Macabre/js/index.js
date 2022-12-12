const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.7

const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/oak woods 2.png',
})

const shop = new Sprite({
  position: {
    x: 610,
    y: 96,
  },
  imageSrc: './img/shop.png',
  scale: 3,
  framesMax: 6,
})

const player1 = new Fighter({
  position: {
    x: 200,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: './img/martial hero/Idle.png',
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: './img/martial hero/Idle.png',
      framesMax: 8,
    },
    run: {
      imageSrc: './img/martial hero/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/martial hero/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/martial hero/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/martial hero/Attack1.png',
      framesMax: 6,
    },
    attack2: {
      imageSrc: './img/martial hero/Attack2.png',
      framesMax: 6,
    },
    takeHit: {
      imageSrc: './img/martial hero/Take Hit - white silhouette.png',
      framesMax: 4,
    },
    death: {
      imageSrc: './img/martial hero/Death.png',
      framesMax: 6,
    },
  },
  hitbox: {
    offset: {
      x: 100,
      y: 50
    },
    width: 160,
    height: 50
  },
})

const player2 = new Fighter({
  position: {
    x: 770,
    y: 100
  },
  velocity: {
    x: 0,
    y: 0
  },
  color: 'blue',
  offset: {
    x: -50,
    y: 0
  },
  imageSrc: './img/martial hero 2/Idle.png',
  framesMax: 4,
  scale: 2.5,
  offset: {
    x: 215,
    y: 167,
  },
  sprites: {
    idle: {
      imageSrc: './img/martial hero 2/Idle.png',
      framesMax: 4,
    },
    run: {
      imageSrc: './img/martial hero 2/Run.png',
      framesMax: 8,
    },
    jump: {
      imageSrc: './img/martial hero 2/Jump.png',
      framesMax: 2,
    },
    fall: {
      imageSrc: './img/martial hero 2/Fall.png',
      framesMax: 2,
    },
    attack1: {
      imageSrc: './img/martial hero 2/Attack1.png',
      framesMax: 4,
    },
    takeHit: {
      imageSrc: './img/martial hero 2/Take hit - white silhouette.png',
      framesMax: 3,
    },
    death: {
      imageSrc: './img/martial hero 2/Death.png',
      framesMax: 7,
    },
  },
  hitbox: {
    offset: {
      x: -170,
      y: 50,
    },
    width: 170,
    height: 50,
  },
})

const keys = {
  a:{
    pressed: false
  },
  d:{
    pressed: false
  },
  q:{
    pressed: false
  },
  e:{
    pressed: false
  },
  ArrowRight:{
    pressed: false
  },
  ArrowLeft:{
    pressed: false
  },
}

decreaseTimer()

function animate() {
  window.requestAnimationFrame(animate)
  c.fillStyle = 'black'
  c.fillRect(0, 0, canvas.width, canvas.height)
  
  background.update()
  shop.update()
  c.fillStyle = 'rgba(255, 255, 255, 0.1)'           // white overlay to emphasize the characters
  c.fillRect(0, 0, canvas.width, canvas.height)
  
  player1.update()
  player2.update()

  player1.velocity.x = 0
  player2.velocity.x = 0

  // player1 walk
  if (
    keys.a.pressed && 
    player1.lastKey === 'a' &&
    player1.position.x !== 0
  ) {
    player1.velocity.x = -5
    player1.switchSprite('run')
  } else if (
    keys.d.pressed && 
    player1.lastKey === 'd' &&
    player1.position.x !== 960
  ) {
    player1.velocity.x = 5
    player1.switchSprite('run')
  } else {
    player1.switchSprite('idle')
  }
  // player1 dashes
  if (
    keys.q.pressed && 
    player1.lastKey === 'q' &&
    player1.position.x !== 0
  ) {
      player1.velocity.x = -10
      player1.switchSprite('run')
  } else if (
    keys.e.pressed &&
    player1.lastKey === 'e' &&
    player1.position.x !== 960
  ) {
    player1.velocity.x = 10
    player1.switchSprite('run')
  }
  // player1 jumping
  if (player1.velocity.y < 0) {
    player1.switchSprite('jump')
  } else if (player1.velocity.y > 0) {
    player1.switchSprite('fall')
  }

  // player2 walk
  if (
    keys.ArrowLeft.pressed && 
    player2.lastKey === 'ArrowLeft' &&
    player2.position.x !== 0
  ) {
    player2.velocity.x = -7
    player2.switchSprite('run')
  } else if (
    keys.ArrowRight.pressed && 
    player2.lastKey === 'ArrowRight' &&
    player2.position.x !== 960
  ) {
    player2.velocity.x = 7
    player2.switchSprite('run')
  } else {
    player2.switchSprite('idle')
  }
  // player2 jumping
  if (player2.velocity.y < 0) {
    player2.switchSprite('jump')
  } else if (player2.velocity.y > 0) {
    player2.switchSprite('fall')
  }

  // detect for collision & player2 gets hit
  if (
    collision({
      rect1: player1,
      rect2: player2
    }) &&
    player1.isAttacking &&
    player1.framesCurrent === 4
  ) {
    player2.takeHit()
    player2.health -= 25
    player2.velocity.x = 70
    player1.isAttacking = false

    gsap.to('#player2Health', {
      width: player2.health + '%'
    })
  }

  // if player1 misses
  if (player1.isAttacking && player1.framesCurrent === 4) {
    player1.isAttacking = false
  }

  // detect for collision & player1 gets hit
  if (
    collision({
      rect1: player2,
      rect2: player1
    }) &&
    player2.isAttacking &&
    player2.framesCurrent === 2
  ) {
    player1.takeHit()
    player1.health -= 10
    player1.velocity.x = -10
    player2.isAttacking = false

    gsap.to('#player1Health', {
      width: player1.health + '%'
    })
  }

  // if player2 misses
  if (player2.isAttacking && player2.framesCurrent === 2) {
    player2.isAttacking = false
  }

  // end game based on health
  if (player2.health <= 0 || player1.health <= 0) {
    c.fillStyle = 'rgba(0, 0, 0, 0.5)'                // black overlay for game over
    winner({ player1, player2, timerId })
  }
}

animate()

window.addEventListener('keydown', (event) => {
  if (!player1.dead){
    switch (event.key){
      // player1 buttons
      case 'd':
        keys.d.pressed = true
        player1.lastKey = 'd'
        break
      case 'q':
        keys.q.pressed = true
        player1.lastKey = 'q'
        break
      case 'a':
        keys.a.pressed = true
        player1.lastKey = 'a'
        break
      case 'e':
        keys.e.pressed = true
        player1.lastKey = 'e'
        break
      case 'w':
        if(
          player1.position.y === 330 &&               // prevents player1 from jumping infinitely
          player1.velocity.y === 0
          ){
            player1.velocity.y = -17
            break
          }else{
            return
          }
      case 'u':
        player1.attack()
        break
      }}

  if (!player2.dead){
      switch (event.key){
      // player2 buttons
      case 'ArrowRight':
        keys.ArrowRight.pressed = true
        player2.lastKey = 'ArrowRight'
        break
      case 'ArrowLeft':
        keys.ArrowLeft.pressed = true
        player2.lastKey = 'ArrowLeft'
        break
      case 'ArrowUp':
        if(
          player2.position.y === 330 &&               // prevents player2 from jumping infinitely
          player2.velocity.y === 0
          ){
            player2.velocity.y = -20
            break
          }else{
            return
          }
      case 'ArrowDown':
        player2.velocity.y = 20
        break
      case '1':
        player2.attack()
        break
    }
  }
})

window.addEventListener('keyup', (event) => {
  // player1 keys
  switch (event.key) {
    case 'd':
      keys.d.pressed = false
      break
    case 'a':
      keys.a.pressed = false
      break
    case 'q':
      keys.q.pressed = false
      break
    case 'e':
      keys.e.pressed = false
      break
  }
  // player2 keys
  switch (event.key) {
    case 'ArrowRight':
      keys.ArrowRight.pressed = false
      break
    case 'ArrowLeft':
      keys.ArrowLeft.pressed = false
      break
  }
})
