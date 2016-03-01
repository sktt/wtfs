import createScene from './view/view_entry'
import createEditor from './levdev/main'

//import './levdev'
import config from './config'
import State from './state'

State.subscribe(state => createEditor(state))

