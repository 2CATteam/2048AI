let state = []
let nodes = []
let board = null

let bgColors = {
    2: "#FF0000",
    4: "#C04000",
    8: "#808000",
    16: "#40C000",
    32: "#00F000",
    64: "#00C040",
    128: "#008080",
    256: "#0040C0",
    512: "#0000FF",
    1024: "#4000C0",
    2048: "#800080"
}

for (let i = 0; i < 4; i++) {
    state.push([])
    for (let j = 0; j < 4; j++) {
        state[i].push(null)
    }
}

function spawnBlock() {
    let choices = []
    for (let i in state) {
        for (let j in state[i]) {
            if (state[i][j] == null) {
                choices.push([i, j])
            }
        }
    }
    if (choices.length == 0) {
        console.error("You just lost!")
        return
    }
    let choice = choices[Math.floor(Math.random() * choices.length)]
    state[choice[0]][choice[1]] = generateBlock(Math.random() > .05 ? 2 : 4, choice[0], choice[1], true)
    nodes.push(state[choice[0]][choice[1]])
}

function generateBlock(value, y, x, real) {
    let toReturn = {
        value: value,
        node: document.createElement("div"),
        x: x * 100,
        y: y * 100,
        wantedX: x * 100,
        wantedY: y * 100
    }
    toReturn.node.classList.add("block")
    toReturn.node.style.left = x * 100 + "px"
    toReturn.node.style.top = y * 100 + "px"
    toReturn.node.style.backgroundColor = bgColors[value]
    toReturn.node.innerHTML = value
    if (real) {
        board.appendChild(toReturn.node)
    }
    return toReturn
}

function finishMovement() {
    for (let i in state) {
        for (let j in state[i]) {
            if (!state[i][j]) continue
            state[i][j].x = state[i][j].wantedX
            state[i][j].y = state[i][j].wantedY
            state[i][j].node.style.left = state[i][j].x + "px"
            state[i][j].node.style.top = state[i][j].y + "px"
        }
    }
}

function moveRight(state, real) {
    finishMovement()
    let toReturn = -1
    for (let i = 0; i < 4; i++) {
        for (let j = 2; j >= 0; j--) {
            if (state[i][j] == null) continue
            for (let k = j + 1; k < 4; k++) {
                if (state[i][k] == null) {
                    state[i][k] = state[i][j]
                    state[i][j] = null
                    j++
                    if (real) {
                        state[i][k].wantedX += 100
                    }
                    if (toReturn < 0) {
                        toReturn = 0
                    }
                } else if (state[i][k].value == state[i][j].value) {
                    if (real) {
                        removeNode(state[i][k])
                        state[i][j].wantedX += 100
                        state[i][j].node.style.zIndex = "-1"
                        state[i][j].callback = removeNode.bind(null, state[i][j])
                    }
                    if (toReturn < 0) {
                        toReturn = 0
                    }
                    toReturn += Math.sqrt(state[i][j].value) * 5
                    state[i][k] = generateBlock(2 * state[i][j].value, i, k, real)
                    state[i][j] = null
                    if (real) {
                        nodes.push(state[i][k])
                    }
                    j++
                } else {
                    break
                }
            }
        }
    }
    if (real) {
        setTimeout(spawnBlock, 400)
    }
    return toReturn
}

function moveLeft(state, real) {
    finishMovement()
    let toReturn = -1
    for (let i = 0; i < 4; i++) {
        for (let j = 1; j < 4; j++) {
            if (state[i][j] == null) continue
            for (let k = j - 1; k >= 0; k--) {
                if (state[i][k] == null) {
                    state[i][k] = state[i][j]
                    state[i][j] = null
                    j--
                    if (real) {
                        state[i][k].wantedX -= 100
                    }
                    if (toReturn < 0) {
                        toReturn = 0
                    }
                } else if (state[i][k].value == state[i][j].value) {
                    if (real) {
                        removeNode(state[i][k])
                        state[i][j].wantedX -= 100
                        state[i][j].node.style.zIndex = "-1"
                        state[i][j].callback = removeNode.bind(null, state[i][j])
                    }
                    if (toReturn < 0) {
                        toReturn = 0
                    }
                    toReturn += Math.sqrt(state[i][j].value) * 5
                    state[i][k] = generateBlock(2 * state[i][j].value, i, k, real)
                    state[i][j] = null
                    if (real) {
                        nodes.push(state[i][k])
                    }
                    j--
                } else {
                    break
                }
            }
        }
    }
    if (real) {
        setTimeout(spawnBlock, 400)
    }
    return toReturn
}

