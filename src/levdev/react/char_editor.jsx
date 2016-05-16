import T from './types'
import React, {PropTypes as Type} from 'react'
import Actions from '../actions'

export default class CharEditor extends React.Component {

  static propTypes = {
    data: T.data.isRequired
  }

  componentWillMount() {
    this.setState({
      editing: 'idle',
    })
  }

  render() {
    const mainCharName = this.props.data.mainChar.spritesheet.asset
    const mainCharUrl = this.props.data.assets[mainCharName]
    return (
      <div className="char_editor" style={{background: 'green'}}>
        <img src={mainCharUrl} />
        <input
          type="text"
          defaultValue={mainCharName}
          onChange={::this.handleAssetChange}
        />
        <ul>
          {Object.keys(this.props.data.mainChar.spritesheet.anim).map(key => (
            <li key={key}>
              {this.state.editing === key
                ? (
                  <SpriteAnimEdit
                    sprite={mainCharUrl}
                    name={key}
                    anim={this.props.data.mainChar.spritesheet.anim[key]}
                    onChange={::this.handleAnimChange}
                  />
                )
                : (
                  <SpriteAnim
                    sprite={mainCharUrl}
                    name={key}
                    anim={this.props.data.mainChar.spritesheet.anim[key]}
                  />
                )
              }
            </li>
          ))}
        </ul>
      </div>
    )
  }

  handleAnimChange(dir) {
    const mainChar = {...this.props.data.mainChar, spritesheet: {
      asset: this.props.data.mainChar.spritesheet.asset,
      anim: Object.assign({}, this.props.data.mainChar.spritesheet.anim, dir),
    }}
    Actions.updateMainChar(mainChar)
  }

  handleAssetChange(e) {
    const val = e.target.value
    if (this.props.data.assets[val]) {
      const mainChar = {...this.props.data.mainChar, spritesheet: {
        asset: val,
        anim: this.props.data.mainChar.spritesheet.anim
      }}
      Actions.updateMainChar(mainChar)
    }
  }
}

class SpriteAnim extends React.Component {

  render() {
    return (
      <ul style={{borderBottom: '1px solid #000'}}>
        <li>name: {this.props.name}</li>
        <li>startFrame: {this.props.anim.startFrame.join()}</li>
        <li>frames: {this.props.anim.frames}</li>
        <li>width: {this.props.anim.width}</li>
        <li>height: {this.props.anim.height}</li>
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
}

class SpriteAnimEdit extends React.Component {

  render() {
    return (
      <ul style={{borderBottom: '1px solid #000'}}>
        <li>name: <input type="text" defaultValue={this.props.name}  /></li>
        <li>
          startFrame: {this.props.anim.startFrame.map(
            (f, i) => (
              <input
                key={i}
                type="number"
                defaultValue={f}
                onChange={this.handleChange.bind(this, 'startFrame')}
              />
            )
          )}
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

  handleChange(name, e) {
    const valChange = {}
    valChange[name] = Number(e.target.value)

    const obj = {}
    obj[this.props.name] = Object.assign({}, this.props.anim, valChange)

    console.log(obj)
    this.props.onChange(obj)
  }
}
