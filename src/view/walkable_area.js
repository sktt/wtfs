import {drawPolygon} from './pixi_draw_utils'
import {VisibilityGraph, dijkstra} from '../graph'

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
      console.error(`Shit data: ${from.pos.x},${from.pos.y} ${to.pos.x},${to.pos.y}`)
      return []
    }

    this.visGraph.connectNode(from)
    this.visGraph.connectNode(to)

    const path = dijkstra(from, to)

    this.visGraph.unlinkNode(from)
    this.visGraph.unlinkNode(to)

    return path
  }
}
