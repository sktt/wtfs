import Animation from './animation'
import {Vec2} from './algebra'

export default class Character {
  moveQueue: Vec2[];
  constructor (sprite, animations) {
    this.sprite = sprite
    this.speed = 4
    this.direction = 0
    this.moveTarget = null
    this.moveQueue = []
    this.animations = animations
    this.animator = new Animation(this.sprite)
  }

  pos() {
    return new Vec2(this.sprite.position.x, this.sprite.position.y)
  }

  update(dt) {
    this.animator.tick(dt)
    if (this.moveQueue.length && !this.moveTarget) {
      this.moveTarget = this.moveQueue.shift()
      this.animator.paused = false
      let p0 = this.sprite.position
      let p1 = this.moveTarget
      const dx = p1.x - p0.x
      const dy = p1.y - p0.y
      this.dir = Math.atan2(dy, dx)
      // Dir should set animtion loop..
      const d = this.dir/Math.PI
      let loop = this.animations.down
      if(-1/4 < d && d <= 1/4) {
        loop = this.animations.right
      }
      if(1/4 < d && d <= 3/4) {
        loop = this.animations.down
      }
      if((3/4 < d && d <= 1) || (-1 < d && d <= -3/4)) {
        loop = this.animations.left
      }
      if(-3/4 < d && d <= -1/4) {
        loop = this.animations.up
      }
      this.animator.playLoop(loop)
    }

    if (this.moveTarget) {
      if (this.pos().dist(this.moveTarget) < this.speed) {
        this.sprite.position.x = this.moveTarget.x
        this.sprite.position.y = this.moveTarget.y
        this.moveTarget = null
        this.animator.paused = true
      } else {
        let newPos = this.sprite.position.clone()
        newPos.x += this.speed * Math.cos(this.dir)
        newPos.y += this.speed * Math.sin(this.dir)
        this.sprite.position = newPos
      }
    }
  }
}
