import * as PIXI from 'pixi.js'
import { BlockConf } from '../BlockConf'
import { Point, Size } from './RoboConYML'
import SceneInit from './sceneInit'

export default class BlockStage extends SceneInit {
  private cell!: PIXI.Graphics
  private cellSize: number = 0
  private rowNum: number = 0
  private colNum: number = 0
  private width: number
  private height: number
  private blocks: BlockConf[] = []

  private sta?: PIXI.Graphics
  private goa?: PIXI.Graphics
  private obj?: PIXI.Graphics

  private nowPos: Point = { x: 0, y: 0 }
  private startDir: number = 0
  private goalPos: Point = { x: 0, y: 0 }
  private objPos: Point[] = []
  private stageSize: Size = { x: 0, y: 0 }

  private startPos: Point = { x: 0, y: 0 }

  private blockI: number = 0
  private nowBlock?: BlockConf['block']
  private forStack: { num: number; index: number }[] = []
  private dir: number = 0

  private isEnd: boolean = false
  private isGoal: boolean = false

  constructor(width: number, height: number) {
    super()

    this.width = width
    this.height = height

    const bg = new PIXI.Graphics()
    bg.drawRect(0, 0, width, height)
    this.stage.addChild(bg)
    this.stage.sortableChildren = true
    this.stage.sortChildren()
  }

  private getPosition(pos: Point) {
    return {
      x: this.cell.x + this.cellSize * (pos.x + 0.5),
      y: this.cell.y + this.cellSize * (pos.y + 0.5),
    }
  }

  private setCell(stage: Size) {
    this.cell = new PIXI.Graphics()

    this.cellSize = 30
    this.colNum = stage.x
    this.rowNum = stage.y

    for (let i = 0; i < this.colNum + 1; i++) {
      this.cell
        .lineStyle(2, 0xffffff)
        .moveTo(i * this.cellSize, 0)
        .lineTo(i * this.cellSize, this.cellSize * this.rowNum)
    }
    for (let i = 0; i < this.rowNum + 1; i++) {
      this.cell
        .lineStyle(2, 0xffffff)
        .moveTo(0, i * this.cellSize)
        .lineTo(this.cellSize * this.colNum, i * this.cellSize)
    }

    this.stage.addChild(this.cell)
    this.resize(this.width, this.height)
  }

  private startObj(start: Point, dir: number) {
    this.sta = new PIXI.Graphics()

    const staWidth = this.cellSize - 5
    const staHeight = (staWidth / 2) * Math.sqrt(3)

    this.sta.beginFill(0xff0000, 1)
    this.sta.lineTo(0, 0)
    this.sta.lineTo(staWidth / 2, staHeight)
    this.sta.lineTo(-staWidth / 2, staHeight)
    this.sta.endFill()

    this.sta.pivot.y = staHeight / 2

    this.sta.x = this.getPosition(start).x
    this.sta.y = this.getPosition(start).y
    this.sta.rotation = (Math.PI / 2) * dir
    this.stage.addChild(this.sta)
  }

  private goalObj(goal: Point) {
    const wh = this.cellSize - 20
    this.goa = new PIXI.Graphics()
      .beginFill(0x0000ff, 1)
      .drawRect(0, 0, wh, wh)
      .endFill()
    this.goa.pivot.x = wh / 2
    this.goa.pivot.y = wh / 2
    this.goa.x = this.getPosition(goal).x
    this.goa.y = this.getPosition(goal).y
    this.stage.addChild(this.goa)
  }

  private objObj(obj: Point[]) {
    for (const o of obj) {
      const wh = this.cellSize - 5
      this.obj = new PIXI.Graphics()
        .beginFill(0x00ff00, 1)
        .drawRect(0, 0, wh, wh)
        .endFill()
      this.obj.pivot.x = wh / 2
      this.obj.pivot.y = wh / 2
      this.obj.x = this.getPosition(o).x
      this.obj.y = this.getPosition(o).y
      this.stage.addChild(this.obj)
    }
  }

  public setConf(
    stage: Size,
    start: Point,
    dir: number,
    goal: Point,
    obj: Point[],
  ) {
    this.startPos = { x: start.x, y: start.y }
    this.startDir = dir
    this.goalPos = { x: goal.x, y: goal.y }
    for (const o of obj) {
      this.objPos.push({ x: o.x, y: o.y })
    }
    this.stageSize = stage

    this.setCell(stage)
    this.startObj(start, dir)
    this.goalObj(goal)
    this.objObj(obj)
  }

