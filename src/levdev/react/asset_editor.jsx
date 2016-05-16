import T from './types'
import React, {PropTypes as Type} from 'react'
import Actions from '../actions'
import {keydown} from '../interaction'

export default class AssetEditor extends React.Component {
  constructor() {
    super()
    this.state = {
      active: ''
    }
  }
  componentDidMount() {
    // 27 - ESC
    this.disposeOnEsc = keydown(27).subscribe(::this.handleEsc)
    this.disposeOnEnter = keydown(13).subscribe(::this.handleEnter)
  }
  compnentWillUnmount() {
    this.disposeOnEsc.dispose()
    this.disposeOnEnter.dispose()
  }
  handleEsc(){
    this.setState({
      active: ''
    })
  }
  handleEnter() {
    if (this.state.active) {
      const item = {}
      item[this.state.active] = this.props.assets[this.state.active]
      Actions.updateAssets(Object.assign({}, this.props.assets, item))
    } else if (this.state.newName && this.state.newUrl) {
      // check url with new Image?
      const img = new Image()
      img.onload = () => {
        const item = {}
        item[this.state.newName] = this.state.newUrl
        Actions.updateAssets(Object.assign({}, this.props.assets, item))
      }
      img.onerror = () => {
        this.setState({
          newUrl: 'FIXME' + this.state.newUrl
        })
      }
      img.src = this.state.newUrl
    }
  }
  render() {
    const rowHeight = 80
    const tdStyle = {
      border: '1px solid #000',
      width: 200
    }

    return (
      <table cellSpacing="0" style={{width: 600, background: '#dedede'}}>
        <thead>
          <tr>
            <th>Preview</th>
            <th>Name</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(this.props.assets).map(
            name => (
              <tr
                className={this.state.active ===name ? 'active' : ''}
                style={{height: rowHeight, overflow:'hidden'}}
                key={name}
                onClick={this.setActive.bind(this, name)}
              >
                <td style={tdStyle}>
                  { this.state.active === name
                    ? <button onClick={this.removeAsset.bind(this, name)}>DELETE</button>
                    : <img style={{maxHeight: rowHeight}} src={this.props.assets[name]}/>
                  }
                </td>
                <td style={tdStyle}>
                  {this.state.active === name
                    ? <input type="text" defaultValue={name} />
                    : name
                  }
                </td>
                <td style={tdStyle}>
                  {this.state.active === name
                    ? <input type="text" defaultValue={this.props.assets[name]} />
                    : this.props.assets[name]
                  }
                </td>
              </tr>
            )
          )}
          <tr
            style={{height: rowHeight, overflow:'hidden'}}
          >
            <td style={tdStyle}>
              Add new
            </td>
            <td style={tdStyle}>
              <input
                type="text"
                placeholder="NAME REF"
                onChange={::this.setName}
              />
            </td>
            <td style={tdStyle}>
              <input
                type="text"
                placeholder="URL"
                onChange={::this.setUrl}
              />
            </td>
          </tr>
        </tbody>
      </table>
    )
  }
  removeAsset(name) {
    const assets = Object.assign({}, this.props.assets)
    delete assets[name]
    Actions.updateAssets(assets)
  }
  setName(e) {
    this.setState({
      newName: e.target.value
    })
  }
  setUrl(e) {
    this.setState({
      newUrl: e.target.value
    })
  }
  setActive(name) {
    this.setState({
      active: name
    })
  }
}
