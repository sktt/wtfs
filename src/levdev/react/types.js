import {PropTypes as T} from 'react'

const polygon = T.shape({
  bounds: T.arrayOf(T.arrayOf(T.number)),
  holes: T.arrayOf(T.arrayOf(T.arrayOf(T.number)))
})

const data = T.shape({
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

  walkbehind: polygon,
  walkable: polygon
})

export default  {
  data, polygon
}
