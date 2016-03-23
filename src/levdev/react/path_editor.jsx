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

  handleRightClickCircle(i, e) {
    const d = this.props.data
    d.walkable.bounds = d.walkable.bounds.slice(0, i).concat(d.walkable.bounds.slice(i+1))
    emitter.emit('u_state', d)
    e.preventDefault()
  }

  handleMouseMoveWorld(e) {
    const editorScale = this.props.editorScale
    const pos = [(window.scrollX + e.clientX)/editorScale, (window.scrollY + e.clientY)/editorScale]
    const vecPos = new Vec2(pos[0], pos[1])

    if (this.state.activeIndex !== -1) {
      const d = this.props.data
      d.walkable.bounds[this.state.activeIndex] = pos
      emitter.emit('u_state', d)
      this.setState({
        previewAdd: null
      })
    } else if (this.state.hoverIndex === -1) {
      this.setState({
        previewAdd: this.state.polygon.nearestInside(vecPos)
      })
    }

    if(this.state.previewHole) {
      const h = this.state.previewHole[0]
      const holeRect = [h, [h[0], pos[1]], pos, [pos[0], h[1]]]
      const holeRectPoly = new Polygon(holeRect.map(Vec2.fromArray))

      if (this.state.polygon.containsPolygon(holeRectPoly)) {
        this.setState({
          previewHole: [h, [h[0], pos[1]], pos, [pos[0], h[1]]]
        })
      }
    }
  }
  handleMouseUpWorld(e) {
    const editorScale = this.props.editorScale

    if (this.state.previewAdd) {
      const pos = [(window.scrollX + e.clientX)/editorScale, (window.scrollY + e.clientY)/editorScale]
      if(this.state.polygon.contains(new Vec2(pos[0], pos[1]))) {
        if(!this.state.previewHole) {
          this.setState({
            previewHole: [pos, pos, pos, pos]
          })
        } else {
          const inside = this.state.polygon.containsPolygon(new Polygon(
            this.state.previewHole.map(Vec2.fromArray)
          ))
          if(inside) {
            const d = this.props.data
            d.walkable.holes = d.walkable.holes.concat([this.state.previewHole])
            this.setState({
              previewHole: null
            })
            emitter.emit('u_state', d)
          } else {
            this.setState({
              previewHole: null
            })
          }
        }
      } else {
        const d = this.props.data
        const {x,y} = this.state.previewAdd[0]
        const neighbourIndex = this.state.previewAdd[1]
        d.walkable.bounds = d.walkable.bounds
          .slice(0, neighbourIndex+1)
          .concat([[x, y]])
          .concat(d.walkable.bounds.slice(neighbourIndex+1))
        emitter.emit('u_state', d)
      }
    }
  }
}
