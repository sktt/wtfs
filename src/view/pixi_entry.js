import {Observable} from 'rx-dom'
import PIXI from 'pixi.js'

import config from '../config'
import Scene from './scene'
import common from '../common'

// just a namespace for observers
const obs = {}

const renderer = (function () {
  const r = new PIXI.WebGLRenderer(config.size.x, config.size.y, {
    antialias: true
  })
  r.plugins.interaction.destroy()
  delete r.plugins.interaction
  return r
}())

common.obs.domRoot.subscribe(body => {
  body.appendChild(renderer.view)
})

common.obs.resize.subscribe(([x, y]) => {
  renderer.view.style.height = `${config.size.y * (x / config.size.x)}px`
})

export default (sceneData) => {
  obs.resources = common.create.resources(PIXI.loader, sceneData.assets)
  obs.scene = obs.resources.map(resources => {
    const s = new Scene(resources, config.size, sceneData)
    s.initListeners()
    return s
  })
  .publish()
  .refCount()

  Observable.combineLatest(
    common.obs.tick,
    common.obs.resize,
    obs.scene
  ).subscribe(([dt, dims, scene]) => {
    scene.update(dt)
    renderer.render(scene.stage)
  })
}
