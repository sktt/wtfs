import React, {PropTypes} from 'react'
import {mousemove, mouseup} from '../../interaction'
import {Vec2} from '../../../algebra'

export default class PointEditor extends React.Component {
  constructor() {
    super()
    this.state = {
      hoverIndex: -1,
      activeIndex: -1
    }
  }
  componentDidMount() {
    this.mouseupDisposable = mouseup.subscribe(::this.handleMouseUp)
    this.mousemoveDisposable = mousemove.subscribe(::this.handleMouseMove)
  }
  componentWillUnmount() {
    this.mousemoveDisposable.dispose()
    this.mouseupDisposable.dispose()
  }
  render() {
    return (
      <g>
        {this.props.editablePoints.map(
          ({x, y}, i) => <circle
            onMouseOver={this.handleMouseOverPoint.bind(this, i)}
            onMouseLeave={this.handleMouseLeavePoint.bind(this, i)}
            onMouseDown={this.handleMouseDownPoint.bind(this, i)}
            onContextMenu={this.handleRightClickPoint.bind(this, i)}
            key={i}
            cx={x}
            cy={y}
            r="15px"
            fill={this.state.activeIndex === i
              ? "#0f0"
              : this.state.hoverIndex === i
                ? "#00f"
                : "rgba(0,0,0,0.0)"
            } />
        )}
      </g>
    )
  }

  handleMouseOverPoint(i) {
    this.setState({
      hoverIndex: i
    })
  }
  handleMouseLeavePoint(i)  {
    this.setState({
      hoverIndex: -1
    })
  }
  handleMouseDownPoint(i, e)  {
    if(e.nativeEvent.which === 1) {
      //left click
      this.setState({
        activeIndex: i
      })
    }
  }
  handleMouseMove(pos: Vec2) {
    if(this.state.activeIndex >= 0) {
      this.props.onPointChange(this.state.activeIndex, pos)
    }
  }
  handleMouseUp()  {
    this.setState({
      activeIndex: -1
    })
  }
  handleRightClickPoint(i, e) {
    // remove
    // onchange
    // prevent context menu
    e.preventDefault()
  }
}


