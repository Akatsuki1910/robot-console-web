<template lang="pug">
  div.game-wrap
    canvas(ref="block").block-canvas
    div
      input(type="button" @click="start" value="start")
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'nuxt-property-decorator'
import RobotConsole from './ts/index'
import { BlocksStore } from '~/store'
@Component({})
export default class Game extends Vue {
  @Ref() readonly block!: HTMLCanvasElement
  d: RobotConsole | null = null

  mounted() {
    this.d = new RobotConsole(this.block)
    this.d.setConf({ x: 9, y: 9 }, { x: 5, y: 5 }, 0, { x: 7, y: 8 }, [
      { x: 2, y: 4 },
      { x: 3, y: 1 },
      { x: 7, y: 9 },
      { x: 8, y: 3 },
    ])
    this.d.render()
  }

  start() {
    this.d?.start(BlocksStore.getBlocks)
  }
}
</script>

<style lang="scss" scoped>
.game-wrap {
  height: 100%;
  width: 100%;
}
.block-canvas {
  width: 100%;
  max-width: 50vw;
  height: 90%;
  min-height: 400px;
  @include screen {
    max-width: 100vmin;
    height: 100vmin;
    max-height: 400px;
  }
}
</style>
