<template lang="pug">
  div
    div.block-wrap
      BlockStart(ref='blockCom' @click.native="blockSelect(-1)")
      component(v-for="(block,i) in blocks" ref="blockCom" @change-for-num="changeForNum" @click.native="blockSelect(i)" :is="block.c" :key="i" :marginSize="block.nest" :nestNum="block.nestNum||0" :class="{highlight:sn(i)}")
      BlockEnd(ref='blockCom')
    div
      input(type="button" @click="addBlock" value="add block")
      input(type="button" @click="addFor" value="add for")
      input(type="button" @click="deleteBlock" value="delete block")
</template>

<script lang="ts">
import { Vue, Component, Ref, NextTick } from 'nuxt-property-decorator'
import BlockFor from './block/BlockFor.vue'
import { BlockConf } from './BlockConf'
import { BlocksStore } from '~/store'

@Component({})
export default class Blocks extends Vue {
  @Ref() readonly blockCom!: HTMLElement[]
  private blocksArr: { c: string; nest: number; nestNum?: number }[] = []
  private selectNum = 0

  sn(i: number) {
    return this.selectNum - 1 === i
  }

  changeForNum() {
    this.setStoreBlockCom()
  }

  setStoreBlockCom() {
    const ba: BlockConf[] = []

    for (let i = 0; i < this.blocksArr.length; i++) {
      if (!this.blocksArr[i]) continue
      const blockName = this.blocksArr[i].c
      ba.push({
        block: blockName,
        forNum:
          blockName === 'BlockFor'
            ? (this.blockCom[i] as unknown as BlockFor).forNum
            : 0,
      })
    }

    BlocksStore.setBlockEle(ba)
  }

  get blocks() {
    let nest = 0
    const nestQueue: number[] = []
    const nestNum: number[] = []
    this.blocksArr.forEach((e, i) => {
      if (e.c === 'BlockForEnd') {
        nest -= 10

        this.blocksArr[nestQueue.at(-1)!].nestNum = nestNum.at(-1)!

        nestQueue.pop()
        nestNum.pop()
      }

      nestNum.forEach((e, i) => {
        nestNum[i] = e + 1
      })

      e.nest = nest

      if (e.c === 'BlockFor') {
        nest += 10
        nestQueue.push(i)
        nestNum.push(0)
      }
    })

    return this.blocksArr
  }

  @NextTick('setStoreBlockCom')
  addBlock() {
    this.blocksArr.splice(this.selectNum, 0, {
      c: 'BlockMove',
      nest: 0,
    })
    this.selectNum++
  }

  @NextTick('setStoreBlockCom')
  addFor() {
    this.blocksArr.splice(this.selectNum, 0, {
      c: 'BlockFor',
      nest: 0,
    })
    this.selectNum++

    this.blocksArr.splice(this.selectNum, 0, {
      c: 'BlockForEnd',
      nest: 0,
    })
  }

  @NextTick('setStoreBlockCom')
  deleteBlock() {
    if (this.selectNum !== 0) {
      if (this.blocksArr[this.selectNum - 1].c === 'BlockFor') {
        for (let i = this.selectNum; i < this.blocksArr.length; i++) {
          if (this.blocksArr[i].c === 'BlockForEnd') {
            this.blocksArr.splice(i, 1)
            break
          }
        }
        this.blocksArr.splice(this.selectNum - 1, 1)
        this.selectNum--
      } else if (this.blocksArr[this.selectNum - 1].c === 'BlockForEnd') {
        this.blocksArr.splice(this.selectNum - 1, 1)
        for (let i = this.selectNum - 2; i >= 0; i--) {
          if (this.blocksArr[i].c === 'BlockFor') {
            this.blocksArr.splice(i, 1)
            break
          }
        }
        this.selectNum -= 2
      } else {
        this.blocksArr.splice(this.selectNum - 1, 1)
        this.selectNum--
      }

      if (this.selectNum === 0) {
        this.selectNum = 1
      }

      if (this.blocksArr.length === 0) {
        this.selectNum = 0
      }
    }
  }

  blockSelect(i: number) {
    this.selectNum = i + 1
  }
}
</script>

<style lang="scss" scoped>
.highlight {
  color: yellow;
}

.block-wrap {
  width: 100%;
  height: 90%;
  min-height: 500px;
  overflow-y: scroll;
  border: 1px solid black;
}
</style>
