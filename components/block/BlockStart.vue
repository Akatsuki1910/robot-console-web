<template lang="pug">
  div.border start
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
@Component({})
export default class BlockStart extends Vue {}
</script>

<style lang="scss" scoped>
.border {
  @include block-style;

  border-color: hsl(113, 100%, 50%);
  background-color: green;
  color: white;
}
</style>
