import PIXI from 'pixi.js'
import Rx from 'rx-dom'
import config from './config'
export const obsRenderer = Rx.Observable.just(
  new PIXI.WebGLRenderer(config.size.x, config.size.y, {
    antialias: true
  })
)

obsRenderer.subscribe((r) => {
  r.plugins.interaction.destroy()
  delete r.plugins.interaction
})

export const rootDOMNode = obsRenderer.map((renderer) => renderer.view)
