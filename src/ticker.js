import Rx from 'rx-dom'

export default Rx.Observable.create(observer => {
  let requestId
  let startTime = Date.now()
  const callback = (currentTime) => {
    // If we have not been disposed, then request the next frame
    if (requestId) {
      requestId = window.requestAnimationFrame(callback)
    }

    observer.onNext(Math.max(0, currentTime - startTime))
    startTime = currentTime
  }

  requestId = window.requestAnimationFrame(callback)

  return () => {
    if (requestId) {
      let r = requestId
      requestId = undefined
      window.cancelAnimationFrame (r)
    }
  }
})
