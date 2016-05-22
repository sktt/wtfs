import React from 'react'

export default class AssetItemEditor extends React.Component {
  constructor() {
    super()
    this.handleNameChange = this.handleNameChange.bind(this)
    this.handleURLChange = this.handleURLChange.bind(this)
    this.handleDeleteClick = this.handleDeleteClick.bind(this)
    this.update = this.update.bind(this)
  }

  render() {
    const {rowStyle, colStyle, asset, name, url} = this.props
    return (
      <tr style={rowStyle} className="active" >
        <td style={colStyle}>
          <button onClick={this.handleDeleteClick}>DELETE</button>
        </td>
        <td style={colStyle}>
          <input
            type="text"
            placeholder="NAME REF"
            defaultValue={name}
            onChange={this.handleNameChange}
          />
        </td>
        <td style={colStyle}>
          <input
            type="text"
            placeholder="URL"
            defaultValue={url}
            onChange={this.handleURLChange}
          />
        </td>
      </tr>
    )
  }

  update(name, url) {
    const o = {}
    o[name] = url
    this.props.onChange(o)
  }

  handleDeleteClick() {
    this.props.onDelete(this.props.name)
  }

  handleNameChange(e) {
    this.update(e.target.value, this.props.url)
  }

  handleURLChange(e) {
    this.update(this.props.name, e.target.value)
  }
}
