function collision({rect1, rect2}) {
  return (
    rect1.hitbox.position.x + rect1.hitbox.width >=
      rect2.position.x &&
    rect1.hitbox.position.x <=
      rect2.position.x + rect2.width &&
    rect1.hitbox.position.y + rect1.hitbox.height >=
      rect2.position.y &&
    rect1.hitbox.position.y <= rect2.position.y + rect2.height
  )
}

function winner({ player1, player2, timerId }) {
  clearTimeout(timerId)
  document.querySelector('#text').style.display = 'flex'

  if (player1.health === player2.health) {
    document.querySelector('#text').innerHTML = 'Draw'
  } else if (player1.health > player2.health) {
    document.querySelector('#text').innerHTML = 'Player 1 Wins'
  } else if (player1.health < player2.health) {
    document.querySelector('#text').innerHTML = 'Player 2 Wins'
  }
}

let timer = 61
let timerId
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000)
    timer--
    document.querySelector('#timer').innerHTML = timer
  }
  if (timer === 0) {
    winner({ player1, player2, timerId })
  }
}