import React, {PropTypes as Type} from 'react'
import emitter from '../../emitter'
import config from '../../config'
import {data} from './types'

export default class CameraEditor extends React.Component {

  static propTypes = {
    textureWidth: Type.number.isRequired,
    textureHeight: Type.number.isRequired,
    data
  }

  render() {
    return (
      <div className="camera_editor">
        <input
          className="camera_editor__worldy"
          min="0"
          max={(this.props.textureWidth * this.props.data.bg.scale) - config.size.x}
          onChange={::this.handleWorldXChange}
          type="range"
          defaultValue={-this.props.data.world.pos[0]} />
        <input
          min="0"
          className="camera_editor__worldy"
          max={(config.size.y * this.props.data.bg.scale) - config.size.y}
          onChange={::this.handleWorldYChange}
          type="range"
          defaultValue={-this.props.data.world.pos[1]} />
        <input
          min="0.1"
          max="3"
          className="camera_editor__bgscale"
          onChange={::this.handleBgScaleChange}
          step="0.1"
          type="range"
          defaultValue={this.props.data.bg.scale} />
      </div>
    )
  }
  handleBgScaleChange(e) {
    const d = this.props.data
    d.bg.scale = e.target.value
    // TODO make sure cords respect scale
    emitter.emit('u_state', d)
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
