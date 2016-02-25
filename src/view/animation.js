export default class Animation {
  constructor(sprite, fps = 25) {
    this.frames = []
    this.frame = 0
    this.fps = fps
    this.paused = false
    this.time = 0
    this.sprite = sprite
  }

  playLoop(textures) {
    this.time = 0
    this.frame = 0
    this.frames = textures
  }

  tick(dt) {
    if(this.paused || !this.frames.length) return

    // [ms]
    const nextT = (this.time + dt) % (1000/this.fps)

    // can run at different fps than
    if (nextT < this.time) {
      this.frame = (this.frame+1) % this.frames.length
      this.sprite.texture = this.frames[this.frame]
    }

    this.time = nextT
  }
}
