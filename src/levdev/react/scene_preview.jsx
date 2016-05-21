import T from './types'

import React from 'react'

import Actions from '../actions'

export default class ScenePreview extends React.Component {
  static propTypes = {
    data: T.data.isRequired
  }

  constructor() {
    super()
  }

  render() {
    const bgScale = this.props.data.bg.scale
    const editorScale = this.props.editorScale
    const bg = this.props.resources[this.props.data.bg.asset]
    const size = this.props.size
    return (
      <div>
        <img style={{
          height: bg.texture.height * editorScale * bgScale,
          margin: '0 auto',
          opacity: 0.7
        }} src={bg.url} />
        <div style={{
          // In camera sight
          position: 'absolute',
          backgroundImage: `url(${bg.url})`,
          backgroundPosition: `${this.props.data.world.pos[0]}px ${this.props.data.world.pos[1]}px`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: bgScale * bg.texture.width,
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
