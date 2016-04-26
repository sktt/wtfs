import T from './types'
import React from 'react'
import ReactDOM from 'react-dom'

// Tool for manipulating polygons
import PolygonTool from './path_editor/polygon_tool'

import {Polygon} from '../../algebra'

export default class PathEditor extends React.Component {
  static propTypes = {
    data: T.data.isRequired
  }
  static defaultProps = {
    data: {
      walkable: {
        bounds: [],
        holes: []
      }
    }
  }
  constructor() {
    super()
    this.state = {
      hoverIndex: -1,
      activeIndex: -1
    }
  }
  componentWillMount() {
    this._makePolygon()
  }
  componentWillReceiveProps(props) {
    this._makePolygon(props)
  }
  render() {
    const bgScale = this.props.data.bg.scale
    const editorScale = this.props.editorScale
    const viewBox = [
      '0',
      '0',
      this.props.textureWidth * bgScale,
      this.props.textureHeight * bgScale
    ].join(' ')

    return (
      <svg
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: this.props.textureWidth * bgScale * editorScale,
          height: '100%',
        }}
        viewBox={viewBox} >
        <PolygonTool
          polygon={this.state.polygon}
          editorScale={editorScale}/>
      </svg>
    )
  }

  _makePolygon(props = this.props) {
    this.setState({
      polygon: Polygon.fromSerialized(props.data.walkable)
    })
  }
}
