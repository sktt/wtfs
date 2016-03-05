/*@flow*/
export class Vec2 {
  x: number;
  y: number;
  constructor(x, y) {
    this.x = x
    this.y = y
  }

  arr() {
    return [this.x, this.y]
  }

  distSq(v) {
    const dx = v.x - this.x
    const dy = v.y - this.y
    return dx * dx + dy * dy
  }

  dist(v) {
    return Math.sqrt(this.distSq(v))
  }

  len() {
    return this.dist(Vec2.ORIGO)
  }

  norm() {
    const l = this.len()
    return new Vec2(this.x/l, this.y/l)
  }

  dot(v) {
    return this.x * v.x + this.y * v.y
  }

  scale(m) {
    return new Vec2(this.x * m, this.y * m)
  }

  add(v) {
    return new Vec2(this.x + v.x, this.y + v.y)
  }

  sub(v) {
    return this.add(v.scale(-1))
  }

  equals(o): boolean {
    return this === o ||
      this.x === o.x && this.y === o.y
  }

  clone() {
    return new Vec2(this.x, this.y)
  }
}

Vec2.ORIGO = new Vec2(0, 0)
Vec2.INF = new Vec2(Infinity, Infinity)

// line ina twod space
export class Line2 {
  a: Vec2;
  b: Vec2;
  constructor(a, b){
    this.a = a
    this.b = b
  }

  centerPoint() {
    return this.a.add(this.b).scale(0.5)
  }

  dir() {
    return this.b.sub(this.a).norm()
  }

  len() {
    return this.a.dist(this.b)
  }

  intersects(l2) {
    const s1x = this.b.x - this.a.x
    const s1y = this.b.y - this.a.y
    const s2x = l2.b.x - l2.a.x
    const s2y = l2.b.y - l2.a.y

    const s = (-s1y * (this.a.x - l2.a.x) + s1x * (this.a.y - l2.a.y)) / (-s2x * s1y + s1x * s2y)
    const t = ( s2x * (this.a.y - l2.a.y) - s2y * (this.a.x - l2.a.x)) / (-s2x * s1y + s1x * s2y)

    const eps = 0.00001
    return (0 < (s - eps) && (s + eps) < 1) && (0 < (t - eps) && (t + eps) < 1)
  }

  closestTo(x)  {
    const v = this.dir()
    const s = x.dot(v) / v.dot(v)
    const l = this.len()

    if(s >= this.len()) {
      return this.b
    }

    if(s <= 0) {
      return this.a
    }

    return v.scale(x.dot(v) / v.dot(v)).add(this.a)
  }
}

export class Polygon {
  points: Vec2[];
  constructor(points) {
    this.points = points
    this.interior = [] // holes
  }

  sides(): Line2[] {
    return this.points.map((p1, i, ps) => new Line2(p1, ps[(i+1) % ps.length]))
  }

  addHole(polygon) {
    if(!this.containsPolygon(polygon)) {
      throw Error('Trying to add interior polygon that is not contained in this')
    }

    this.interior = this.interior.concat(polygon)
  }

  containsPolygon(poly) {
    // this polygon contains `poly` when all of polys vertices are
    // interior of this
    return poly.points.every((vert) => this.contains(vert))
  }

  flat(): number[] {
    return this.points.reduce((acc, el) => acc.concat([el.x, el.y]), [])
  }

  contains(test: Vec2): boolean {
    const EPS = 0.1

    // picked up at http://gamedev.stackexchange.com/questions/31741/adding-tolerance-to-a-point-in-polygon-test
    let oldPoint = this.points[this.points.length - 1]
    let oldSqDist = oldPoint.distSq(test)
    let inside = false

    let left = null
    let right = null

    for (let i=0 ; i < this.points.length; i++) {
      let newPoint = this.points[i]
      let newSqDist = newPoint.distSq(test)

      if (oldSqDist + newSqDist + 2 * Math.sqrt(oldSqDist * newSqDist) -
          newPoint.distSq(oldPoint) < EPS) {
        return true
      }

      if (newPoint.x > oldPoint.x) {
        left = oldPoint
        right = newPoint
      } else {
        left = newPoint
        right = oldPoint
      }

      if ((newPoint.x < test.x) == (test.x <= oldPoint.x)
          && (test.y-left.y) * (right.x-left.x)
          < (right.y-left.y) * (test.x-left.x) ) {
        inside = !inside
      }

      oldPoint = newPoint
      oldSqDist = newSqDist
    }

    return inside || this.points.some(p => p.equals(test)) &&
      !this.interior.some(hole => hole.contains(test))
  }

  // todo: weird return type
  nearestInside(point: Vec2): [Vec2, number] {
    if(this.contains(point)) return [point, -1]

    let nearest = Vec2.INF
    let neighbourIndex = -1
    this.points.forEach((p1, i, ps) => {
      const p2 = ps[(i+1) % ps.length]
      const near = new Line2(p1, p2).closestTo(point.sub(p1))
      if(near.dist(point) < nearest.dist(point)) {
        nearest = near
        neighbourIndex = i
      }
    })

    return [nearest, neighbourIndex]
  }
}
