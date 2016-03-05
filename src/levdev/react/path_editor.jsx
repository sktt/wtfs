import React from 'react'
import ReactDOM from 'react-dom'
import {data} from './types'
import emitter from '../../emitter'
import {Polygon, Vec2} from '../../algebra'

export default class PathEditor extends React.Component {
  static propTypes = {
    data
  }
  static defaultProps = {
    data: {
      walkable: []
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
    this.setState({
      polygon: new Polygon(this.props.data.walkable.map(([x,y]) => new Vec2(x,y)))
    })
  }

  componentWillReceiveProps(props) {
    this.setState({
      polygon: new Polygon(this.props.data.walkable.map(([x,y]) => new Vec2(x,y)))
    })
  }

  render() {
    const walkable = this.props.data.walkable
    const bgScale = this.props.data.bg.scale
    const editorScale = this.props.editorScale
    const viewBox = `0 0 ${this.props.textureWidth * bgScale} ${this.props.textureHeight * bgScale}`

    const hoverIndex = this.state.hoverIndex
    const activeIndex = this.state.activeIndex
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
        viewBox={viewBox}
        onMouseMove={::this.handleMouseMove}
        onMouseUp={::this.handleAddPreviewed}
      >
        {walkable.length
          ? <path
              style={{stroke: 'red', fill: 'rgba(255, 0, 0, 0.5)'}}
              d={`M${walkable[0][0]} ${walkable[0][1]}` +
                  walkable.slice(1).map((d) => {
                return 'L' + d[0] + " " + d[1]
              }) + 'Z'}>
            </path>
          : null
        }
        {this.state.previewAdd
          ? <circle cx={this.state.previewAdd[0].x} cy={this.state.previewAdd[0].y} r="15px" fill="rgba(0,0,0,0.5)"/>
          : null
        }
        {walkable.length
          ? walkable.map((d, i) => <circle
            onMouseOver={this.handleMouseOver.bind(this, i)}
            onMouseLeave={this.handleMouseLeave.bind(this, i)}
            onMouseDown={this.handleMouseDown.bind(this, i)}
            onMouseUp={this.handleMouseUp.bind(this, i)}
            onContextMenu={this.handleRightClick.bind(this, i)}
            key={i}
            cx={d[0]}
            cy={d[1]}
            r="15px"
            fill={this.state.activeIndex === i ? "#0f0" : this.state.hoverIndex === i ? "#00f" : "#000"}
          />)
          : null}
      </svg>
    )
  }
  handleMouseMove(e) {
    const editorScale = this.props.editorScale
    const pos = [e.clientX/editorScale, e.clientY/editorScale]
    if(this.state.activeIndex !== -1) {
      const d = this.props.data
      d.walkable[this.state.activeIndex] = pos
      emitter.emit('u_state', d)
      this.setState({
        previewAdd: null
      })
    } else if (this.state.hoverIndex === -1){
      this.setState({
        previewAdd: this.state.polygon.nearestInside(new Vec2(pos[0], pos[1]))
      })
    }
  }
  handleMouseOver(i)  {
    this.setState({
      hoverIndex: i,
      previewAdd: null
    })
  }
  handleMouseLeave(i)  {
    if(this.state.hoverIndex === i) {
      this.setState({
        hoverIndex: -1
      })
    }
  }
  handleMouseUp(i)  {
    this.setState({
      activeIndex: -1
    })
  }
  handleRightClick(i, e) {
    const d = this.props.data
    d.walkable = d.walkable.slice(0, i).concat(d.walkable.slice(i+1))
    emitter.emit('u_state', d)
    e.preventDefault()
  }
  handleAddPreviewed() {
    if (this.state.previewAdd) {
      const d = this.props.data
      const {x,y} = this.state.previewAdd[0]
      const neighbourIndex = this.state.previewAdd[1]
      d.walkable = d.walkable
        .slice(0, neighbourIndex+1)
        .concat([[Math.round(x), Math.round(y)]])
        .concat(d.walkable.slice(neighbourIndex+1))
      emitter.emit('u_state', d)
    }
  }
  handleMouseDown(i, e)  {
    if(e.nativeEvent.which === 1) {
      // left click
      this.setState({
        activeIndex: i
      })
    }
  }
}
