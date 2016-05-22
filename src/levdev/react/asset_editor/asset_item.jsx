import React from 'react'

export default class AssetItem extends React.Component {
  constructor() {
    super()
    this.handleClick = this.handleClick.bind(this)
  }

  render() {
    const {rowStyle, colStyle, name, url} = this.props
    return (
      <tr
        style={rowStyle}
        key={name}
        onClick={this.handleClick}
      >
        <td style={colStyle}>
          <img style={{height: rowStyle.height}} src={url}/>
        </td>
        <td style={colStyle}>
          {name}
        </td>
        <td style={colStyle}>
          {url}
        </td>
      </tr>
    )
  }

  handleClick() {
    this.props.onClick(this.props.name)
  }
}
