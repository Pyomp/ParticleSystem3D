
import { Worker_Manager } from './modules/Worker_Manager.js'
import {
    BufferAttribute,
    BufferGeometry,
    Points,
    Scene,
    ShaderMaterial,
    Vector3
} from './modules_3D/three.module.js'
import { WORKER_CMD_PARTICLE, WORKER_INSTANCE_CONTROL } from './worker/constants.js'


export class Particle_System_Main {
    /**
     * 
     * @param {Worker_Manager} worker_manager 
     * @param {*} scene 
     * @param {*} count 
     * @param {*} position_base 
     * @param {*} position_spread 
     * @param {*} velocity_base 
     * @param {*} velocity_spread 
     */
    constructor(
        worker_manager,
        loop_manager,
        scene,

        count,

        position_base,
        position_spread,

        velocity_base,
        velocity_spread,
    ) {
        this.count = count
        const data_sab = new SharedArrayBuffer(4 * 2)
        const position_sab = new SharedArrayBuffer(count * 3 * 4)
        const velocity_sab = new SharedArrayBuffer(count * 3 * 4)
        const time_sab = new SharedArrayBuffer(count * 4)

        const data_ui32a = new Uint32Array(data_sab)
        const position_f32a = new Float32Array(position_sab)
        const velocity_f32a = new Float32Array(velocity_sab)
        const time_f32a = new Float32Array(time_sab)

        let worker_id
        this.init = async () => {
            worker_id = await worker_manager.request(WORKER_CMD_PARTICLE, {
                count: count,
                data_sab: data_sab,
                position_sab: position_sab,
                velocity_sab: velocity_sab,
                time_sab: time_sab,
            })
        }

        this.start = () => {
            loop_manager.frame_updates.add(update)
            clearTimeout(timeout)
            points.visible = true
            worker_manager.send(WORKER_INSTANCE_CONTROL, {
                id: worker_id,
                prop: 'start',
            })
        }

        let timeout
        this.stop = () => {
            worker_manager.send(WORKER_INSTANCE_CONTROL, {
                id: worker_id,
                prop: 'stop',
            })
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                points.visible = false
                loop_manager.frame_updates.delete(update)
            }, 1500)
        }

        for (let i = 0; i < count; i++) {
            const offset_position = i * 3
            position_f32a[offset_position + 0] = position_base.x
            position_f32a[offset_position + 1] = position_base.y
            position_f32a[offset_position + 2] = position_base.z

            const offset_velocity = i * 3
            velocity_f32a[offset_velocity + 0] = velocity_base.x + velocity_spread.x * (Math.random() - .5)
            velocity_f32a[offset_velocity + 1] = velocity_base.y + velocity_spread.y * (Math.random() - .5)
            velocity_f32a[offset_velocity + 2] = velocity_base.z + velocity_spread.z * (Math.random() - .5)
        }


        const particleGeometry = new BufferGeometry()
        particleGeometry.setAttribute('position', new BufferAttribute(position_f32a, 3))
        particleGeometry.setAttribute('velocity', new BufferAttribute(velocity_f32a, 3))
        particleGeometry.setAttribute('time', new BufferAttribute(time_f32a, 1))

        const uniforms = {
            sync: { value: 0 },
            color: {
                value: [
                    0, 1, 0, 0, 1,
                    // .33, 0, 1, 0, 1,
                    // .66, 0, 0, 1, 1,
                    1, 0, 0, 1, 1,
                ]
            }
        }

        const mat = new ShaderMaterial(
            {
                uniforms: uniforms,
                vertexShader:
                    `
            attribute vec3 velocity;

            attribute float time;
            varying float vTime;

            uniform float sync;
            varying float vSync;

            void main()
            {    
                vTime = time;
                vSync = sync;
                vec4 mvPosition = modelViewMatrix * vec4( position + velocity * sync, 1.0 );
                gl_PointSize =  300.0 / length( mvPosition.xyz );
                gl_Position = projectionMatrix * mvPosition;
            }`,
                fragmentShader:
                    /* glsl */`
            uniform float color[${uniforms.color.value.length}]; 

            varying float vTime;
            varying float vSync;

            void main()
            {
                float t = vTime + vSync;

                int index = 0;

                while(
                    index * 5 < color.length()
                   || t > color[index * 5]
                ) {
                    index++;
                }

                if(index == 0){ 
                    gl_FragColor = vec4(color[1], color[2], color[3], color[4]);
                } else if (index >= color.length() / 5 ) {
                    int i = (color.length() - 1);
                    gl_FragColor = vec4(color[i+1], color[i+2], color[i+3], color[i+4]);
                } else {
                    vec4 before_color = vec4(
                        color[(index - 1) * 5 + 1],
                        color[(index - 1) * 5 + 2],
                        color[(index - 1) * 5 + 3],
                        color[(index - 1) * 5 + 4]);
                    vec4 after_color = vec4(
                        color[index * 5 + 1],
                        color[index * 5 + 2],
                        color[index * 5 + 3],
                        color[index * 5 + 4]);
                    float x = ( t - color[ (index - 1) * 5 ] ) / ( color[ index  * 5 ] - color[ (index - 1) * 5 ] );
                    gl_FragColor = mix(before_color, after_color, x);
                    // gl_FragColor = vec4(t, 0., 0., 1.);
                }                
            }`,
                // transparent: true,
                // blending: AdditiveBlending,
                // depthWrite: false,
                // vertexColors: true,
            })

        const points = new Points(particleGeometry, mat)
        scene.add(points)

        let last_update = 0
        const update = (dt) => {
            // if (data_ui32a[0] === last_update) {

            //     mat.uniforms.sync.value += dt

            // } else {
            //     mat.uniforms.sync.value = 0
            //     last_update = data_ui32a[0]
            //     particleGeometry.attributes.position.needsUpdate = true
            //     particleGeometry.attributes.velocity.needsUpdate = true
            //     particleGeometry.attributes.time.needsUpdate = true
            // }

        }

    };
}
