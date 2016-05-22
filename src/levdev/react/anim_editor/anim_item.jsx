import Recat from 'react'

export default class AnimItem extends React.Component {
  constructor() {
    super()
    this.handleClick = ::this.handleClick
  }

  render() {
    const {name, anim, sprite} = this.props
    const {startFrame, frames, width, height} = anim
    return (
      <ul onClick={this.handleClick} style={{borderBottom: '1px solid #000'}}>
        <li>name: {name}</li>
        <li>startFrame: {startFrame.join()}</li>
        <li>frames: {frames}</li>
        <li>width: {width}</li>
        <li>height: {height}</li>
        <li>
          <div style={{
            width: width,
            height: height,
            backgroundImage: `url(${sprite})`,
            backgroundPosition: `${-width * startFrame[0]}px ${-height * startFrame[1]}px`
          }}/>
        </li>
      </ul>
    )
  }
  handleClick() {
    this.props.onClick(this.props.name)
  }
}
