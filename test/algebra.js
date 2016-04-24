import test from 'tape'
import {SimplePolygon, Vec2} from '../src/algebra'

test('simple polygon area', (t) => {
  t.plan(2)
  const p = new SimplePolygon([
    new Vec2(0,0),
    new Vec2(0,10),
    new Vec2(10,10),
    new Vec2(10,0),
  ])

  t.equal(p.area(), -100, 'anti-clockwise winding => negative area')
  p.points.reverse()
  t.equal(p.area(), 100, 'clockwise winding => positive area')
})

test('polygon winding', (t) => {
  t.plan(2)
  const p = new SimplePolygon([
    new Vec2(0,0),
    new Vec2(0,10),
    new Vec2(10,10),
    new Vec2(10,0),
  ])

  t.notOk(p.isClockwise(), 'anti-clockwise')
  p.points.reverse()
  t.ok(p.isClockwise(), 'clockwise')
})
