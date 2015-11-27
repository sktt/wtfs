/*@flow*/
import Rx from 'rx-dom'
import {rootDOMNode} from './renderer'

const toSyntheticEvent = function(e) {
  const root = e.target;
  // Warning REFLOW BITCHES!!!!
  const rect = root.getBoundingClientRect()
  if(!e.clientX) {
    console.error('I only know how to handle mouse events')
  }
  return {
    root,
    originalEvent: e,
    canvasX: (e.clientX - rect.left) * (root.width / rect.width),
    canvasY: (e.clientY - rect.top) * (root.height / rect.height)
  }
}

const mousedown = rootDOMNode
  .flatMap((view) => Rx.DOM.mousedown(view))
  .map(toSyntheticEvent)

const mousemove = rootDOMNode
  .flatMap((view) => Rx.DOM.mousemove(view))
  .map(toSyntheticEvent)

const obs = {
  mousedown,
  mousemove
}

export default class IM {
  constructor(displayObject) {
    this.displayObject = displayObject
  }
  addListener(evtName, handler) {
    return obs[evtName]
      .filter((e) => {
        if (this.displayObject.containsPoint) {
          return this.displayObject.containsPoint({
            x: e.canvasX,
            y: e.canvasY
          })
        } else {
          console.log('dont know what to do', synEvt)
          return false
        }
      })
      .map((e) => {
        // like root container..
        e.getPos = (dispObj) => dispObj
          .worldTransform
          .applyInverse({
            x: e.canvasX,
            y: e.canvasY
          })
        return e
      })
      .subscribe(handler)
  }
}
