import { Point, Size } from './RoboConYML'

const M = Math

let board: number[][]
let allowMem: Point[][]
let stageSize: Size
let isGoal = false

export default function createConf() {
  let wh: number
  let stage: Size
  let start: Point
  let goal: Point
  let objArr: Point[] = []

  while (true) {
    objArr = []

    wh = random(10, 15)
    stage = { x: wh, y: wh }
    wh -= 1
    start = { x: random(0, wh), y: random(0, wh) }
    goal = { x: random(0, wh), y: random(0, wh) }
    if (start.x === goal.x && start.y === goal.y) continue

    for (let i = 0; i < random(wh, wh * wh); i++) {
      const obj = { x: random(0, wh), y: random(0, wh) }
      if (obj.x === goal.x && obj.y === goal.y) {
        i--
        continue
      }
      if (start.x === obj.x && start.y === obj.y) {
        i--
        continue
      }

      for (const o of objArr) {
        if (o.x === obj.x && o.y === obj.y) {
          i--
          continue
        }
      }

      objArr.push(obj)
    }

    roboConResolve(stage, start, goal, objArr)
    if (isGoal) break
  }

  const dir = random(0, 3)
  return { stage, start, dir, goal, objArr }
}

function random(min: number, max: number) {
  return M.floor(M.random() * (max + 1 - min)) + min
}

function roboConResolve(stage: Size, start: Point, goal: Point, obj: Point[]) {
  stageSize = { x: stage.x, y: stage.y }
  board = [...Array(stageSize.x)].map((_) => Array(stageSize.y).fill(0))
  allowMem = []

  for (const o of obj) {
    board[o.x][o.y] = 9
  }

  board[start.x][start.y] = 1
  board[goal.x][goal.y] = 2

  allowMem[0] = []
  allowMem[0][0] = { x: start.x, y: start.y } as Point

  isGoal = false
  searchGoal(0)
}

function searchGoal(p: number) {
  const { x, y } = allowMem[p][allowMem[p].length - 1]

  for (let i = 0; i < 4; i++) {
    let rx = x
    let ry = y
    let mrx = x
    let mry = y
    while (true) {
      ;[rx, ry] = moveAllow(i, rx, ry)

      if (rx === -1) {
        rx = 0
        break
      }
      if (ry === -1) {
        ry = 0
        break
      }
      if (rx === stageSize.x) {
        rx = stageSize.x - 1
        break
      }
      if (ry === stageSize.y) {
        ry = stageSize.y - 1
        break
      }
      if (board[rx][ry] === 2) {
        isGoal = true
        break
      }
      if (board[rx][ry] === 9) {
        rx = mrx
        ry = mry
        break
      }
      mrx = rx
      mry = ry
    }

    if (rx === x && ry === y) {
      continue
    }

    if (allowMem[p].some((e) => e.x === rx && e.y === ry)) {
      continue
    }

    const t = allowMem.length
    allowMem[t] = [...allowMem[p]]
    allowMem[t].push({ x: rx, y: ry } as Point)
    if (!isGoal) {
      searchGoal(t)
    }
  }

  allowMem[p] = []
}

// dir
//  0
// 3   1
//  2
function moveAllow(dir: number, x: number, y: number) {
  if (dir === 0) y--
  if (dir === 1) x--
  if (dir === 2) y++
  if (dir === 3) x++
  return [x, y]
}
