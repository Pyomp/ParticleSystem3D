import { Loop_Manager } from './modules_3D/Loop_Manager.js'
import { OrbitControls } from './modules_3D/OrbitControls.js'
import { Particle_System_Main } from './Particle_System_Main.js'
import { AmbientLight, Mesh, MeshBasicMaterial, PlaneGeometry } from './modules_3D/three.module.js'
import { Three_Context } from './modules_3D/Three_Context.js'
import './modules/style/STYLE.js'
import { Debug_View } from './Debug_View.js'
import { Worker_Manager } from './modules/Worker_Manager.js'

if (!window.isSecureContext) throw new Error('needs secure context')
navigator.serviceWorker.register(new URL("../sw.js", import.meta.url))
if (!window.SharedArrayBuffer) location.reload()

const loop_manager = new Loop_Manager()
const three_context = new Three_Context(document.body)
three_context.update = loop_manager.frame_update

three_context.camera.position.set(5, 1, 0)
three_context.scene.add(new AmbientLight(0xffffff, .5))

const plane = new Mesh(new PlaneGeometry(), new MeshBasicMaterial({ color: 0x888888 }))
plane.rotation.x = -Math.PI / 2
three_context.scene.add(plane)

const orbitControls = new OrbitControls(three_context.camera, three_context.canvas)
orbitControls.target.set(0, 1.1, 0)
orbitControls.update()

const worker_manager = new Worker_Manager(new URL("./worker/worker.js", import.meta.url))

const particle_system = new Particle_System_Main(
    worker_manager,
    loop_manager,
    three_context.scene,
)
await particle_system.init()
particle_system.start()

const debug_view = new Debug_View(document.body, particle_system.start, particle_system.stop)
debug_view.container.style.position = 'fixed'
debug_view.container.style.top = '0'
debug_view.container.style.left = '0'
