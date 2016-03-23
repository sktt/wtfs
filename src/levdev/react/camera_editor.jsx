import T from './types'
import React, {PropTypes as Type} from 'react'
import emitter from '../../emitter'
import config from '../../config'

export default class CameraEditor extends React.Component {

  static propTypes = {
    textureWidth: Type.number.isRequired,
    textureHeight: Type.number.isRequired,
    data: T.data.isRequired
  }

  render() {
    const {world, bg} = this.props.data
    return (
      <div className="camera_editor">
        <input
          className="camera_editor__worldy"
          min="0"
          max={(this.props.textureWidth * bg.scale) - config.size.x}
          onChange={::this.handleWorldXChange}
          type="range"
          defaultValue={-world.pos[0]} />
        <input
          min="0"
          className="camera_editor__worldy"
          max={(config.size.y * bg.scale) - config.size.y}
          onChange={::this.handleWorldYChange}
          type="range"
          defaultValue={-world.pos[1]} />
      </div>
    )
  }
  handleWorldXChange(e) {
    const d = this.props.data
    d.world.pos[0] = -e.target.value
    emitter.emit('u_state', d)
  }
  handleWorldYChange(e) {
    const d = this.props.data
    d.world.pos[1] = -e.target.value
    emitter.emit('u_state', d)
  }
}
