import * as PIXI from 'pixi.js'

export default abstract class SceneInit {
  public readonly stage: PIXI.Container = new PIXI.Container()
  public abstract animation(time: number): void
}
