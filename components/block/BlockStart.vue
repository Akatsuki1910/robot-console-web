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
  width: 100px;
  height: 50px;
  border-color: green;
  border-style: solid;
  border-width: 1px;
}
</style>
