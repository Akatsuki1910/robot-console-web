<template lang="pug">
  div.game-wrap
    canvas(ref="block").block-canvas
    div
      input(type="button" @click="start" value="start")
</template>

<script lang="ts">
import { Vue, Component, Ref } from 'nuxt-property-decorator'
import RobotConsole from './ts/index'
import createConf from './ts/createConf'
import { BlocksStore } from '~/store'

@Component({})
export default class Game extends Vue {
  @Ref() readonly block!: HTMLCanvasElement
  d: RobotConsole | null = null

  mounted() {
    const { stage, start, dir, goal, objArr } = createConf()
    this.d = new RobotConsole(this.block)
    this.d.setConf(stage, start, dir, goal, objArr)
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
