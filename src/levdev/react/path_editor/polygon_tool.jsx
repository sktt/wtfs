import Path from './path'
import React from 'react'
import {Polygon, Vec2} from '../../../algebra'
import emitter from '../../../emitter'
import PointEditor from './point_editor'

export default class PolygonTool extends React.Component {
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
          onClick={::this.handlePathClick}
        />
        <PointEditor
          editablePoints={bounds}
          scale={scale}
          onPointChange={::this.handleBoundsChange}
        />
        {holes ? holes.map(
          (h, i) => <Path
            key={i}
            scale={scale}
            points={h}
            onChange={::this.handleHoleChange.bind(this, i)} />
        ) : ''}

        {
          // pathdrawer..
          // take 2 clicks then make the first vertex
          // click finish the path
          ''
        }
      </g>
    )
  }

  handlePathClick(pos: Vec2) {
    if(this.props.polygon.contains(pos)) {
      console.log('Make a hOLE?')
    }
  }
  handleBoundsChange(i, pos) {
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
  handleHoleChange(i, points) {
    const holes = [].concat(this.props.polygon.interior)
    // remove changed one
    holes.splice(i, 1)
    const newHole = new Polygon(points)
    if(!holes.some(
      hole => hole.intersectsPoly(newHole)
    ) && !new Polygon(this.props.polygon.points).intersectsPoly(newHole)) {
      holes.push(newHole)
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
