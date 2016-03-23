import T from './types'
import React, {PropTypes as Type} from 'react'
import emitter from '../../emitter'

export default class WorldEditor extends React.Component {

  static propTypes = {
    data: T.data.isRequired
  }

  render() {
    return (
      <div className="world_editor">
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
    emitter.emit('u_state', d)
  }
}
