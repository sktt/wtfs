import T from '../types'
import React, {PropTypes} from 'react'
import ReactDOM from 'react-dom'
import {Line2, Polygon, Vec2} from '../../../algebra'
import {mousemove} from '../../interaction'

export default class Path extends React.Component {
  static propTypes = {
    points: PropTypes.arrayOf(
      PropTypes.shape({
        x: PropTypes.number,
        y: PropTypes.number
      })
    )
  }
  static defaultProps = {
    points: [],
    holes: []
  }
  constructor() {
    super()
    this.state = {
      hoverIndex: -1,
      activeIndex: -1
    }
  }
  componentDidMount() {
    this.mousemoveDisposable = mousemove.subscribe(::this.handleMouseMove)
  }
  componentWillUnmount() {
    this.mousemoveDisposable.dispose()
  }
  render() {
    const ps = this.props.points
    const hs = this.props.holes
    let pathD = ps.length
      ? `M${ps[0].x} ${ps[0].y}` + ps.slice(1).map(
        ({x, y}) => `L${x} ${y}`
      ) + 'Z'
      : ''

    pathD += hs.length
      ? hs.map(
        h => `M${h[0].x} ${h[0].y}` + h.map(
          ({x, y}) => `L${x} ${y}`
        ) + 'Z'
      ).join('')
      : ''

    return (
      <g>
        <path
          style={{
            stroke: 'red',
            fill: this.props.bg,
            fillRule: 'evenodd'
          }}
          onClick={::this.handlePathClick}
          d={pathD} />
      </g>
    )
  }
  handleMouseMove(pos) {
    this.mousePos = pos
  }

  handlePathClick(e) {
    if(this.props.onClick) {
      this.props.onClick(this.mousePos)
    }
  }
}
