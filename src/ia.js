/*@flow*/
import Rx from 'rx-dom'

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

var rootDOMNode = Rx.Observable.create(observer => {
  const c = document.querySelector('canvas')
  if(c) {
    observer.onNext(c)
  } else {
    observer.onError(new Error('not entered'))
  }
  observer.onCompleted()
  return () => console.log('unsub')
})
.catch(
  _ => Rx.DOM.fromMutationObserver(document.body, {
    attributes: true,
    childList: true,
    characterData: true,
  }).map(
    records => records.reduce(
      (acc, el) => acc || el.addedNodes && Array.prototype.concat.apply([], el.addedNodes).find(
        (el) => el.nodeName === 'CANVAS'
      ), null
    )
  )
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
