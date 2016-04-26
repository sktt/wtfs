'use strict'
import Rx from 'rx'
import reactRoot from './react_root'
import {Vec2} from '../algebra'

import Editor from './editor'

/**
 * -----------------------------------------------------------------------------
 * Interaction
 * -----------------------------------------------------------------------------
 *
 * This moudle assumes that DOM is ready when first subscribers
 * add added since they should come from react components
 */

export const KEY_CODE = {
  'meta': 18 // aka alt
}

/**
 * Transform mouse x, y to game scene position
 */
const transformMouse = ([e, scroll]) => new Vec2(
  (e.clientX + scroll.x) / Editor.SCALE,
  (e.clientY + scroll.y) / Editor.SCALE
)


/**
 * Emits the scroll position, debounced to save some resoucres
 * i guess the editor doesn't need to be so instant.
 */
const scrollPos = Rx.Observable.just().merge(
  Rx.Observable.fromEvent(window, 'scroll').debounce(16)
).map(
  _ => ({x: window.scrollX, y: window.scrollY})
)

/**
 * Filter a keyboard event that equals the key code, `which`
 */
const filterKey = which => e => e.which === which

/**
 * Emit mouse positon when moving, scene transformed coords
 */
export const mousemove = reactRoot
  .flatMap(n => Rx.Observable.fromEvent(n, 'mousemove'))
  .debounce(10)
  .combineLatest(scrollPos)
  .map(transformMouse)

/**
 * Emit mouse on mouseup, scene transformed coords
 */
export const mouseup = reactRoot
  .flatMap(n => Rx.Observable.fromEvent(n, 'mouseup'))
  .combineLatest(scrollPos)
  .map(transformMouse)

/**
 * Emit mouse on mousedown, scene transformed coords
 */
export const mousedown = reactRoot
  .flatMap(n => Rx.Observable.fromEvent(n, 'mousedown'))
  .combineLatest(scrollPos)
  .map(transformMouse)

/**
 * Emit keyup for a key code
 */
export const keyup = which => Rx.Observable.fromEvent(window, 'keyup')
  .filter(filterKey(which))

/**
 * Emit keydown for a key code
 */
export const keydown = which => Rx.Observable.fromEvent(window, 'keydown')
  .filter(filterKey(which))

/**
 * emit on meta key down
 */
const metadown = keydown(KEY_CODE.meta)

/**
 * emit on meta key up
 */
const metaup = keyup(KEY_CODE.meta)

/**
 * emit from obs when meta is pressed
 */
const whenMetaDown = obs => metadown.flatMap(obs.takeUntil(metaup))

/**
 * emit from obs when meta is released
 */
const whenMetaUp = obs => Rx.Observable.merge(
  obs.takeUntil(metadown),
  metaup.flatMap(
    obs.takeUntil(metadown)
  )
)

/**
 * emit on mousemove when meta is pressed
 */
export const mousemoveMeta = whenMetaDown(mousemove)

/**
 * emit on mouseup when meta is pressed
 */
export const mouseupMeta = whenMetaDown(mouseup)

/**
 * emit on mousemove when meta is released
 */
export const mousemoveNoMeta = whenMetaUp(mousemove)

/**
 * emit on mouseup when meta is released
 */
export const mouseupNoMeta = whenMetaUp(mouseup)

