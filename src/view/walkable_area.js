import {drawPolygon} from './pixi_draw_utils'
import {VisibilityGraph, astar} from '../graph'

export default class WalkableArea {
  constructor(polygon) {
    // Surrounding the walkable area
    this.polygon = polygon
    // Visibilty graph to navigate
    this.visGraph = VisibilityGraph.fromPolygon(this.polygon)
  }

  draw(graphics) {
    drawPolygon(this.polygon, graphics)
    return graphics
  }

  findPath(from, to) {
    if (!(this.polygon.contains(from.pos) && this.polygon.contains(to.pos))) {
      console.warn(`Not within walkable: ${from.pos.x},${from.pos.y} ${to.pos.x},${to.pos.y}`)
      console.warn('things might break')
    }

    this.visGraph.connectNode(from)
    this.visGraph.connectNode(to)

    const path = astar(from, to)

    this.visGraph.unlinkNode(from)
    this.visGraph.unlinkNode(to)

    return path
  }
}
