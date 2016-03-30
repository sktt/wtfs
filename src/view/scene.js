/* @flow */
import PIXI from 'pixi.js'
import {VisibilityGraph, Node} from '../graph'
import {Polygon, Vec2, Line2} from '../algebra'
import IA from '../ia'
import Character from './character'
import Camera from './camera'
import WalkableArea from './walkable_area'
import WalkbehindArea from './walkbehind_area'

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

    const walkablePoly = new Polygon(sceneData.walkable.bounds.map(Vec2.fromArray))
    sceneData.walkable.holes.forEach(
      h => walkablePoly.addHole(new Polygon(h.map(Vec2.fromArray)))
    )
    this.walkable = new WalkableArea(walkablePoly)

    const walkbehindPoly = new Polygon(sceneData.walkbehind.bounds.map(
      Vec2.fromArray
    ))
    sceneData.walkbehind.holes.forEach(
      h => walkbehindPoly.addHole(new Polygon(h.map(Vec2.fromArray)))
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
  initListeners() {
    if (this.disposables && this.disposables.length) {
      this.disposables.forEach(
        disposable => disposable.dispose()
      )
    }
    this.disposables = []

    // set up listeners
    const bgInteraction = new IA(this.background)

    this.devWalkPath = new PIXI.Graphics()
    this.world.addChild(this.devWalkPath)

    // addListener returns an unsubscribe function
    this.disposables.push(bgInteraction.addListener('mousedown', ::this.handleMouseDown))
    this.disposables.push(bgInteraction.addListener('mousemove', ::this.handleMouseMove))
  }

  handleMouseDown(e) {
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
      this.devWalkPath.clear()
      this.devWalkPath.lineStyle(2, 0xff0000, 1)
      for(let i = 0; i < way.length-1; i ++ ) {
        this.devWalkPath.moveTo(way[i].pos.x, way[i].pos.y)
        this.devWalkPath.lineTo(way[i+1].pos.x, way[i+1].pos.y)
      }
    }
  }

  handleMouseMove(e) {
    const click = e.getPos(this.world)
    const x = Math.floor(click.x)
    const y = Math.floor(click.y)
  }
}