function moveDown(state, real) {
    finishMovement()
    let toReturn = -1
    for (let j = 0; j < 4; j++) {
        for (let i = 2; i >= 0; i--) {
            if (state[i][j] == null) continue
            for (let k = i + 1; k < 4; k++) {
                if (state[k][j] == null) {
                    state[k][j] = state[i][j]
                    state[i][j] = null
                    i++
                    if (real) {
                        state[k][j].wantedY += 100
                    }
                    if (toReturn < 0) {
                        toReturn = 0
                    }
                } else if (state[k][j].value == state[i][j].value) {
                    if (real) {
                        removeNode(state[k][j])
                        state[i][j].wantedY += 100
                        state[i][j].node.style.zIndex = "-1"
                        state[i][j].callback = removeNode.bind(null, state[i][j])
                    }
                    if (toReturn < 0) {
                        toReturn = 0
                    }
                    toReturn += Math.sqrt(state[i][j].value)  * 5
                    state[k][j] = generateBlock(2 * state[i][j].value, k, j, real)
                    state[i][j] = null
                    if (real) {
                        nodes.push(state[k][j])
                    }
                    i++
                } else {
                    break
                }
            }
        }
    }
    if (real) {
        setTimeout(spawnBlock, 400000 / speed)
    }
    return toReturn
}

function moveUp(state, real) {
    finishMovement()
    let toReturn = -1
    for (let j = 0; j < 4; j++) {
        for (let i = 1; i < 4; i++) {
            if (state[i][j] == null) continue
            for (let k = i - 1; k >= 0; k--) {
                if (state[k][j] == null) {
                    state[k][j] = state[i][j]
                    state[i][j] = null
                    i--
                    if (real) {
                        state[k][j].wantedY -= 100
                    }
                    if (toReturn < 0) {
                        toReturn = 0
                    }
                } else if (state[k][j].value == state[i][j].value) {
                    if (real) {
                        removeNode(state[k][j])
                        state[i][j].wantedY -= 100
                        state[i][j].node.style.zIndex = "-1"
                        state[i][j].callback = removeNode.bind(null, state[i][j])
                    }
                    if (toReturn < 0) {
                        toReturn = 0
                    }
                    toReturn += Math.sqrt(state[i][j].value) * 5
                    state[k][j] = generateBlock(2 * state[i][j].value, k, j, real)
                    state[i][j] = null
                    if (real) {
                        nodes.push(state[k][j])
                    }
                    i--
                } else {
                    break
                }
            }
        }
    }
    if (real) {
        setTimeout(spawnBlock, 400)
    }
    return toReturn
}

function removeNode(node) {
    let removed = nodes.splice(nodes.indexOf(node), 1)
    removed[0].node.remove()
}

