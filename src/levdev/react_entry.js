import Rx from 'rx-dom'
import PIXI from 'pixi.js'

import config from '../config'

import Scene from '../view/scene'

import React from 'react'
import ReactDOM from 'react-dom'
import Editor from './editor'
import reactRoot from './react_root'

import common from '../common'

// keep any current subscription here and dispose when necessary
let subscription = null

export default sceneData => {
  document.body.style.backgroundColor = '#000'
  document.body.style.height = '100%'
  document.body.style.margin = '0'
  document.body.parentNode.style.height = '100%'

  const obsResources = common.create.resources(
    new PIXI.loaders.Loader(),
    sceneData.assets
  )

  if (subscription) {
    subscription.dispose()
  }

  subscription = Rx.Observable
    .combineLatest(reactRoot, obsResources)
    .subscribe(([reactRoot, resources]) => {
      ReactDOM.render(
        <Editor
          resources={resources}
          data={sceneData}
        />, reactRoot
      )
    })
}
