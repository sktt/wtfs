import Rx from 'rx-dom'
import reactRoot from './react_root'
import {Vec2} from '../algebra'

import Editor from './editor'

// This moudle assumes that DOM is ready when first subscribers
// add added since they should come from react components
export const scrollPos = Rx.Observable.just().merge(
  Rx.Observable.fromEvent(window, 'scroll').debounce(16)
).map(
  _ => ({x: window.scrollX, y: window.scrollY})
)

export const mousemove = reactRoot
  .flatMap(n => Rx.DOM.mousemove(n))
  .debounce(10)
  .combineLatest(scrollPos)
  .map(
    ([e, scroll]) => new Vec2(
      (e.clientX + scroll.x) / Editor.SCALE,
      (e.clientY + scroll.y) / Editor.SCALE
    )
  )
