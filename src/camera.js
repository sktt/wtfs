import {Vec2} from './algebra'
export default class Camera {
  moveTarget: ?Vec2;
  constructor(world) {
    this.world = world
    this.container = new PIXI.Container()
    this.container.addChild(world)
    this.speed=1
    this.animating = false
    this.moveTarget = null
  }

  update(dt) {
    if (this.moveTarget) {
      let p0 = this.world.position
      let p1 = this.moveTarget
      const dx = p1.x - p0.x
      const dy = p1.y - p0.y
      this.dir = Math.atan2(dy, dx)
      if (this.pos().dist(this.moveTarget) < this.speed) {
        this.world.position.x = this.moveTarget.x
        this.world.position.y = this.moveTarget.y
        this.moveTarget = null
      } else {
        let newPos = this.world.position.clone()
        newPos.x += this.speed * Math.cos(this.dir)
        newPos.y += this.speed * Math.sin(this.dir)
        this.world.position = newPos
      }
    }
  }

  moveTarget(vec) {
    this.moveTarget = vec.scale(-1)
  }

  pos() {
    return new Vec2(this.world.position.x, this.world.position.y)
  }

  serialize() {
    return JSON.serialize({
      pos: [this.world.position.x, this.world.position.y],

      camera: {
        dims: [this.container.width, this.container.height]
      }
    })
  }

  //static fromSerialized(s) {
    //const d = new PIXI.DisplayObjectContainer()
    // Camera does not deserialize children.
    //return new Camera(d)
  //}
}