  private nextBlock() {
    if (this.blockI === this.blocks.length) {
      this.nowBlock = undefined
      return false
    }
    this.nowBlock = this.blocks[this.blockI].block

    if (this.nowBlock === 'BlockForEnd') {
      this.forStack[this.forStack.length - 1].num--
      if (this.forStack[this.forStack.length - 1].num === 0) {
        this.forStack.pop()
        this.blockI++
        this.nowBlock = this.blocks[this.blockI].block
        this.blockI++
      } else {
        this.blockI = this.forStack[this.forStack.length - 1].index + 1
        this.nowBlock = this.blocks[this.blockI].block
        this.blockI++
      }
    } else if (this.nowBlock === 'BlockFor') {
      this.forStack.push({
        num: this.blocks[this.blockI].forNum,
        index: this.blockI,
      })
      this.blockI++
      this.nowBlock = this.blocks[this.blockI].block
      this.blockI++
    } else {
      this.blockI++
    }

    return true
  }

  private move() {
    if (this.nowBlock === 'BlockMoveFront') {
      if (this.dir === 0) this.go(0)
      if (this.dir === 1) this.go(1)
      if (this.dir === 2) this.go(2)
      if (this.dir === 3) this.go(3)
    }
    if (this.nowBlock === 'BlockMoveBack') {
      if (this.dir === 0) this.go(2)
      if (this.dir === 1) this.go(3)
      if (this.dir === 2) this.go(0)
      if (this.dir === 3) this.go(1)
    }
    if (this.nowBlock === 'BlockMoveRight') {
      this.dir = this.modu(this.dir + 1, 4)
    }
    if (this.nowBlock === 'BlockMoveLeft') {
      this.dir = this.modu(this.dir - 1, 4)
    }
  }

  private modu(a: number, b: number) {
    return ((a % b) + b) % b
  }

  private go(dir: number) {
    if (dir === 0) {
      while (true) {
        this.nowPos.y--
        if (this.nowPos.y <= 0) {
          this.nowPos.y = 0
          break
        }

        let collisionFlag = false
        for (const o of this.objPos) {
          if (this.nowPos.x === o.x && this.nowPos.y - 1 === o.y) {
            collisionFlag = true
            break
          }
        }
        if (collisionFlag) break
      }
    }
    if (dir === 1) {
      while (true) {
        this.nowPos.x++
        if (this.nowPos.x >= this.stageSize.x - 1) {
          this.nowPos.x = this.stageSize.x - 1
          break
        }

        let collisionFlag = false
        for (const o of this.objPos) {
          if (this.nowPos.x + 1 === o.x && this.nowPos.y === o.y) {
            collisionFlag = true
            break
          }
        }
        if (collisionFlag) break
      }
    }
    if (dir === 2) {
      while (true) {
        this.nowPos.y++
        if (this.nowPos.y >= this.stageSize.y - 1) {
          this.nowPos.y = this.stageSize.y - 1
          break
        }

        let collisionFlag = false
        for (const o of this.objPos) {
          if (this.nowPos.x === o.x && this.nowPos.y + 1 === o.y) {
            collisionFlag = true
            break
          }
        }
        if (collisionFlag) break
      }
    }
    if (dir === 3) {
      while (true) {
        this.nowPos.x--
        if (this.nowPos.x <= 0) {
          this.nowPos.x = 0
          break
        }

        let collisionFlag = false
        for (const o of this.objPos) {
          if (this.nowPos.x - 1 === o.x && this.nowPos.y === o.y) {
            collisionFlag = true
            break
          }
        }
        if (collisionFlag) break
      }
    }
  }

  public checkGoal() {
    return this.isGoal
  }

  public checkEnd() {
    return this.isEnd || this.isGoal
  }

  public setBlocks(blocks: BlockConf[]) {
    this.blocks = blocks
    this.reset()
  }

  public resize(width: number, height: number) {
    this.cell.position.x = width / 2 - (this.cellSize * this.colNum) / 2
    this.cell.position.y = height / 2 - (this.cellSize * this.rowNum) / 2
  }

  public reset() {
    this.blockI = 0
    this.nowBlock = undefined
    this.forStack = []
    this.isGoal = false
    this.isEnd = false

    this.sta!.x = this.getPosition(this.startPos).x
    this.sta!.y = this.getPosition(this.startPos).y
    this.dir = this.startDir
    this.sta!.rotation = (Math.PI / 2) * this.startDir
    this.nowPos = { x: this.startPos.x, y: this.startPos.y }
  }

  public animation(time: number) {
    if (!this.isEnd) {
      if (time % (60 * (1 / 4)) === 0) {
        if (this.nextBlock()) {
          this.move()
          this.sta!.x = this.getPosition(this.nowPos).x
          this.sta!.y = this.getPosition(this.nowPos).y
          this.sta!.rotation = (Math.PI / 2) * this.dir
          this.isGoal =
            this.nowPos.x === this.goalPos.x && this.nowPos.y === this.goalPos.y
        } else {
          window.alert('ゴールできなかった')
          this.isEnd = true
        }
      }
    }
  }
}
