import T from '../types'
import React, {PropTypes as Type} from 'react'
import Actions from '../../actions'
import {keydown} from '../../interaction'
import AnimItem from './anim_item'
import AnimItemEditor from './anim_item_editor'

// TODO: handle all animations and not only mainChar
export default class AnimEditor extends React.Component {

  static propTypes = {
    data: T.data.isRequired
  }

  constructor() {
    super()
    this.state = {
      editing: 'idle'
    }
    this.handleAnimClick = ::this.handleAnimClick
    this.handleAnimChange = ::this.handleAnimChange
    this.handleAssetChange = ::this.handleAssetChange
    this.handleEsc = ::this.handleEsc
  }

  componentDidMount() {
    this.escDisposable = keydown(27).merge(keydown(13)).subscribe(this.handleEsc)
  }

  componentWillUnMount() {
    this.escDisposable.dispose()
  }

  render() {
    const mainCharName = this.props.data.mainChar.spritesheet.asset
    const mainCharUrl = this.props.data.assets[mainCharName]
    return (
      <div className="anim_editor" style={{background: 'green'}}>
        <img src={mainCharUrl} />
        <input
          type="text"
          defaultValue={mainCharName}
          onChange={this.handleAssetChange}
        />
        <ul>
          {Object.keys(this.props.data.mainChar.spritesheet.anim).map(key => (
            <li key={key}>
              {this.state.editing === key
                ? (
                  <AnimItemEditor
                    sprite={mainCharUrl}
                    name={key}
                    anim={this.props.data.mainChar.spritesheet.anim[key]}
                    onChange={this.handleAnimChange}
                  />
                )
                : (
                  <AnimItem
                    sprite={mainCharUrl}
                    name={key}
                    onClick={this.handleAnimClick}
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

  handleEsc() {
    this.setState({
      editing: ''
    })
  }

  handleAnimClick(name) {
    this.setState({
      editing: name
    })
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
