/*@flow*/
import {Polygon, Vec2, Line2} from './algebra'

export function dijkstra(start, end) {
  const heuristic = (a, b) => a.pos.dist(b.pos)

  let closedSet = []
  let openSet = [start]

  const cameFrom = new Map()

  // Lowest known cost to key
  const gScore = new Map([[start, 0]])

  // Estimated total cost to end from key
  const fScore = new Map([[start, heuristic(start, end)]])

  // Default to Infinity for undefined keys
  gScore.get = (key) => gScore.has(key)
    ? Map.prototype.get.call(gScore, key)
    : Infinity

  fScore.get = (key) => fScore.has(key)
    ? Map.prototype.get.call(fScore, key)
    : Infinity

  while (openSet.length > 0) {
    let current = openSet.shift()
    if (current === end) {
      let t = end
      let path = [t]
      while(cameFrom.has(t)) {
        t = cameFrom.get(t)
        path.unshift(t)
      }
      return path
    }
    closedSet = closedSet.concat(current)
    current.neighbours
      // Neighbour must not already be visited
      .filter((e) => closedSet.indexOf(e.to) === -1)
      .forEach((e) => {
        const tgscore = gScore.get(current) + e.weight
        if(!~openSet.indexOf(e.to)) {
          openSet = openSet.concat(e.to)
        } else if (tgscore >= gScore.get(e.to)) {
          return
        }
        cameFrom.set(e.to, current)
        gScore.set(e.to, gScore.get(current) + e.weight)
        fScore.set(e.to, gScore.get(e.to) + heuristic(e.to, end))
      })
    // Order by estimate distance
    openSet = openSet.sort((n1, n2) => fScore.get(n1) > fScore.get(n2))
  }

  // no shortest path :(
  return []
}

export class Node {
  pos: Vec2;
  neighbours: Edge[];
  constructor(pos) {
    this.pos = pos
    this.neighbours = []
  }

  link(other) {
    this.neighbours = this.neighbours.concat(new Edge(this, other))
  }

  unlink() {
    this.neighbours.forEach(({to}) => {
      to.neighbours = to.neighbours.filter(({to: other}) => other !== this)
    })
  }
}

export class Edge {
  to: Node;
  weight: number;
  constructor(a, b) {
    this.to = b
    this.weight = a.pos.dist(b.pos)
  }
}

export class VisibilityGraph {
  nodes: Node[];
  polygon: Polygon;
  constructor(nodes, polygon) {
    this.nodes = nodes
    // has bounding points, subset of points of nodes
    this.polygon = polygon
  }

  linkNodes(n1, n2) {
    // link nodes
    n1.link(n2)
    n2.link(n1)

    // Add to graph
    if (!~this.nodes.indexOf(n1)) {
      this.nodes.push(n1)
    }

    if (!~this.nodes.indexOf(n2)) {
      this.nodes.push(n2)
    }
  }

  connectNode(n) {
    this._connect(this.nodes, n)
  }

  unlinkNode(n1) {
    // remove from neighbours
    n1.unlink()

    // remove from graph
    this.nodes = this.nodes.filter((n2) => n2 !== n1)
  }

  draw(graphics) {
    this.nodes.forEach((node) => {
      node.neighbours.forEach((edge) => {
        const a = node.pos
        const b = edge.to.pos
        graphics.moveTo(a.x, a.y)
        graphics.lineTo(b.x, b.y)
      })
    })
  }

  // private
  _connect(nodes, n1) {
    const polygonLines = this.polygon.sides()
    nodes
      .map(n2 => [new Line2(n1.pos, n2.pos), n2])
      .filter(([l1, n]) => !polygonLines.some(l2 => l2.intersects(l1)))
      .filter(([l1, _]) => this.polygon.contains(l1.centerPoint()))
      .forEach(([_, n2]) => this.linkNodes(n1, n2))
  }

  static fromPolygon(polygon) {
    const vecToNode = (vec) => new Node(vec.x, vec.y)
    const nodes = polygon.points.map((p) => new Node(p))
    const instance = new VisibilityGraph(nodes, polygon)

    nodes.forEach((n1, i) => {
      let n2 = nodes[(i + 1) % nodes.length]

      // neighbour nodes in a polygon must be visible to eachother
      instance.linkNodes(n1, n2)

      // no need to go through all, a->b will also link b->a
      instance._connect(nodes.slice(i + 2), n1)
    })

    return instance
  }
}
