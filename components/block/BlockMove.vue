<template lang="pug">
  div.border(:style="msStyle") move
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'
@Component({})
export default class BlockMove extends Vue {
  @PropSync('marginSize', { type: Number, required: true })
  ms?: number

  get msStyle() {
    return `margin-left: ${this.ms}px`
  }
}
</script>

<style lang="scss" scoped>
.border {
  width: 100px;
  height: 50px;
  border-color: red;
  border-style: solid;
  border-width: 1px;
}
</style>
