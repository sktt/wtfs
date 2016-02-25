import PIXI from 'pixi.js'
import {Polygon} from '../algebra'
import earcut from 'earcut'

function drawPolygon(poly :Polygon, g: PIXI.Graphics) {
  let points = poly.flat()
  let holeIndeces = []
  poly.interior.forEach(hole => {
    holeIndeces = holeIndeces.concat(points.length/2)
    points = points.concat(hole.flat())
  })
  const tris = earcut(points, holeIndeces)
  for(let i = 0; i < tris.length/3; i++) {
    g.moveTo(points[tris[i * 3] * 2], points[tris[i * 3] * 2 + 1])
    g.lineTo(points[tris[i * 3 + 1] * 2], points[tris[i * 3 + 1] * 2 + 1])
    g.lineTo(points[tris[i * 3 + 2] * 2], points[tris[i * 3 + 2] * 2 + 1])
  }
  return g
}

export default class WalkbehindArea {
  constructor(bg, polygon) {
    this.spr = new PIXI.extras.TilingSprite(bg.texture, bg.width, bg.height)
    this.spr.tileScale = bg.tileScale || bg.scale
    this.graphics = new PIXI.Graphics()
    this.graphics.beginFill()
    drawPolygon(polygon, this.graphics)
    this.graphics.endFill()
    this.spr.mask = this.graphics
  }
}
