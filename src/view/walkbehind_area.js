import PIXI from 'pixi.js'
import {Polygon} from '../algebra.js'
import {drawPolygon} from './pixi_draw_utils.js'

export default class WalkbehindArea {
  constructor(bg: PIXI.Sprite, polygon: Polygon) {
    this.spr = new PIXI.extras.TilingSprite(bg.texture, bg.width, bg.height)
    this.spr.tileScale = bg.tileScale || bg.scale

    this.graphics = new PIXI.Graphics()
    this.graphics.beginFill()
    drawPolygon(polygon, this.graphics)
    this.graphics.endFill()
    this.spr.mask = this.graphics
  }
}
