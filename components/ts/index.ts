import * as PIXI from 'pixi.js'
import { BlockConf } from '../BlockConf'
import BlockStage from './blockStage'
import { Point, Size } from './RoboConYML'

export default class RobotConsole {
  private time: number = 0
  private stageMaster: PIXI.Container
  private bs: BlockStage
  private renderer: PIXI.AbstractRenderer

  constructor(ele: HTMLCanvasElement) {
    const width = ele.clientWidth
    const height = ele.clientHeight

    this.stageMaster = new PIXI.Container()
    this.renderer = PIXI.autoDetectRenderer({
      width,
      height,
      resolution: window.devicePixelRatio || 1,
      antialias: true,
      view: ele,
    })

    this.bs = new BlockStage(this.renderer.width, this.renderer.height)
    this.stageMaster?.addChild(this.bs.stage)

    window.onresize = () => {
      this.renderer.resize(ele.clientWidth, ele.clientHeight)
      this.bs.resize(this.renderer.width, this.renderer.height)
      this.render()
    }
  }

  public setConf(
    stage: Size,
    start: Point,
    dir: number,
    goal: Point,
    obj: Point[],
  ) {
    this.bs.setConf(stage, start, dir, goal, obj)
  }

  public render() {
    this.renderer.render(this.stageMaster)
  }

  public start(blocks: BlockConf[]) {
    this.bs.setBlocks(blocks)
    this.time = 0
    this.animation()
  }

  private animation() {
    this.bs.animation(this.time)
    this.time++
    requestAnimationFrame(this.animation.bind(this))
  }
}
