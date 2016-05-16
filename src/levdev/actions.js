import emitter from '../emitter'

export default {

  // update state
  updateState(state) {
    emitter.emit('update_state', state)
  },

  // update walkable of state
  updateWalkable(walkable) {
    emitter.emit('update_state_walkable', walkable)
  },

  updateAssets(assets) {
    emitter.emit('update_state_assets', assets)
  },

  updateMainChar(mainChar) {
    emitter.emit('update_state_mainChar', mainChar)
  },

  // reset last state to default and save
  reset() {
    emitter.emit('reset_state')
  },

  // save current state
  save() {
    emitter.emit('save_state')
  },
}

