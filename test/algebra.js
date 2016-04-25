import test from 'tape'
import {SimplePolygon, Polygon, Vec2} from '../src/algebra'

// -----------------------------------------------------------------------------
// SimplePolygon
// -----------------------------------------------------------------------------
test('SimplePolygon area', (t) => {
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

test('SimplePolygon winding', (t) => {
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

// -----------------------------------------------------------------------------
// Polygon
// -----------------------------------------------------------------------------
test('Polygon contains', (t) => {
  //t.plan(1)
  const bounds = new SimplePolygon([
    new Vec2(0,0),
    new Vec2(0,10),
    new Vec2(10,10),
    new Vec2(10,0),
  ])
  const polygon = new Polygon(bounds)

  polygon.addHole(new SimplePolygon([
    new Vec2(1,1),
    new Vec2(6,1),
    new Vec2(6,6),
    new Vec2(1,6),
  ]))

  t.ok(polygon.contains(Vec2.ORIGO), 'test edge')
  t.ok(polygon.contains(new Vec2(0.5, 0.5)), 'test inside')
  t.ok(polygon.contains(new Vec2(1, 1)), 'test hole edge')
  t.ok(polygon.contains(new Vec2(6, 6.0001)), 'test hole edge')
  t.notOk(polygon.contains(new Vec2(2, 2)), 'test in hole')
  t.notOk(polygon.contains(new Vec2(20, 2123)), 'test outside')
  t.end()
})
