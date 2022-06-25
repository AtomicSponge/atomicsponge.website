/*
 * Animated background that displays prime wheels.
 * Inspired by the 3Blue1Brown YouTube series:
 * https://www.youtube.com/watch?v=EK32jo7i5LQ
 *
 * Filename:  primeWheel.js
 * By:  Matthew Evans
 *      https://www.wtfsystems.net/
 * Version:  062522
 *
 * Copyright (c) 2020-2022 Matthew Evans - See LICENSE.md
 *
 */

/**
 * Prime Wheel class
 */
class primeWheel {
    static #bg_color = '#000000'               //  Background color
    static #max_wheels = 5                     //  Maximum number of running wheels
    static #canvas_name = 'primewheel_canvas'  //  Target draw canvas
    static #start_called = false               //  Track if start function was called
    static #ctx = null                         //  2d drawing contex
    static #canvas = null                      //  Canvas to draw to
    static #center_x = 0                       //  Center X of canvas
    static #center_y = 0                       //  Center Y of canvas
    static #wheels = []                        //  Array of prime wheels

    /**
     * Initialize
     */
    static {
        this.#canvas = document.getElementById(this.#canvas_name)
        //  Make sure the canvas element exists
        if(this.#canvas == null || this.#canvas == undefined) {
            console.log(`error`)
        }
        this.#ctx = this.#canvas.getContext('2d')

        //  Make the canvas fit the screen
        this.#canvas.width = window.innerWidth
        this.#canvas.height = window.innerHeight
        //  Calculate center position in the canvas
        this.#center_x = this.#ctx.canvas.width / 2
        this.#center_y = this.#ctx.canvas.height / 2

        //  Clear the canvas
        this.#ctx.fillStyle = this.#bg_color
        this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height)

