<template lang="pug">
  div.border(:style="[msStyle,nnStyle]") for
    input(type="number" value=0 v-model="forNum").number-input
</template>

<script lang="ts">
import { Vue, Component, PropSync, Watch, Emit } from 'nuxt-property-decorator'
@Component({})
export default class BlockFor extends Vue {
  @PropSync('marginSize', { type: Number, required: true })
  ms?: number

  @PropSync('nestNum', { type: Number, required: true })
  nn?: number

  forNum = 0

  @Watch('forNum')
  updateForNum() {
    this.changeForNum()
  }

  @Emit()
  changeForNum() {}

  get msStyle() {
    return { '--ml': this.ms }
  }

  get nnStyle() {
    return { '--ns': 52 * this.nn! + 2 }
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

  &::after {
    position: absolute;
    bottom: calc(-1px * var(--ns));
    left: 0;
    width: 10px;
    height: calc(1px * var(--ns));
    content: '';
    background: blue;
  }
}

.number-input {
  width: 5rem;
}
</style>
