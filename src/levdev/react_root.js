import Rx from 'rx'

export default Rx.Observable.defer(
  _ => {
    let reactMain = document.querySelector('#reactMain')
    if(!reactMain) {
      reactMain = document.createElement('div')
      reactMain.id = 'reactMain'
      reactMain.style.height = '100%'
      document.body.appendChild(reactMain)
    }
    return Rx.Observable.just(reactMain)
  }
)