let speed = 4000 //Speed to try to target, in pixels per second
let lastDrew = null
function animate(time) {
    if (!lastDrew) lastDrew = time
    for (let i = 0; i < nodes.length; i++) {
        if (!nodes[i]) continue
        if (nodes[i].wantedX - nodes[i].x > 0) {
            nodes[i].x += Math.min(speed * (time - lastDrew) / 1000, Math.abs(nodes[i].wantedX - nodes[i].x))
        } else if (nodes[i].wantedX - nodes[i].x < 0) {
            nodes[i].x -= Math.min(speed * (time - lastDrew) / 1000, Math.abs(nodes[i].wantedX - nodes[i].x))
        } else if (nodes[i].wantedY - nodes[i].y > 0) {
            nodes[i].y += Math.min(speed * (time - lastDrew) / 1000, Math.abs(nodes[i].wantedY - nodes[i].y))
        } else if (nodes[i].wantedY - nodes[i].y < 0) {
            nodes[i].y -= Math.min(speed * (time - lastDrew) / 1000, Math.abs(nodes[i].wantedY - nodes[i].y))
        } else if (nodes[i].callback) {
            nodes[i].callback()
            i--
            continue
        }
        nodes[i].node.style.left = nodes[i].x + "px"
        nodes[i].node.style.top = nodes[i].y + "px"
    }
    lastDrew = time
    requestAnimationFrame(animate)
}

function onLoad() {
    board = document.querySelector("#game")
    requestAnimationFrame(animate)
    spawnBlock()
    document.addEventListener('keydown', (e) => {
        switch(e.code) {
            case ("ArrowDown"):
                moveDown(state, true)
                break
            case ("ArrowRight"):
                moveRight(state, true)
                break
            case ("ArrowLeft"):
                moveLeft(state, true)
                break
            case ("ArrowUp"):
                moveUp(state, true)
                break
        }
    })
}

let aiInterval = setInterval(AI, 500000 / speed)

function AI() {
    let hypotheticals = {
        up: [],
        right: [],
        left: [],
        down: []
    }
    let scores = {
        up: 0,
        right: 0,
        left: 0,
        down: 0
    }
    //Deep copying
    for (let h in hypotheticals) {
        for (let i in state) {
            hypotheticals[h].push([])
            for (let j in state[i]) {
                hypotheticals[h][i].push(null)
                if (state[i][j]) {
                    hypotheticals[h][i][j] = {}
                    for (let k in state[i][j]) {
                        if (k != "node") {
                            hypotheticals[h][i][j][k] = state[i][j][k]
                        }
                    }
                }
            }
        }
    }
    scores.up = moveUp(hypotheticals.up, false) * 2
    scores.right = moveRight(hypotheticals.right, false) * 2
    scores.left = moveLeft(hypotheticals.left, false) * 2
    scores.down = moveDown(hypotheticals.down, false) * 2
    for (let i in hypotheticals) {
        if (scores[i] < 0) {
            continue
        }
        scores[i] += judgeBoard(hypotheticals[i])
    }
    let scoresArray = []
    for (let i in scores) {
        scoresArray.push(scores[i])
    }
    if (Math.max(...scoresArray) <= -1) {
        alert("You lost!")
        clearInterval(aiInterval)
    }
    switch (Math.max(...scoresArray)) {
        case scores.right:
            moveRight(state, true)
            break
        case scores.down:
            moveDown(state, true)
            break
        case scores.left:
            moveLeft(state, true)
            break
        case scores.up:
            moveUp(state, true)
            break
    }
}

function judgeBoard(state) {
    let toReturn = 0
    for (let i in state) {
        for (let j in state[i]) {
            for (let k of neighbors(state, parseInt(i), parseInt(j))) {
                if (!state[i][j] && !k) {
                    continue 
                } else if (!state[i][j] && k?.value > 8) {
                    toReturn -= 0.01
                } else if (state[i][j]?.value > 8 && !k) {
                    toReturn -= 0.01
                } else if (!state[i][j] || !k) {
                    continue
                } else if (state[i][j].value == k.value) {
                    toReturn += 3//Math.sqrt(k.value)
                }// else if (state[i][j].value == k.value * 2 || state[i][j].value == k.value / 2) {
                //    toReturn += 1 //* Math.sqrt(Math.min(k.value, state[i][j].value))
                //}
            }
        }
    }
    return toReturn
}

function* neighbors(state, i , j) {
    if (i > 0) { yield state[i - 1][j] }
    if (i < 3) { yield state[i + 1][j] }
    if (j > 0) { yield state[i][j - 1] }
    if (j < 3) { yield state[i][j + 1] }
}