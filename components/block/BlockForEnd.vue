<template lang="pug">
  div.border(:style="msStyle")  forend
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'
@Component({})
export default class BlockForEnd extends Vue {
  @PropSync('marginSize', { type: Number, required: true })
  ms?: number

  get msStyle() {
    return { 'margin-left': `${this.ms}px` }
  }
}
</script>

<style lang="scss" scoped>
.border {
  @include block-style;
  @include for-block-color;
}
</style>
