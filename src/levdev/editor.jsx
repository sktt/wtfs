import config from '../config'
import React from 'react'
import emitter from '../emitter'

export default React.createClass({

  getInitialState() {
    return {
      walkable: []
    }
  },

  componentDidMount() {
    window.addEventListener('click', this.createPolygon)
  },

  componentWillUnmount() {
    window.removeEventListener('click', this.createPolygon)
  },

  createPolygon(e) {
    const s = this.state.walkable.concat([[e.clientX, e.clientY]])
    this.setState({
      walkable: s
    })
  },

  render() {
    const editorScale = 0.3
    const bgScale = this.props.data.bg.scale
    const bgURL = this.props.data.assets[this.props.data.bg.asset]
    return <div>
      <img style={{
        height: `${config.size.y*editorScale}`,
        margin: '0 auto',
        opacity: 0.7,
        zoom: bgScale
        // World
      }} src={bgURL} />
      <div style={{
        // In camera sight
        position: 'absolute',
        backgroundImage: `url(${bgURL})`,
        backgroundPosition: `${this.props.data.world.pos[0]}px ${this.props.data.world.pos[1]}px`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: bgScale * this.props.scene.background.texture.width,
        left: -this.props.data.world.pos[0],
        top: -this.props.data.world.pos[1],
        width: config.size.x,
        height: config.size.y,
        zoom: editorScale
      }} />
      <input
        min="0"
        max={(this.props.scene.background.texture.width * this.props.data.bg.scale) - config.size.x}
        onChange={this.handleWorldXChange}
        type="range"
        defaultValue={-this.props.data.world.pos[0]} />
      <input
        min="0"
        max={(config.size.y * this.props.data.bg.scale) - config.size.y}
        onChange={this.handleWorldYChange}
        type="range"
        defaultValue={-this.props.data.world.pos[1]} />
      <input
        min="0.1"
        max="3"
        onChange={this.handleBgScaleChange}
        step="0.1"
        type="range"
        defaultValue={this.props.data.bg.scale} />
      <button onClick={this.handleClickSave}>Save</button>
    </div>
  },

  handleBgScaleChange(e) {
    const d = this.props.data
    d.bg.scale = e.target.value
    // TODO make sure cords respect scale
    emitter.emit('u_state', d)
  },
  handleWorldXChange(e) {
    const d = this.props.data
    d.world.pos[0] = -e.target.value
    emitter.emit('u_state', d)
  },
  handleWorldYChange(e) {
    const d = this.props.data
    d.world.pos[1] = -e.target.value
    emitter.emit('u_state', d)
  },
  handleClickSave(e) {
    const d = this.props.data
    localStorage.setItem('3dsh:last_state', JSON.stringify(d))
  }
})

    //<svg style={{ width: '100%', height: '100%'}}>
      //{this.state.walkable.length ?
        //<path style={{stroke: 'red', fill: 'red'}} d={`M${this.state.walkable[0][0]} ${this.state.walkable[0][1]}` + this.state.walkable.slice(1).map((d) => {
            //return 'L' + d[0] + " " + d[1]
          //}) + 'Z'}>
        //</path>
        //: null
      //}
    //</svg>
