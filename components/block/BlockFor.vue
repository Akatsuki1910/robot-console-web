<template lang="pug">
  div.border(:style="[msStyle,nnStyle]") for
    input(type="number" value=1 min=1 v-model="forNum").number-input
</template>

<script lang="ts">
import { Vue, Component, PropSync, Watch, Emit } from 'nuxt-property-decorator'
@Component({})
export default class BlockFor extends Vue {
  @PropSync('marginSize', { type: Number, required: true })
  ms?: number

  @PropSync('nestNum', { type: Number, required: true })
  nn?: number

  forNum = 1

  @Watch('forNum')
  updateForNum() {
    this.changeForNum()
  }

  @Emit()
  changeForNum() {}

  get msStyle() {
    return { 'margin-left': `${this.ms}px` }
  }

  get nnStyle() {
    return { '--ns': 52 * this.nn! + 2 }
  }
}
</script>

<style lang="scss" scoped>
.border {
  @include block-style;
  @include for-block-color;

  position: relative;

  &::after {
    position: absolute;
    bottom: calc(-1px * var(--ns));
    left: -1px;
    width: 10px;
    height: calc(1px * var(--ns));
    content: '';
    background: blue;
  }
}

.number-input {
  margin-left: 1rem;
  width: 5rem;
}
</style>
