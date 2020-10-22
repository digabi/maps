import { JSDOM } from 'jsdom'
import { assert } from 'chai'
import { createWorldMap, createTerrainMap } from '../src'

describe('index.js', () => {
  let bodyElement: HTMLElement, document: Document, debugKeyPressEvent: KeyboardEvent

  beforeEach(() => {
    const dom = new JSDOM('<!DOCTYPE html><html><head></head><body>test</body></html>')
    document = dom.window.document
    bodyElement = document.querySelector('body')!
    debugKeyPressEvent = new KeyboardEvent('keypress', { key: 'D', shiftKey: true })
  })

  describe('createWorldMap', () => {
    it('renders', () => {
      createWorldMap({
        container: bodyElement,
        mapUrl: 'dummy',
        attribution: 'test',
      })
      assert.isNotNull(document.querySelector('.leaflet-pane'))
    })

    it('supports debug mode', () => {
      createWorldMap({
        container: bodyElement,
        mapUrl: 'dummy',
        attribution: 'test',
      })
      assert.isNull(document.querySelector('.debug-tile'))
      bodyElement.dispatchEvent(debugKeyPressEvent)
      assert.isNotNull(document.querySelector('.debug-tile'))
      bodyElement.dispatchEvent(debugKeyPressEvent)
      assert.isNull(document.querySelector('.debug-tile'))
    })
  })

  describe('createTerrainMap', () => {
    it('renders', () => {
      createTerrainMap({
        container: bodyElement,
        mapUrl: 'dummy',
        attribution: 'test',
      })
      assert.isNotNull(document.querySelector('.leaflet-pane'))
    })

    it('supports debug mode', () => {
      createTerrainMap({
        container: bodyElement,
        mapUrl: 'dummy',
        attribution: 'test',
      })
      assert.isNull(document.querySelector('.debug-tile'))
      bodyElement.dispatchEvent(debugKeyPressEvent)
      assert.isNotNull(document.querySelector('.debug-tile'))
      bodyElement.dispatchEvent(debugKeyPressEvent)
      assert.isNull(document.querySelector('.debug-tile'))
    })
  })
})
