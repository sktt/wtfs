import config from '../config'
import React from 'react'
import emitter from '../emitter'
import CameraEditor from './react/camera_editor'
import PathEditor from './react/path_editor'

import {data} from './react/types'

export default class Editor extends React.Component {
  static propTypes = {
    data,
    scene: React.PropTypes.object.isRequired
  }
  constructor() {
    super()
    this.state = {
      editFeature: 'camera'
    }
  }

  render() {
    const editorScale = 0.3
    const bgScale = this.props.data.bg.scale
    const bgURL = this.props.data.assets[this.props.data.bg.asset]
    const edit = {
      camera: <CameraEditor
        textureWidth={this.props.scene.background.texture.width}
        textureHeight={this.props.scene.background.texture.height}
        data={this.props.data}
      />,
      walkable: <PathEditor
        textureHeight={this.props.scene.background.texture.height}
        textureWidth={this.props.scene.background.texture.width}
        editorScale={editorScale}
        data={this.props.data}
      />
    }
    return (
      <div className="editor">
        <div className="editor__stage" style={{
          position: 'relative'
        }}>
          <img style={{
            height: this.props.scene.background.texture.height * editorScale * bgScale,
            margin: '0 auto',
            opacity: 0.7
          }} src={bgURL}/>
          <div style={{
            // In camera sight
            position: 'absolute',
            backgroundImage: `url(${bgURL})`,
            backgroundPosition: `${this.props.data.world.pos[0]}px ${this.props.data.world.pos[1]}px`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: bgScale * this.props.scene.background.texture.width,
            left: -this.props.data.world.pos[0],
            top: -this.props.data.world.pos[1],
            width: config.size.x,
            height: config.size.y,
            zoom: editorScale
          }} />
          {edit[this.state.editFeature]||null}
        </div>
        <select onChange={::this.handleEditorChange}>
          <option value="camera">Camera</option>
          <option value="walkable">Walkable</option>
        </select>
        <button onClick={::this.handleClickSave}>Save</button>
      </div>
    )
  }
  handleEditorChange(e) {
    this.setState({
      editFeature: e.target.value
    })
  }
  handleClickSave(e) {
    const d = this.props.data
    localStorage.setItem('3dsh:last_state', JSON.stringify(d))
  }
}
