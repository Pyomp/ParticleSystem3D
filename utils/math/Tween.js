



export class Array_Tween {
    /**
     * @param {[[]]} array 
     * nested array should be same length
     * and first value should be time
    */
    constructor(array) {
        const sample_length = array.length
        const value_length = array[0].length

        const a_params = []
        const b_params = []
        const t_params = [array[0][0]]

        for (let i = 1; i < sample_length; i++) {
            const before = array[i - 1]
            const after = array[i]

            t_params.push(after[0])

            b_params.push(before.slice(1))

            const delta_time = after[0] - before[0]

            const a_index = a_params.push([]) - 1
            for (let i = 1; i < after.length; i++) {
                const delta_data = after[i] - before[i]
                a_params[a_index].push(delta_data / delta_time)
            }
        }

        this.get_value = (time, ref) => {

            const result = ref || new Array(value_length)

            let index = 0
            while (
                time > t_params[index]
                && index < sample_length
            ) {
                index++
            }

            if (index === 0) return b_params[0]
            else if (index >= sample_length) return b_params[sample_length - 1]
            else {
                for (let i = 0; i < value_length - 1; i++) {
                    result[i] =
                        b_params[index - 1][i]
                        + a_params[index - 1][i] * (time - t_params[index - 1])
                }
            }

        }
    }
}









