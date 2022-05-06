/* eslint-disable import/no-mutable-exports */
import { Store } from 'vuex'
import { getModule } from 'vuex-module-decorators'
import Blocks from '~/store/blocks'

let BlocksStore: Blocks
function initialiseStores(store: Store<any>): void {
  BlocksStore = getModule(Blocks, store)
}

export { initialiseStores, BlocksStore }
