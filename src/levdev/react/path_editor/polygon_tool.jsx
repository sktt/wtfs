import Path from './path'
import React from 'react'
import {Polygon, Vec2, Line2} from '../../../algebra'
import emitter from '../../../emitter'
import PointEditor from './point_editor'
import {mousemove, keyup} from './../../interaction'
import PathDrawer from './path_drawer'

const ESC = 27

export default class PolygonTool extends React.Component {
  constructor() {
    super()
    this.state = {
      drawPathNext: null,
      drawPathPoints: []
    }
  }
  componentDidMount() {
    this.keyupEscDisposeable = keyup(ESC).subscribe(::this.handleKeyUpESC)
    this.mousemoveDisposable = mousemove.subscribe(::this.handleMouseMove)
  }
  componentWillUnmount() {
    this.mousemoveDisposable.dispose()
    this.keyupEscDisposeable.dispose()
  }
  render() {
    const bounds = this.props.polygon.points
    const holes = this.props.polygon.interior.map(
      h => h.points
    )
    const scale = this.props.editorScale

    return (
      <g>
        <Path
          scale={scale}
          points={bounds}
          holes={holes}
          bg="rgba(200,100,0,0.9)"
          onClick={::this.handlePathClick}
        />
        {!this.state.drawPathPoints.length
          ? <PointEditor
              editablePoints={bounds}
              scale={scale}
              onPointChange={::this.handleBoundsChange}
            />
          : null
        }
        {holes ? holes.map(
          // Ok this thing will just handle clicks.
          (h, i) => <g key={i}>
            <Path
              scale={scale}
              points={h}
              onClick={this.handleHoleClick.bind(this, i)}
              bg={i === this.state.selectedHole ? 'rgba(255,255,255,0.4)' : 'transparent'}
            />
            {!this.state.drawPathPoints.length
              ? <PointEditor
                editablePoints={h}
                scale={scale}
                onPointChange={this.handleHoleChange.bind(this, i)}
              />
              : null
            }
          </g>
        ) : null}
        {this.state.drawPathPoints.length
          ? <PathDrawer
              previewNext={this.state.drawPathNext}
              onConnectPath={::this.handleConnectPath}
              points={this.state.drawPathPoints} />
          : null
        }
      </g>
    )
  }
  resetDrawPath() {
    this.setState({
      drawPathNext: null,
      drawPathPoints: []
    })
  }
  handleKeyUpESC() {
    if(this.state.drawPathPoints.length) {
      this.resetDrawPath()
    } else if (this.state.selectedHole >= 0) {
      // remove hole
      const holes = [].concat(this.props.polygon.interior)
      holes.splice(this.state.selectedHole, 1)
      emitter.emit('u_state_walkable', {
        bounds: this.props.polygon.points.map(p => p.arr()),
        holes: holes.map(
          poly => poly.points.map(
            p => p.arr()
          )
        )
      })
      this.setState({
        selectedHole: -1
      })
    }
  }
  handleConnectPath() {
    const hole = this.state.drawPathPoints
    emitter.emit('u_state_walkable', {
      // maybe also pass array version
      // or transform in polygon.. unncessary work
      bounds: this.props.polygon.points.map(p => p.arr()),
      holes: this.props.polygon.interior.map(
        poly => poly.points.map(
          p => p.arr()
        )
      ).concat([hole.map(
        p => p.arr()
      )])
    })
    this.resetDrawPath()
  }
  handleMouseMove(pos: Vec2) {
    const ps = this.state.drawPathPoints
    if(!ps.length) {
      return
    }

    const l = new Line2(
      this.state.drawPathPoints.slice(-1)[0],
      pos
    )
    const intersectsSelf = ps.some(
      (p, i) => l.intersects(new Line2(p, ps[(i+1) % ps.length]))
    )

    const intersectsLine = this.props.polygon.intersectsLine(l)

    if(!intersectsLine && !intersectsSelf) {
      this.setState({
        drawPathNext: pos
      })
    }
  }
  handlePathClick(pos: Vec2) {
    if(this.props.polygon.contains(pos)) {
      this.setState({
        drawPathPoints: this.state.drawPathPoints.concat(pos),
        selectedHole: -1
      })
    }
  }
  handleHoleClick(i, pos) {
    this.setState({
      selectedHole: i
    })
  }
  handleBoundsChange(i: number, pos: Vec2) {
    const ps = [].concat(this.props.polygon.points)
    ps[i] = pos

    const newBounds = new Polygon(ps)

    const anyInteresctions = this.props.polygon.interior.some(
      hole => newBounds.intersectsPoly(hole)
    )

    const sides = newBounds.sides()
    const lineA = sides[i === 0 ? sides.length - 1 : i - 1]
    const lineB = sides[i]
    const intersectsSelf = sides.some(
      side => (side !== lineA && side.intersects(lineA)) ||
        (side !== lineB && side.intersects(lineB))
    )

    if(!anyInteresctions && !intersectsSelf) {
      emitter.emit('u_state_walkable', {
        // maybe also pass array version
        // or transform in polygon.. unncessary work
        bounds: ps.map(p => p.arr()),
        holes: this.props.polygon.interior.map(
          poly => poly.points.map(
            p => p.arr()
          )
        )
      })
    }
  }
  handleHoleChange(i: number, j: number, pos: Vec2) {
    const holes = [].concat(this.props.polygon.interior)
    const newHole = holes[i]
    newHole.points[j] = pos
    if(!holes.some(
      hole => hole !== newHole && hole.intersectsPoly(newHole)
    ) && !new Polygon(this.props.polygon.points).intersectsPoly(newHole)) {
      emitter.emit('u_state_walkable', {
        // maybe also pass array version
        // or transform in polygon.. unncessary work
        bounds: this.props.polygon.points.map(p => p.arr()),
        holes: holes.map(
          poly => poly.points.map(
            p => p.arr()
          )
        )
      })
    }
  }
}
