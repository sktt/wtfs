import Rx from 'rx-dom'
import PIXI from 'pixi.js'

import config from '../config'

import Scene from '../view/scene'

import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './editor'

const obsResize = Rx.Observable.merge(
  Rx.Observable.just(),
  Rx.Observable.fromEvent(window, 'resize')
)
.map(() => [window.innerWidth, window.innerHeight])

export default (sceneData) => {
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

  Rx.Observable
    .combineLatest(obsScene, obsResize)
    .subscribe(([scene, dims]) => {
      let reactMain = document.querySelector('#reactMain')
      if(!reactMain) {
        reactMain = document.createElement('div')
        reactMain.id = 'reactMain'
        reactMain.style.height = '100%'
        document.body.appendChild(reactMain)
      }
      ReactDOM.render(<Editor dims={dims} data={sceneData} scene={scene}/>, reactMain)
    })
}
