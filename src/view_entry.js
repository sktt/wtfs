import Rx from 'rx-dom'
import PIXI from 'pixi.js'

import {obsRenderer, rootDOMNode} from './renderer'
import obsTick from './ticker'
import Scene from './scene'
import config from './config'

const sceneData = {
  world: {
    pos: [0, 0]
  },
  bg: {
    width: config.size.x,
    height: config.size.y,
    asset: 'test',
    scale: 1,
    tiling: {
      scale: 0.3
    }
  },
  assets: {
    test: './t.jpg', //'./test.jpg',
    monsters: './monsters-32x32.png'
  },
  walkable: [
    [199, 689], [2, 731], [3, 758],
    [641, 788], [582, 700], [605, 617],
    [844, 628], [829, 595], [516, 601],
    [488, 645], [438, 694], [365, 749],
    [206, 732] ],
  walkbehind: {
    bounds: [
      [626, 612], [604, 608], [602, 590],
      [590, 584], [588, 554], [556, 548],
      [554, 512], [546, 506], [548, 500],
      [554, 500], [558, 474], [836, 460],
      [842, 630], [626, 680] ],
    holes: [
      [ [652, 538], [652, 520], [656, 516],
        [672, 516], [670, 538]
      ], [
        [688, 538], [688, 516], [706, 514],
        [706, 538]
      ], [
        [568, 536], [568, 516], [590, 514],
        [588, 536]
      ]
    ]
  },
  mainChar: {
    spritesheet: {
      asset: 'monsters',
      anim: {
        down: {
          startFrame: [0, 1],
          width: 32,
          height: 32,
          frames: 3
        },
        right: {
          startFrame: [3, 1],
          width: 32,
          height: 32,
          frames: 3
        },
        up: {
          startFrame: [6, 1],
          width: 32,
          height: 32,
          frames: 3
        },
        left: {
          startFrame: [9, 1],
          width: 32,
          height: 32,
          frames: 3
        },
        idle: {
          startFrame: [1,1],
          width: 32,
          height: 32,
          frames: 1
        }
      }
    },
    pos: [150, 750],
    scale: 3
  }
}

const l = PIXI.loader
Object.keys(sceneData.assets).forEach(
  key => l.add(key, sceneData.assets[key])
)

const obsResources = Rx.Observable
  .fromCallback(l.load, l, (_, resources) => resources)()

obsRenderer.subscribe(renderer => {
  document.body.appendChild(renderer.view)
})

const obsResize = Rx.Observable
  .merge(
    Rx.Observable.just(),
    Rx.Observable.fromEvent(window, 'resize')
  )
  .map(() => [window.innerWidth, window.innerHeight])


const obsScene = obsResources
  .map(resources => new Scene(resources, config.size, sceneData))

let myScene = null
obsScene.subscribe(scene => {
  myScene = scene
  window.sss = scene
})

Rx.Observable
  .combineLatest(obsRenderer, obsTick, obsResize)
  .subscribe(([renderer, dt, dims]) => {
    if(myScene) {
      myScene.scale(dims)
      myScene.update(dt)
      renderer.render(myScene.stage)
    }
  })
