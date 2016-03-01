import createEditor from './react_entry'

import config from '../config'
import State from '../state'

State.subscribe(state => createEditor(state))

