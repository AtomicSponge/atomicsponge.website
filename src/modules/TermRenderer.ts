/**
 * 
 * @author Matthew Evans
 * @module atomicsponge.website
 * @copyright MIT see LICENSE.md
 * 
 */

import { TermError } from './TermError.js'

export class TermRenderer {
  /** Flag if the renderer was initialized */
  static #initialized:boolean = false
  /** Flag if the renderer is ready to run */
  static #ready:boolean = false
  /** Reference to the canvas ID */
  static #canvas_name:string = '___termrenderer_canvas_id'
  /** Reference to the canvas element */
  static #canvas:HTMLCanvasElement
  /** Reference to the drawing context */
  static #ctx:CanvasRenderingContext2D
  /** Reference to the rendering process */
  static #renderProc:number
  /** Rendering function */
  static #renderFunc:FrameRequestCallback
  /** Background color */
  static #bgColor:string = 'rgba(0, 0, 0, 0.66)'

  constructor() { return false }  //  Don't allow direct construction

  /** Set up the TermRenderer */
  static initialize = ():void => {
    if(TermRenderer.#initialized)
      throw new TermError('TermRenderer already initialized!', TermRenderer.initialize)
    //  Append canvas css styling
    const cssElem = document.createElement('style')
    cssElem.innerText = `
      #${TermRenderer.#canvas_name} {
        pointer-events: none;
        position: fixed;
        margin: 0;
        padding: 0;
        background-color: ${TermRenderer.#bgColor};
      }`
    document.body.appendChild(cssElem)

    //  Prepend canvas html
    const canvas = document.createElement('canvas')
    canvas.setAttribute('id', TermRenderer.#canvas_name)
    canvas.setAttribute('width', `${document.documentElement.clientWidth}`)
    canvas.setAttribute('height', `${document.documentElement.clientHeight}`)
    document.body.prepend(canvas)

    TermRenderer.#canvas = <HTMLCanvasElement>document.getElementById(TermRenderer.#canvas_name)
    TermRenderer.#canvas.style.display = 'none'
    TermRenderer.#ctx = <CanvasRenderingContext2D>TermRenderer.#canvas.getContext("2d")
    TermRenderer.#renderProc = 0

    //  Watch for resize, scale & redraw canvas
    const observer = new ResizeObserver(() => {
      const temp = TermRenderer.#ctx.getImageData(0, 0, TermRenderer.#canvas.width, TermRenderer.#canvas.height)
      TermRenderer.#canvas.width = document.documentElement.clientWidth
      TermRenderer.#canvas.height = document.documentElement.clientHeight
      TermRenderer.#ctx.putImageData(temp, 0, 0, 0, 0, TermRenderer.#canvas.width, TermRenderer.#canvas.height)
    })
    observer.observe(document.documentElement)

    TermRenderer.#initialized = true
  }

  /**
   * Set the renderer's animation function
   * @param func Animation function
   */
  static setRenderer = (func:FrameRequestCallback):void => {
    if(!(func instanceof Function))
      throw new TermError('Provided animation is not a function!', TermRenderer.setRenderer)
    TermRenderer.#renderFunc = func
    TermRenderer.#ready = true
  }

  /** Start the renderer */
  static start = ():void => {
    if(!TermRenderer.isReady) return  //  Prevent running if an animation function was not set
    if(TermRenderer.isRunning) TermRenderer.stop()
    TermRenderer.clear()
    TermRenderer.show()
    TermRenderer.#renderProc = window.requestAnimationFrame(TermRenderer.#animate)
  }

  /**
   * Perform rendering
   * Calls the provided animation function
   * @param timeStamp Time the last frame ended its rendering
   */
  static #animate(timeStamp:DOMHighResTimeStamp):void {
    TermRenderer.#renderFunc(timeStamp)
    TermRenderer.#renderProc = requestAnimationFrame(TermRenderer.#animate)
  }

  /** Stop the renderer */
  static stop = ():void => {
    TermRenderer.hide()
    window.cancelAnimationFrame(TermRenderer.#renderProc)
    TermRenderer.#renderProc = 0
  }

  /** Clear the renderer */
  static clear = ():void => {
    TermRenderer.#ctx.clearRect(0, 0, TermRenderer.width, TermRenderer.height)
  }

  /** Show the renderer */
  static show = ():void => {
    TermRenderer.#canvas.style.display = 'block'
  }

  /** Hide the renderer */
  static hide = ():void => {
    TermRenderer.#canvas.style.display = 'none'
  }

  /**
   * Check if the renderer is ready to start
   * This requires both initilization to be ran and a render function to be set
   * @returns If the renderer is ready to run
   */
  static get isReady():boolean {
    return TermRenderer.#initialized && TermRenderer.#ready
  }

  /**
   * Check if the renderer is running
   * @retunrs True if it is, false if not
   */
  static get isRunning():boolean {
    if(TermRenderer.#renderProc === 0) return false
    return true
  }

  /**
   * Get the renderer's drawing context
   * @retunrs The drawing context
   */
  static get ctx():CanvasRenderingContext2D { return TermRenderer.#ctx }

  /**
   * Get the renderer's width
   * @retunrs Width in pixels
   */
  static get width():number { return TermRenderer.#canvas.width }

  /**
   * Get the renderer's height
   * @retunrs Height in pixels
   */
  static get height():number { return TermRenderer.#canvas.height }
}
