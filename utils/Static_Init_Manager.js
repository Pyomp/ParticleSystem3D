









/** to prevent second init and only destroy when all instances are destroyed */
export class Static_Init_Manager {
    constructor(
        /**  @type {async()=>{} | ()=>{}} */ init,
        /**  @type {async()=>{} | ()=>{}} */ destroy
    ) {
        let init_count = 0
        this.init = (...param) => {
            init_count++
            if (init_count === 1) return init(...param)
        }

        this.destroy = (...param) => {
            init_count--
            if (init_count === 0) return destroy(...param)
        }
    }
}





