// Game Engine Configuration
let gameState = 'start' // 'start' 'running' 'lost'
const framerate = 60
const frameRateMS = 1000 / framerate
const cloudScarcity = 200 // Big number make few cloud
const cactusScarcity = 100
const collisionPadding = 20

// Amount of Movement Each Frame (px)
const cloudMovement = 1.5
const cactiMovement = 5
const dinoBaseHeight = 170
const dinoRunSpeed = 6
const dinoJumpHeight = 80
const defaultDinoJumpSpeed = 11

let timer = 0
let dinoJumpSpeed = defaultDinoJumpSpeed

// Game Elements
const gameContainer = document.getElementById('game')
const background = document.getElementById('background')

// Scene Objects
const clouds = []
let cacti = []
const dino = {
    posX: gameContainer.offsetWidth - 120,
    posY: dinoBaseHeight,
    jumping: false,
    jumpDirection: 'up', // 'up' 'down'
    animationPhase: 'standing', // 'standing' 'right-leg' 'left-leg'
    imageUrl: './assets/dino-standing-05.svg'
}

// Updaters
// Jump Event Listener
document.addEventListener('keypress', (e) => {
    if (e.keyCode === 32) {
        switch (gameState) {
            case 'start': 
                runGame()
                break
            case 'running':
                dino.jumping = true
                break
            case 'lost': 
                runGame()
                break
        }
    }
})

const updateDinoState = () => {
    // Update Feets
    if (timer % 6 == 0) {
        switch (dino.animationPhase) {
            case 'standing':
                dino.animationPhase = 'right-leg'
                dino.imageUrl = './assets/dino-right-06.svg'
                break
            case 'right-leg':
                dino.animationPhase = 'left-leg'
                dino.imageUrl = './assets/dino-left-07.svg'
                break
            case 'left-leg':
                dino.animationPhase = 'right-leg'
                dino.imageUrl = './assets/dino-right-06.svg'
                break
        }
    }

    // Handle Jump 
    if (dino.jumping) {
        if (dino.jumpDirection === 'up') {
            dino.posY -= dinoJumpSpeed
            if(timer % 2 === 0) dinoJumpSpeed--
            if (dinoJumpSpeed <= 0) dino.jumpDirection = 'down'
        } else {
            dino.posY += dinoJumpSpeed
            if(timer % 2 === 0) dinoJumpSpeed++
            if (dino.posY > dinoBaseHeight) {
                dino.jumping = false
                dino.jumpDirection = 'up'
                dinoJumpSpeed = defaultDinoJumpSpeed
            }
        }
    }
}

const updateScene = () => {
    updateDinoState()
}

// Collision Detection
const detectCollisions = () => {
    cacti.forEach(cactus => {
        if (cactus.posX < dino.posX + collisionPadding && cactus.posX > dino.posX - collisionPadding
            && 
            cactus.posY < dino.posY + collisionPadding && cactus.posY > dino.posY - collisionPadding) {
            gameState = 'lost'
            clearInterval(window.game)
        }
    })
}

// Render Scene
const renderClouds = () => {
    // Make New Cloud (Maybe)
    if (Math.floor(Math.random() * cloudScarcity) === 1) {
        clouds.push({
            id: Math.floor(Math.random() * 100000000000),
            posX: -100,
            posY: Math.floor(Math.random() * 150)
        })
    }

    // Update Cloud Positions
    clouds.forEach(cloud => {
        if (document.getElementById(cloud.id)) {
            const cloudImage = document.getElementById(cloud.id)
            cloudImage.style.right = `${cloud.posX}px`
            cloudImage.style.top = `${cloud.posY}px`
            cloud.posX += cloudMovement
        } else {
            const cloudImage = document.createElement('img')
            cloudImage.classList.add('cloud')
            cloudImage.id = cloud.id
            cloudImage.src = './assets/cloud-04.svg'
            cloudImage.style.right = `${cloud.posX}px`
            cloudImage.style.top = `${cloud.posY}px`
            gameContainer.appendChild(cloudImage)
        }
    })
}

const renderCacti = () => {
    // Make New Cacti (Maybe)
    if (Math.floor(Math.random() * cactusScarcity) === 1) {
        cacti.push({
            id: Math.floor(Math.random() * 100000000000),
            posX: -100,
            posY: 170
        })
    }

    cacti.forEach(cactus => {
        if (document.getElementById(cactus.id)) {
            const cactusImage = document.getElementById(cactus.id)
            cactusImage.style.right = `${cactus.posX}px`
            cactusImage.style.top = `${cactus.posY}px`
            cactus.posX += cactiMovement
        } else {
            const cactusVersion = Math.ceil(Math.random() * 3)
            const cactusImage = document.createElement('img')
            cactusImage.classList.add('cacti')
            cactusImage.id = cactus.id
            cactusImage.src = `./assets/cactus-${cactusVersion}-0${cactusVersion}.svg`
            cactusImage.style.right = `${cactus.posX}px`
            cactusImage.style.top = `${cactus.posY}px`
            gameContainer.appendChild(cactusImage)
        }
    })
}

const renderDino = () => {
    if (document.getElementById('dino-image')) {
        const dinoImage = document.getElementById('dino-image')
        dinoImage.style.top = `${dino.posY}px` 
        dinoImage.src = dino.imageUrl
    } else {
        const dinoImage = document.createElement('img')
        dinoImage.classList.add('dino')
        dinoImage.id = 'dino-image'
        dinoImage.src = dino.imageUrl
        dinoImage.style.right = `${dino.posX}px`
        gameContainer.appendChild(dinoImage)
    }
}

const renderScene = () => {
    renderClouds()
    renderCacti()
    renderDino()
}

// Game Functions
const runGame = () => {
    timer = 0
    cacti = []
    Array.prototype.forEach.call(document.getElementsByClassName('cacti'), cactus => {
        cactus.style.display = 'none'
    })

    gameState = 'running'
    window.game = setInterval(() => {
        timer++
        document.getElementById('score').innerHTML = `Score: ${Math.floor(timer / 5)}`
        updateScene()
        renderScene()
        detectCollisions()
    }, frameRateMS)
} 