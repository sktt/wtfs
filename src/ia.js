/*@flow*/
import Rx from 'rx-dom'

const toSyntheticEvent = function(e) {
  const root = e.target;
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

// todo: why added events to this emitted canvas
// not working ????
// because its a cold obs
const enteringCanvas =
  Rx.DOM.fromMutationObserver(document.body, {
    childList: true,
  }).map(
    records => records.filter(
      r => r.addedNodes && r.addedNodes.length
    ).reduce(
      (acc, rec) => acc.concat.apply(acc, rec.addedNodes), []
    ).find(
      el => el.nodeName === 'CANVAS'
    )
  )

var rootDOMNode = Rx.Observable.defer(
  () => Rx.Observable.just(document.querySelector('canvas'))
)
.filter(x => x)
.take(1)

const obs = {
  mousedown: rootDOMNode.flatMap(
    (view) => Rx.DOM.mousedown(view)
  ).map(toSyntheticEvent),

  mousemove: rootDOMNode.flatMap(
    (view) => Rx.DOM.mousemove(view)
  ).map(toSyntheticEvent)
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
        // getPos relative to dispObj
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
