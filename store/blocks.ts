import { Module, VuexModule, Mutation } from 'vuex-module-decorators'
import { BlockConf } from '~/components/BlockConf'

@Module({
  name: 'blocks',
  stateFactory: true,
  namespaced: true,
})
export default class BlockModule extends VuexModule {
  private blocksArr: BlockConf[] = []

  @Mutation
  setBlockEle(blocksEle: BlockConf[]) {
    this.blocksArr = blocksEle
  }

  get getBlocks() {
    return this.blocksArr
  }
}
