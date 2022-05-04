





import {
    PerspectiveCamera,
    Scene,
    WebGLRenderer
} from './three.module.js'

export class Three_Context {
    constructor(
        parent = document.body
    ) {
        //scene
        this.scene = new Scene()

        //canvas
        this.canvas = document.createElement("canvas")

        // renderer
        this.renderer = new WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            // preserveDrawingBuffer: false,
            // format: RGBAFormat,
            alpha: true,
        })
        this.renderer.shadowMap.enabled = true
        this.renderer.shadowMap.autoUpdate = false
        this.renderer.setSize(innerWidth - 0.1, innerHeight - 0.1)

        // camera
        this.camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 300)
        this.camera.position.set(-20, 50, -60)
        this.camera.lookAt(0, 0, 0)

        this.update = () => { }
        /** @type {Set<function>} */
        this.on_before_render = new Set()

        let last = 0
        const update_render = (time) => {
            const time_s = time / 1000
            const dt = Math.min(time_s - last, .05)
            last = time_s

            this.update(dt)

            if (this.render_disabled === false) {
                for (const f of this.on_before_render) if (f(dt) === true) this.on_before_render.delete(f)
                this.renderer.render(this.scene, this.camera)
            }
        }
        this.renderer.setAnimationLoop(update_render)

        this.start = () => { this.renderer.setAnimationLoop(update_render) }
        this.render_disabled = false
        this.stop = () => { this.renderer.setAnimationLoop(null) }

        // resize
        const resizeObserver = new ResizeObserver(() => {
            this.camera.aspect = parent.clientWidth / parent.clientHeight
            this.camera.updateProjectionMatrix()
            this.renderer.setSize(parent.clientWidth - 0.1, parent.clientHeight - 0.1, true)
        })
        parent.appendChild(this.canvas)
        resizeObserver.observe(parent)

        this.dispose = () => {
            this.stop()
            this.canvas.remove()
            this.scene.traverse((child) => {
                if (child.dispose) child.dispose()
            })
            this.renderer.dispose()
        }
    }
}




















