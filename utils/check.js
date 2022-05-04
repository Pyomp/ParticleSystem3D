
export const check_int_bool = (a) => a === 0 || a === 1
export const check_positive_int = (a) => Number.isInteger(a) && a >= 0
export const check_number_not_NaN = (last_value, new_value) => {
    if (
        new_value?.constructor !== Number
        || new_value === last_value
        || new_value === NaN
    ) {
        return last_value
    } else {
        return new_value
    }
}


