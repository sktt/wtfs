import Rx from 'rx-dom'
import PIXI from 'pixi.js'

import config from '../config'

import Scene from '../view/scene'

import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './editor'
import reactRoot from './react_root'

const obsResize = Rx.Observable.merge(
  Rx.Observable.just(),
  Rx.Observable.fromEvent(window, 'resize')
)
.map(() => [window.innerWidth, window.innerHeight])

// keep any current subscription here and dispose when necessary
let subscription = null

export default sceneData => {
  document.body.style.backgroundColor = '#000'
  document.body.style.height = '100%'
  document.body.style.margin = '0'
  document.body.parentNode.style.height = '100%'

  const l = new PIXI.loaders.Loader()
  Object.keys(sceneData.assets).forEach(
    key => l.add(key, sceneData.assets[key])
  )

  const obsResources = Rx.Observable
    .fromCallback(l.load, l, (_, resources) => resources)()

  const obsScene = obsResources
    .map(resources => new Scene(resources, config.size, sceneData))

  if(subscription) {
    subscription.dispose()
  }

  subscription = Rx.Observable
    .combineLatest(reactRoot, obsScene, obsResize)
    .subscribe(([reactRoot, scene, dims]) => {
      ReactDOM.render(
        <Editor dims={dims}
          data={sceneData}
          scene={scene} />, reactRoot)
    })
}
