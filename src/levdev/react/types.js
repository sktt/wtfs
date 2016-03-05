import {PropTypes as T} from 'react'

export const data = T.shape({
  world: T.shape({
    pos: T.arrayOf(
      T.number
    )
  }),

  bg: T.shape({
    scale: T.oneOfType([
      T.number,
      T.string
    ])
  }),

  walkable: T.arrayOf(T.arrayOf(T.number))
}).isRequired

