import createScene from './view/pixi_entry'

//import './levdev'
import config from './config'
import State from './state'

State.subscribe(state => createScene(state))
