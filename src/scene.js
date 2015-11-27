/* @flow */
import PIXI from 'pixi.js'
import {dijkstra, VisibilityGraph, Node} from './graph'
import {Polygon, Vec2, Line2} from './algebra'
import IA from './ia'
import earcut from 'earcut'
import Character from './character'
import Camera from './camera'

function makeMainChar(resources, data) {
  const mainCharBase = resources[data.spritesheet.asset].texture
  const mainCharAnims = Object.keys(data.spritesheet.anim).reduce((acc, key, i) => {
    let anim = data.spritesheet.anim[key]
    acc[key] = []

    for (let i = 0; i < anim.frames; i ++) {
      let x = (anim.startFrame[0] + i) * anim.width
      let y = anim.startFrame[1] * anim.height
      let rect = new PIXI.Rectangle(x, y, anim.width, anim.height)
      let f = mainCharBase.clone()
      f.frame = rect
      acc[key].push(f)
    }
    return acc
  }, {})
  const mainCharSpr = new PIXI.Sprite(mainCharAnims.idle[0])
  mainCharSpr.position.set(data.pos[0], data.pos[1])
  mainCharSpr.scale.set(data.scale)
  mainCharSpr.anchor.set(0.5, 1)
  return new Character(mainCharSpr, mainCharAnims)
}

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

class WalkableArea {
  constructor(polygon) {
    // Surrounding the walkable area
    this.polygon = polygon
    // Visibilty graph to navigate
    this.visGraph = VisibilityGraph.fromPolygon(this.polygon)
  }

  draw(graphics) {
    graphics.drawPolygon(this.polygon.flat())
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

class WalkbehindArea {
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

export default class Scene {
  constructor (resources, size, sceneData) {
    this.size = size
    this.stage = new PIXI.Container()

    this.world = new PIXI.Container()
    this.world.position.x = sceneData.world.pos[0]
    this.world.position.y = sceneData.world.pos[1]

    if(sceneData.bg.tiling) {
      this.background = new PIXI.extras.TilingSprite(resources[sceneData.bg.asset].texture, sceneData.bg.width, sceneData.bg.height)
      this.background.tileScale.set(sceneData.bg.tiling.scale)
    } else {
      this.background = new PIXI.Sprite(resources[sceneData.bg.asset].texture)
    }

    this.background.scale.set(sceneData.bg.scale)

    this.walkable = new WalkableArea(new Polygon(sceneData.walkable.map(
      p => new Vec2(p[0], p[1])
    )))

    const walkbehindPoly = new Polygon(sceneData.walkbehind.bounds.map(
      p => new Vec2(p[0], p[1])
    ))

    sceneData.walkbehind.holes.forEach(
      h => walkbehindPoly.addHole(new Polygon(h.map(
        p => new Vec2(p[0], p[1])
      )))
    )
    this.walkbehind = new WalkbehindArea(this.background, walkbehindPoly)

    this.mainChar =  new Character()

    this.world.addChild(this.background)

    let g = new PIXI.Graphics()
    g.beginFill(0x00ff00, 0.6)
    this.world.addChild(this.walkable.draw(g))
    g.endFill()

    this.mainChar = makeMainChar(resources, sceneData.mainChar)

    this.world.addChild(this.mainChar.sprite)

    this.world.addChild(this.walkbehind.graphics)
    this.world.addChild(this.walkbehind.spr)

    // Camera has world so world is added to scene when camera is added
    this.camera = new Camera(this.world)
    this.stage.addChild(this.camera.container)

    // set up listeners
    const bgInteraction = new IA(this.background)

    const devWalkPath = new PIXI.Graphics()
    this.world.addChild(devWalkPath)

    bgInteraction.addListener('mousedown', (e) => {
      const click = e.getPos(this.world)
      const x = Math.floor(click.x)
      const y = Math.floor(click.y)
      const mousePos = new Vec2(x, y)
      const ps = this.walkable.polygon.points

      const toPos = this.walkable.polygon.nearestInside(new Vec2(x, y))
      const fromPos = this.walkable.polygon.nearestInside(this.mainChar.pos())

      const walkPath = this.walkable.findPath(
        new Node(fromPos),
        new Node(toPos)
      )

      this.mainChar.moveQueue = walkPath.slice(1).map(n => n.pos)
      this.mainChar.moveTarget = null

      // Dev
      if (walkPath.length) {
        let way = walkPath
        devWalkPath.clear()
        devWalkPath.lineStyle(2, 0xff0000, 1)
        for(let i = 0; i < way.length-1; i ++ ) {
          devWalkPath.moveTo(way[i].pos.x, way[i].pos.y)
          devWalkPath.lineTo(way[i+1].pos.x, way[i+1].pos.y)
        }
      }
    })

    // Dev, vis graph
    g = new PIXI.Graphics()
    g.lineStyle(1, 0x000000, 0.7)
    this.walkable.visGraph.draw(g)
    g.endFill()
    this.world.addChild(g)
  }
  update(dt) {
    this.mainChar.update(dt)
  }
  scale ([x, y]) {
    this.camera.container.scale.set(Math.min(1, Math.min(x / this.size.x, y / this.size.y)))
  }
}
