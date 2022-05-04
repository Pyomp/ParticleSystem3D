
export const cbH = (cb) => { for (const f of cb) if (f() === true) cb.delete(f) }
export const cbHa = (cb, ...args) => { for (const f of cb) if (f(...args) === true) cb.delete(f) }

export const wait = (ms) => {
    return new Promise((resolve) => {
        setTimeout(resolve, ms)
    })
}

export const nonce = (length) => {
    let text = ""; const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    for (let i = 0; i < length; i++) text += possible.charAt(Math.floor(Math.random() * possible.length))
    return text
}

/**
 * 
 * @param {Array} array 
 * @param {any} element 
 * @returns {true|false} succes = true
 */
export const delete_from_array = (array, element) => {
    const index = array.indexOf(element)
    if (index !== -1) array.splice(index, 1)
}

if (typeof window !== 'undefined' && !window.requestIdleCallback) window.requestIdleCallback = window.setTimeout
/** first needs: send data on websocket with refreaching delay.  
 *  behavior: A 2nd call before ms will clear the first call. */
export const createTimeoutRefresh = (callback, ms = 1000) => {
    let timeout
    return () => {
        removeEventListener("unload", callback)
        addEventListener("unload", callback)
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            callback()
            removeEventListener("unload", callback)
        }, ms)
    }
}

export const createTimeoutBuffer = (callback, ms = 1000) => {
    let timeoutBuffer = false
    return () => {
        if (timeoutBuffer) return
        addEventListener("unload", callback)
        timeoutBuffer = true
        setTimeout(() => {
            callback()
            removeEventListener("unload", callback)
            timeoutBuffer = false
        }, ms)
    }
}

export const syncRec = (o1, t1, o2, t2 = {}, syncConflictP = false) => {
    let syncConflict = syncConflictP
    for (const p in o2) {
        if (o2[p].constructor === Object) {
            if (!t1[p]) t1[p] = {}
            if (!o1[p]) o1[p] = {}
            syncConflict = syncRec(o1[p], t1[p], o2[p], t2[p], syncConflict)
        } else {
            if (!(t1[p] > t2[p])) {
                o1[p] = o2[p]
                t1[p] = t2[p] || (Date.now() / 1000) | 0
            } else {
                syncConflict = true
            }
        }
    }
    return syncConflict
}

export const empty_function = () => { }

export const merge_flat_arrays = (a1, a2) => {
    for (let i = 0; i < a1.length; i++) {
        a1[i] = a2[i]
    }
}

export const merge_safe_array = (a1, check, a2) => {
    for (let i = 0; i < a1.length; i++) {
        if (typeof a1[i] === 'object') {
            merge_safe_array(a1[i], check[i], a2[i])
        } else {
            a1[i] = check[i](a1[i], a2[i])
        }
    }
}

export const merge_safe_rec = (o1, o2) => {
    for (const p in o1) {
        if (o1[p].constructor === o2[p]?.constructor) {
            if (typeof o1[p] === 'object') {
                merge_safe_rec(o1[p], o2[p])
            } else {
                o1[p] = o2[p]
            }
        }
    }
}

export const mergeObjectsRec = (o1, o2) => {
    for (const p in o2) {
        if (o2[p] && (o2[p].constructor === Object || o2[p].constructor === Array)) {
            if (!o1[p]) o1[p] = {}
            mergeObjectsRec(o1[p], o2[p])
        } else {
            o1[p] = o2[p]
        }
    }
}

export const mergeObjectsRecWithArray = (o1, o2) => {
    for (const p in o2) {
        if (o2[p] && typeof o2[p] === 'object') {
            if (!o1[p]) {
                if (Number.isInteger(+Object.keys(o2[p])[0])) {
                    o1[p] = []
                } else {
                    o1[p] = {}
                }
            }
            mergeObjectsRecWithArray(o1[p], o2[p])
        } else {
            o1[p] = o2[p]
        }
    }
}

export const uint_16bits_to_8bits_array = (a) => {
    return [(a >> 8) & 0b1111_1111, a & 0b1111_1111]
}

export const uint_32bits_to_8bits_array = (a) => {
    return [a, a >> 8, a >> 16, a >> 24]
}


export const if_err_log = (err) => { if (err) console.log(err) }



export const set_on_change = (set) => {

    const on_change = new Set()

    const set_add = set.add.bind(set)
    set.add = (a) => { set_add(a); cbH(on_change) }
    const set_delete = set.delete.bind(set)
    set.delete = (a) => { set_delete(a); cbH(on_change) }
    const set_clear = set.clear.bind(set)
    set.clear = (a) => { set_clear(a); cbH(on_change) }

    return on_change
}

export const JSON_parse = (json) => {
    try {
        return JSON.parse(json)
    } catch { return }
}

export const array_get_random = (array) => {
    return array[Math.floor(array.length * Math.random())]
}

