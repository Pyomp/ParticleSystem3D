export const getActualTouchIdentifier = (e, identifier) => {
    for (let i = 0, n = e.changedTouches.length; i < n; i++) {
        if (e.changedTouches[i].identifier === identifier) {
            return e.changedTouches[i]
        }
    }
}

export const toggleGenerator = (cbs = []) => {
    let state = 0
    const len = cbs.length
    const toggle = () => {
        cbs[state]()
        state = (state + 1) % len
    }
    return toggle
}

export const definePropGenerator = (object, attribute, name) => {
    const cb = new Set()

    Object.defineProperty(object, name + 'Cb')
    object[name + 'Cb'] = cb

    Object.defineProperty(object, name, {
        get: () => { return attribute },
        set: (a) => {
            attribute = a
            cbH(cb)
        }
    })
    return object
}

/** return the color of the word O.o */
export const colorWord = (strP) => {
    const str = /[a-zA-Z]{1,2}/.exec(strP)[0]
    let hue = parseInt(str, 36)
    if (!(hue > 0 && hue < Infinity)) {
        hue = Math.random() * 360
    }
    hue %= 360
    return hue.toFixed(0)
}

const div = document.createElement('div')
export const create_svg_element = (svg_str, width, height) => {
    div.innerHTML = svg_str
    /** @type {Element} */
    const svg = div.firstChild
    svg.style.width = width + 'px'
    svg.style.height = height + 'px'
    svg.setAttribute('width', width)
    svg.setAttribute('height', height)
    return svg
}

export const load_svg = async (url, width, height) => {
    const file = await fetch(url)
    if (file.ok === false) return
    const svg = await file.text()
    return create_svg_element(svg, width, height)
}

export const svgToImg = (rawSVG, width = 16, height = 16, img = new Image()) => {
    img.width = width
    img.height = height
    return new Promise((resolve) => {
        img.onload = () => {
            resolve(img)
        }
        img.onerror = (err) => {
            console.log(err)
            resolve()
        }
        img.src = "data:image/svg+xml;base64," + btoa(rawSVG)
    })
}


export const svgToCanvas = (rawSVG, width, height, canvas = document.createElement('canvas')) => {
    const buffImage = new Image()
    buffImage.width = width
    buffImage.height = height
    canvas.width = width
    canvas.height = height
    return new Promise((resolve) => {
        buffImage.onload = () => {
            const ctx = canvas.getContext('2d')
            ctx.drawImage(buffImage, 0, 0)
            resolve(canvas)
        }
        buffImage.onerror = (err) => {
            console.log(err)
            resolve()
        }

        buffImage.src = "data:image/svg+xml;base64," + btoa(rawSVG)
    })
}

/** @param {Array} array */
export const arrayToModuleJS = (array) => {
    return new Promise(async (resolve) => {
        try {
            const blob = new Blob([new Uint8Array(array)], { type: 'text/javascript' })
            const url = URL.createObjectURL(blob)
            const module = await import(url)
            URL.revokeObjectURL(url)
            resolve(module)
        } catch { resolve() }

    })
}

if (!window.requestIdleCallback) window.requestIdleCallback = (cb, option = { timeout: 50 }) => {
    window.setTimeout(cb, option.timeout)
}

export const requestIdleCallbackRefresh = (callback, ms = 1000) => {
    let timeout
    return () => {
        removeEventListener("unload", callback)
        addEventListener("unload", callback)
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            requestIdleCallback(() => {
                removeEventListener("unload", callback)
                callback()
            })
        }, ms)
    }
}

export const requestIdleCallbackBuffer = (callback, ms = 1000) => {
    let timeoutBuffer = false
    let data
    return (...data_P) => {
        data = data_P
        if (timeoutBuffer) return
        timeoutBuffer = true
        addEventListener("unload", callback)

        setTimeout(() => {
            requestIdleCallback(() => {
                removeEventListener("unload", callback)
                callback(...data)
                timeoutBuffer = false
            })
        }, ms)
    }
}

export const uint8arrayToBase64 = (uint8array) => {
    return btoa(String.fromCharCode(...uint8array))
}

export const base64ToUint8array = (base64Str) => {
    try {
        return Uint8Array.from(atob(base64Str), c => c.charCodeAt(0))
    } catch (e) { console.warn(e) }
}
