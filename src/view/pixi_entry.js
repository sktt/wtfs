import Rx from 'rx-dom'
import PIXI from 'pixi.js'

import obsRenderer from '../renderer'
import obsTick from '../ticker'
import config from '../config'

import Scene from './scene'

export default (sceneData) => {
  document.body.style.backgroundColor = '#000'
  document.body.style.display = 'flex'
  document.body.style.justifyContent = 'center'
  document.body.style.height = '100%'
  document.body.style.margin = '0'
  document.body.style.flexDirection = 'column'
  document.body.parentNode.style.height = '100%'
  const l = PIXI.loader
  Object.keys(sceneData.assets).forEach(
    key => l.add(key, sceneData.assets[key])
  )

  const obsResources = Rx.Observable
    .fromCallback(l.load, l, (_, resources) => resources)()

  const obsResize = Rx.Observable
    .merge(
      Rx.Observable.just(),
      Rx.Observable.fromEvent(window, 'resize')
    )
    .map(() => [window.innerWidth, window.innerHeight])

  obsRenderer.subscribe(renderer => {
    document.body.appendChild(renderer.view)
    obsResize.subscribe(([x, y]) => {
      renderer.view.style.height = `${config.size.y * (x / config.size.x)}px`
    })
  })

  const obsScene = obsResources
    .map(resources => new Scene(resources, config.size, sceneData))

  let myScene = null
  obsScene.subscribe(scene => {
    myScene = scene
    scene.initListeners()
  })

  Rx.Observable
    .combineLatest(obsRenderer, obsTick, obsResize)
    .subscribe(([renderer, dt, dims]) => {
      if(myScene) {
        myScene.update(dt)
        renderer.render(myScene.stage)
      }
    })
}
