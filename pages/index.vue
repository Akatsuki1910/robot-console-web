<template lang="pug">
  span.wrap
    Blocks.block
    div.game
      Game
    div.other
      a(href="https://twitter.com/teruru33550336" target="_blank" aria-label="twitter")
        IconTwitter.icon
</template>

<script lang="ts">
import { Vue, Component } from 'nuxt-property-decorator'
@Component({})
export default class Index extends Vue {}
</script>

<style lang="scss" scoped>
.wrap {
  display: grid;
  grid-template-rows: 70% 1fr;
  grid-template-columns: 50% 1fr;
  grid-template-areas:
    'block game'
    'block other';
  width: 100%;
  height: 100vh;
  grid-column-gap: 8px;
  @include screen {
    height: auto;
    display: flex;
    flex-direction: column-reverse;
  }
}
.block {
  grid-area: block;
  width: 100%;
  height: 100%;
}

.game {
  grid-area: game;
  width: 100%;
  height: 100%;
  // min-height: 400px;
}

.other {
  grid-area: other;
  width: 100%;
  height: 100%;
}

.icon {
  font-size: 3rem;
  transition: all 0.3s;
  margin: 5px;
  color: blue;
  &:hover {
    transform: scale(1.2);
  }
}
</style>