        this.#start_called = false  //  Allow start to be called
    }

    /** *** Public functions *** **/
    /** *** Getters *** **/
    /**
     * @prop {Number} num_wheels Number of prime wheels
     */
    static get num_wheels() { return this.#wheels.length }

    /** *** Setters *** **/
    /**
     * 
     */
    static set bgColor(color) {
        this.#bg_color = color
    }

    /**
     * 
     */
    static set maxWheels(newNum) {
        if(!this.#start_called) this.#max_wheels = newNum
    }

    /**
     * Add a new prime wheel.
     * @param {Object} wheelData 
     */
    static set add(wheelData) {
        if(this.num_wheels < this.#max_wheels) {
            wheelData = wheelData || {}

            wheelData.offset_x = wheelData.offset_x || 0
            wheelData.offset_y = wheelData.offset_y || 0
            wheelData.random_offset = wheelData.random_offset || false
            wheelData.scale = wheelData.scale || 1
            wheelData.speed = wheelData.speed || 5
            wheelData.color = wheelData.color || '#0000FF'
            wheelData.size =  wheelData.size || '8px'
            wheelData.font =  wheelData.font || 'Arial'
            wheelData.last_prime = 2
            wheelData.done = false

            if(wheelData.random_offset) wheelData = this.#setOffset(wheelData)

            this.#wheels.push(wheelData)
        } else console.log(`Max number of wheels reached.`)
    }

    /**
     * Remove a prime wheel
     * @param {Number} IDX Index to remove
     */
    static remove(IDX) {
        if(IDX > this.num_wheels - 1 || IDX < 0) console.log(`Wheel index out of range.`)
        else delete this.#wheels[IDX]
        this.#wheels = this.#wheels.filter(wheel => wheel !== null)
    }

    /**
     * Start the effect.
     */
    static start() {
        if(this.#start_called) {
            console.log(`Prime wheel effect already running`)
            return
        }
        this.#start_called = true
        if(true) console.log('stuff')
        if(true) {
            this.#canvas.style.display = 'block'
            window.requestAnimationFrame(this.#renderer.start)
            console.log(`Running prime wheel effect`)
        } else {
            console.log(`Prime wheel effect disabled by setting`)
            this.#canvas.style.display = 'none'
        }
    }

    /**
     * 
     */
    static end() { 
        this.#renderer.stop = true
        this.#canvas.style.display = 'none'
        this.#start_called = false
        console.log(`Prime wheel stopped.`)
    }

    /**
     * Pause effect
     */
    static pause() {
        this.#renderer.pause ? console.log(`Resuming prime wheel`) : console.log(`Pausing prime wheel`)
        this.#renderer.pause ? this.#renderer.pause = false : this.#renderer.pause = true
    }

    /**
     * 
     */
    static toggle() {
        this.#start_called ? this.end() : this.start()
    }

    /**
     * Resets the effect
     */
    static reset() {
        console.log(`Resetting prime wheel effect`)
        this.#ctx = this.#canvas.getContext('2d')
        this.#ctx.fillStyle = this.#bg_color
        this.#ctx.fillRect(0, 0, this.#ctx.canvas.width, this.#ctx.canvas.height)
        this.#wheels.forEach(wheel => {
            if(wheel.random_offset) wheel = this.#setOffset(wheel)
            wheel.last_prime = 2
            wheel.done = false
        })
    }

    /**
     * Set the color of a prime wheel.
     * @param {String} color Color to set.
     * @param {Number} IDX Prime wheel array index.
     */
    static setColor(color, IDX) {
        if(IDX > this.num_wheels - 1 || IDX < 0) console.log(`Wheel index out of range.`)
        else this.#wheels[IDX].color = color
    }

    /** *** Private functions *** **/
    /**
     * Generate a random x,y offset for drawing the wheel.
     * @param {Object} wheel The wheel being updated.
     * @returns {Object} Modified wheel object.
     */
    static #setOffset(wheel) {
        wheel.offset_x = Math.floor(Math.random() * (this.#center_x * 2 / 3) + 1)
        wheel.offset_x = wheel.offset_x * (Math.random() < 0.5 ? -1 : 1)
        wheel.offset_y = Math.floor(Math.random() * (this.#center_y * 2 / 3) + 1)
        wheel.offset_y = wheel.offset_y * (Math.random() < 0.5 ? -1 : 1)
        return wheel
    }

    /**
     * Resize canvas - WIP
     */
    static #resize() {
        //  Make the canvas fit the screen
        this.#canvas.width = window.innerWidth
        this.#canvas.height = window.innerHeight
        //  Calculate center position in the canvas
        this.#center_x = this.#ctx.canvas.width / 2
        this.#center_y = this.#ctx.canvas.height / 2
        this.reset()
    }

    /**
     * Check if a number is prime.
     * @param {Number} num Number to check.
     * @returns 
     */
    static #isPrime(num) {
        for(var i = 2; i < num; i++) {
            if(num % i == 0) return false
        }
        return true
    }

    /**
     * Renderer
     */
    static #renderer = {
        pause: false,
        stop: false,

        /**
         * Update a wheel animation.
         * @param {Object} wheel The wheel being drawn.
         */
        animate: (wheel) => {
            //  Prime number found, draw it using cartesian coordinates
            if(this.#isPrime(wheel.last_prime)) {
                this.#ctx.font = wheel.font + " " + wheel.size
                this.#ctx.fillStyle = wheel.color
                this.#ctx.fillText(
                    wheel.last_prime,
                    (this.#center_x + wheel.offset_x) + (wheel.last_prime * Math.cos(wheel.last_prime)),
                    (this.#center_y + wheel.offset_y) - (wheel.last_prime * Math.sin(wheel.last_prime))
                )
            }

            wheel.last_prime++  //  Increment counter to check for next prime

            //  Once the wheel reaches (1400 * SCALE) flag as done
            if(wheel.last_prime > 1400 * wheel.scale) wheel.done = true
        },

        /**
         * Rendering process
         * @param {DOMHighResTimeStamp} timestamp Time in milliseconds.
         */
        run: (timestamp) => {
            var status = []
            if(!this.#renderer.pause) {
                this.#wheels.forEach(wheel => {
                    if(!wheel.done) {
                        this.#renderer.animate(wheel)
                        status.push(false)
                    } else status.push(true)
                })
                if(this.num_wheels !== 0 && status.reduce((a, b) => { return (a === b) ? a : NaN }))
                    this.reset()
            }
            !this.#renderer.stop && window.requestAnimationFrame(this.#renderer.run)
        },

        /**
         * Start the render process
         */
        start: () => {
            this.#renderer.stop = false
            window.requestAnimationFrame(this.#renderer.run)
        }
    }
}