import T from './types'

import React from 'react'

import Actions from '../actions'

export default class ScenePreview extends React.Component {
  static propTypes = {
    data: T.data.isRequired,
    scene: React.PropTypes.object.isRequired
  }

  constructor() {
    super()
  }

  render() {
    const bgScale = this.props.data.bg.scale
    const editorScale = this.props.editorScale
    const bgURL = this.props.data.assets[this.props.data.bg.asset]
    const size = this.props.size

    return (
      <div>
        <img style={{
          height: this.props.scene.background.texture.height * editorScale * bgScale,
          margin: '0 auto',
          opacity: 0.7
        }} src={bgURL}/>
        <div style={{
          // In camera sight
          position: 'absolute',
          backgroundImage: `url(${bgURL})`,
          backgroundPosition: `${this.props.data.world.pos[0]}px ${this.props.data.world.pos[1]}px`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: bgScale * this.props.scene.background.texture.width,
          left: -this.props.data.world.pos[0],
          top: -this.props.data.world.pos[1],
          width: size.x,
          height: size.y,
          zoom: editorScale
        }} />
      </div>
    )
  }
}
