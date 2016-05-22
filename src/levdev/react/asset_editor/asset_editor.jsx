import T from '../types'
import React, {PropTypes as Type} from 'react'
import Actions from '../../actions'
import {keydown} from '../../interaction'
import AssetItem from './asset_item'
import AssetItemEditor from './asset_item_editor'

export default class AssetEditor extends React.Component {
  constructor() {
    super()
    this.state = {
      active: ''
    }
    this.handleAssetClick = ::this.handleAssetClick
    this.handleChange = ::this.handleChange
    this.handleDelete = ::this.handleDelete
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
  render() {
    const tableStyle = {
      width: 600,
      backgroundColor: '#dedede'
    }
    const rowStyle = {
      height: 80,
      overflow: 'hidden'
    }
    const colStyle = {
      border: '1px solid #000',
      width: 200
    }

    return (
      <table cellSpacing="0" style={tableStyle}>
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
              this.state.active === name ? (
                <AssetItemEditor
                  key={name}
                  name={name}
                  url={this.props.assets[name]}
                  onChange={this.handleChange}
                  rowStyle={rowStyle}
                  colStyle={colStyle}
                  onDelete={this.handleDelete}
                />
              ) : (
                <AssetItem
                  key={name}
                  name={name}
                  url={this.props.assets[name]}
                  rowStyle={rowStyle}
                  colStyle={colStyle}
                  onClick={this.handleAssetClick}
                />
              )
            )
          )}
        </tbody>
      </table>
    )
  }

  handleEsc() {
    this.setState({
      active: ''
    })
  }
  handleEnter() {
    this.setState({
      active: ''
    })
  }

  handleChange(asset) {
    const assets = Object.assign({}, this.props.assets, asset)
    Actions.updateAssets(assets)
  }

  handleDelete(name) {
    const assets = Object.assign({}, this.props.assets)
    delete assets[name]
    Actions.updateAssets(assets)
  }

  handleAssetClick(name) {
    this.setState({
      active: name
    })
  }
}
