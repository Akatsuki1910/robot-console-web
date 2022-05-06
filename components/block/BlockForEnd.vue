<template lang="pug">
  div.border(:style="[msStyle]") forend
</template>

<script lang="ts">
import { Vue, Component, PropSync } from 'nuxt-property-decorator'
@Component({})
export default class BlockForEnd extends Vue {
  @PropSync('marginSize', { type: Number, required: true })
  ms?: number

  get msStyle() {
    return { '--ml': this.ms }
  }
}
</script>

<style lang="scss" scoped>
.border {
  position: relative;
  width: 100px;
  height: 50px;
  margin-left: calc(1px * var(--ml));
  border-color: blue;
  border-style: solid;
  border-width: 1px;
}
</style>
