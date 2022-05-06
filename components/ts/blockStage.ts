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
      x: this.cell.x + this.cellSize * (pos.x - 1 + 0.5),
      y: this.cell.y + this.cellSize * (pos.y - 1 + 0.5),
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
    const sta = new PIXI.Graphics()

    const staWidth = this.cellSize - 5
    const staHeight = (staWidth / 2) * Math.sqrt(3)

    sta.beginFill(0xff0000, 1)
    sta.lineTo(0, 0)
    sta.lineTo(staWidth / 2, staHeight)
    sta.lineTo(-staWidth / 2, staHeight)
    sta.endFill()

    sta.pivot.y = staHeight / 2

    sta.x = this.getPosition(start).x
    sta.y = this.getPosition(start).y
    sta.rotation = (Math.PI / 2) * dir
    this.stage.addChild(sta)
  }

  private goalObj(goal: Point) {
    const wh = this.cellSize - 5
    const goa = new PIXI.Graphics()
      .beginFill(0x0000ff, 1)
      .drawRect(0, 0, wh, wh)
      .endFill()
    goa.pivot.x = wh / 2
    goa.pivot.y = wh / 2
    goa.x = this.getPosition(goal).x
    goa.y = this.getPosition(goal).y
    this.stage.addChild(goa)
  }

  private objObj(obj: Point[]) {
    for (const o of obj) {
      const wh = this.cellSize - 5
      const goa = new PIXI.Graphics()
        .beginFill(0x00ff00, 1)
        .drawRect(0, 0, wh, wh)
        .endFill()
      goa.pivot.x = wh / 2
      goa.pivot.y = wh / 2
      goa.x = this.getPosition(o).x
      goa.y = this.getPosition(o).y
      this.stage.addChild(goa)
    }
  }

  public setConf(
    stage: Size,
    start: Point,
    dir: number,
    goal: Point,
    obj: Point[],
  ) {
    this.setCell(stage)
    this.startObj(start, dir)
    this.goalObj(goal)
    this.objObj(obj)
  }

  public setBlocks(blocks: BlockConf[]) {
    this.blocks = blocks
  }

  public resize(width: number, height: number) {
    this.cell.position.x = width / 2 - (this.cellSize * this.colNum) / 2
    this.cell.position.y = height / 2 - (this.cellSize * this.rowNum) / 2
  }

  public animation(_time: number) {}
}
