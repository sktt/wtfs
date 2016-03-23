import PIXI from 'pixi.js'
import earcut from 'earcut'
import {Polygon}from '../algebra.js'

export function drawPolygon (poly: Polygon, g: PIXI.Graphics) {
  const flat = (p) => p.reduce((acc, el) => acc.concat([el.x, el.y]), [])
  let points = flat(poly.points)
  let holeIndeces = []
  poly.interior.forEach(hole => {
    holeIndeces = holeIndeces.concat(points.length/2)
    points = points.concat(flat(hole.points))
  })
  const tris = earcut(points, holeIndeces)
  for(let i = 0; i < tris.length/3; i++) {
    g.moveTo(points[tris[i * 3] * 2], points[tris[i * 3] * 2 + 1])
    g.lineTo(points[tris[i * 3 + 1] * 2], points[tris[i * 3 + 1] * 2 + 1])
    g.lineTo(points[tris[i * 3 + 2] * 2], points[tris[i * 3 + 2] * 2 + 1])
  }
  return g
}
