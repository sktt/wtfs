import React from 'react'

export default class AnimItemEditor extends React.Component {
  constructor() {
    super()
    this.handleStartFrameXChange = this.handleStartFrameXChange.bind(this)
    this.handleStartFrameYChange = this.handleStartFrameYChange.bind(this)
  }

  render() {
    return (
      <ul style={{borderBottom: '1px solid #000'}}>
        <li>name: <input type="text" defaultValue={this.props.name} /></li>
        <li>
          startFrame:
            <input
              type="number"
              defaultValue={this.props.anim.startFrame[0]}
              onChange={this.handleStartFrameXChange}
            />
            <input
              type="number"
              defaultValue={this.props.anim.startFrame[1]}
              onChange={this.handleStartFrameYChange}
            />
        </li>
        <li>
          frames: <input
            type="number"
            onChange={this.handleChange.bind(this, 'frames')}
            defaultValue={this.props.anim.frames}
          />
        </li>
        <li>
          width: <input
            type="number"
            onChange={this.handleChange.bind(this, 'width')}
            defaultValue={this.props.anim.width}
          />
        </li>
        <li>
          height: <input
            type="number"
            onChange={this.handleChange.bind(this, 'height')}
            defaultValue={this.props.anim.height}
          />
        </li>
        <li>
          <div style={{
            width: this.props.anim.width,
            height: this.props.anim.height,
            backgroundImage: `url(${this.props.sprite})`,
            backgroundPosition: `${-this.props.anim.width * this.props.anim.startFrame[0]}px ${-this.props.anim.height * this.props.anim.startFrame[1]}px`
          }}/>
        </li>
      </ul>
    )
  }

  updateProp(name, val) {
    const valChange = {}
    valChange[name] = val

    const obj = {}
    obj[this.props.name] = Object.assign({}, this.props.anim, valChange)

    this.props.onChange(obj)
  }

  handleChange(name, e) {
    this.updateProp(name, Number(e.target.value))
  }

  handleStartFrameXChange(e) {
    this.updateProp('startFrame', [
      Number(e.target.value),
      this.props.anim.startFrame[1]
    ])
  }

  handleStartFrameYChange(e) {
    this.updateProp('startFrame', [
      this.props.anim.startFrame[0],
      Number(e.target.value)
    ])
  }
}
