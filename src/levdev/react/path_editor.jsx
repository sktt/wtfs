import T from './types'
import React from 'react'
import ReactDOM from 'react-dom'
import emitter from '../../emitter'
import {Line2, Polygon, Vec2} from '../../algebra'
import PolygonTool from './path_editor/polygon_tool'

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
    const bounds = this.props.data.walkable.bounds
    const bgScale = this.props.data.bg.scale
    const editorScale = this.props.editorScale
    const viewBox = `0 0 ${this.props.textureWidth * bgScale} ${this.props.textureHeight * bgScale}`

    const hoverIndex = this.state.hoverIndex
    const activeIndex = this.state.activeIndex
    const previewHole = this.state.previewHole

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
    const p = new Polygon(props.data.walkable.bounds.map(Vec2.fromArray))

    props.data.walkable.holes.forEach(
      h => p.addHole(new Polygon(h.map(Vec2.fromArray)))
    )
    this.setState({
      polygon: p
    })
  }
}
