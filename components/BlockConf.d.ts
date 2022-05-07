export interface BlockConf {
  block:
    | 'BlockFor'
    | 'BlockForEnd'
    | 'BlockMoveFront'
    | 'BlockMoveBack'
    | 'BlockMoveRight'
    | 'BlockMoveLeft'
  forNum: number
}
