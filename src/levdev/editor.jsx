import T from './react/types'

import config from '../config'
import React from 'react'
import CameraEditor from './react/camera_editor'
import PathEditor from './react/path_editor'
import WorldEditor from './react/world_editor'

import Actions from './actions'

const capitalize = (str) => String.fromCharCode(str.charCodeAt(0) - 32) + str.slice(1)

export default class Editor extends React.Component {
  static propTypes = {
    data: T.data.isRequired,
    scene: React.PropTypes.object.isRequired
  }
  static SCALE = 0.3

  constructor() {
    super()
    this.state = {
      currEditor: 'walkable',
    }
  }

  editors = {
    camera: _ => <CameraEditor
      textureWidth={this.props.scene.background.texture.width}
      textureHeight={this.props.scene.background.texture.height}
      data={this.props.data}
    />,
    walkable: _ => <PathEditor
      textureHeight={this.props.scene.background.texture.height}
      textureWidth={this.props.scene.background.texture.width}
      editorScale={Editor.SCALE}
      data={this.props.data}
    />,
    world: _ => <WorldEditor
      data={this.props.data}
    />
  }

  componentWillMount() {
    // no state -> reset
    if(__DEV__ && Editor.propTypes.data(this.props, 'data', 'Editor', 'prop', 'data') instanceof Error)  {
      Actions.reset()
      Actions.save()
    }
  }

  render() {
    const bgScale = this.props.data.bg.scale
    const bgURL = this.props.data.assets[this.props.data.bg.asset]

    const currentEditor = (_ => {
      const h = this.editors[this.state.currEditor]
      return h ? h() : ''
    })()
    return (
      <div className="editor">
        <div className="editor__stage" style={{
          position: 'relative'
        }}>
          <img style={{
            height: this.props.scene.background.texture.height * Editor.SCALE * bgScale,
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
            zoom: Editor.SCALE
          }} />
          {currentEditor}
        </div>
        <select value={this.state.currEditor} onChange={::this.handleEditorChange}>
          {Object.keys(this.editors).map(
            val => <option key={val} value={val}>{capitalize(val)}</option>
          )}
        </select>
        <button onClick={::this.handleClickSave}>Save</button>
      </div>
    )
  }

  handleEditorChange(e) {
    this.setState({
      currEditor: e.target.value
    })
  }

  handleClickSave(e) {
    const d = this.props.data
    // probably redundant update here
    Actions.updateState(d)
    Actions.save()
  }
}
