import React, {PropTypes} from 'react'
import {mousemove} from '../../interaction'
import {Vec2, Line2} from '../../../algebra'
import Path from './path'

export default class PathDrawer extends React.Component {
  constructor() {
    super()
    this.state = {
      hover: false
    }
  }

  render() {
    const ps = this.props.points
    const pathD = ps.length
      ? `M${ps[0].x} ${ps[0].y}` + ps.slice(1).map(
        ({x, y}) => `L${x} ${y}`
      )
      : ''

    const lastP = ps[ps.length-1]
    const nextP = this.props.previewNext

    return (
      <g >
        {ps.length >= 2
          ? <path style={{
              fill: this.state.hover ? 'green' : 'none',
              stroke: 'green',
              strokeWidth: 3
            }}
            d={pathD} />
          : null
        }
        {nextP
          ? <line x1={lastP.x} y1={lastP.y} x2={nextP.x} y2={nextP.y} style={{
              stroke:'green',
              strokeWidth:3
            }} />
          : null
        }
        {ps[0]
          ? <circle
              onMouseOver={::this.handleMouseOverPoint}
              onMouseLeave={::this.handleMouseLeavePoint}
              onClick={::this.handleClickPoint}
              cx={ps[0].x}
              cy={ps[0].y}
              r="15px"
              fill={this.state.hover
                ? "#00f"
                : "rgba(0,0,0,0.2)"
              } />
          : null
        }
      </g>
    )
  }
  handleMouseOverPoint() {
    this.setState({
      hover: true
    })
  }
  handleMouseLeavePoint() {
    this.setState({
      hover: false
    })
  }
  handleClickPoint() {
    this.props.onConnectPath()
  }
}

