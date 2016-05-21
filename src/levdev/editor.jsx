import T from './react/types'

import config from '../config'
import React, {PropTypes} from 'react'
import CameraEditor from './react/camera_editor'
import PathEditor from './react/path_editor'
import WorldEditor from './react/world_editor'
import CharEditor from './react/char_editor'
import AssetEditor from './react/asset_editor'
import ScenePreview from './react/scene_preview'

import Actions from './actions'

const capitalize = (str) => String.fromCharCode(str.charCodeAt(0) - 32) + str.slice(1)

export default class Editor extends React.Component {
  static propTypes = {
    data: T.data.isRequired,
    resources: PropTypes.object
  }
  static SCALE = 0.3

  constructor() {
    super()
    this.state = {
      currEditor: 'walkable',
    }
  }

  editors = {
    camera: _ => (
      <div>
        <ScenePreview
          editorScale={Editor.SCALE}
          size={config.size}
          data={this.props.data}
          resources={this.props.resources}
        />
        <CameraEditor
          textureWidth={this.props.resources[this.props.data.bg.asset].texture.width}
          textureHeight={this.props.resources[this.props.data.bg.asset].texture.height}
          data={this.props.data}
        />
      </div>
    ),
    walkable: _ => (
      <div>
        <ScenePreview
          editorScale={Editor.SCALE}
          size={config.size}
          data={this.props.data}
          resources={this.props.resources}
        />
        <PathEditor
          textureWidth={this.props.resources[this.props.data.bg.asset].texture.width}
          textureHeight={this.props.resources[this.props.data.bg.asset].texture.height}
          editorScale={Editor.SCALE}
          data={this.props.data}
        />
      </div>
    ),
    world: _ => (
      <div>
        <ScenePreview
          editorScale={Editor.SCALE}
          size={config.size}
          data={this.props.data}
          resources={this.props.resources}
        />

        <WorldEditor
          data={this.props.data}
        />
      </div>
    ),
    assets: _ => (
      <AssetEditor
        assets={this.props.data.assets}
      />
    ),
    character: _ => (
      <CharEditor
        data={this.props.data}
      />
    )
  }

  componentWillMount() {
    // no state -> reset
    if(__DEV__ && Editor.propTypes.data(this.props, 'data', 'Editor', 'prop', 'data') instanceof Error) {
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
