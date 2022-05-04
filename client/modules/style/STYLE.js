

import { strHTMLsafe } from '../htmlElement.js'
import { baseCSS } from './baseCSS.js'
import { darkTheme, dark_icon } from './theme/dark.js'
import { lightTheme, light_icon } from './theme/light.js'

const style = document.createElement("style")
document.head.appendChild(style)

// to get doc on all project (css var(--***) name)
const styleVariables = {
    colorText: '--color-text',
    colorBackground: '--color-background',
    colorLine: '--color-line',
    colorButtonBackground: '--color-button-background',
    colorBackgroundPopup: '--color-background-popup',
    wallpaper: '--wallpaper',
    colorScrollBar: '--color-scroll-bar',
    colorBackgroundScrollBar: '--color-background-scroll-bar',
}

const styleVar = { ...styleVariables }
for (const key in styleVar) {
    const element = styleVar[key]
    styleVar[key] = `var(${element})`
}
//

// define --var then add baseCSS
const update_style = (themeP = {}) => {

    const t = { ...darkTheme, ...themeP }

    style.innerHTML = `:root { `
    for (const key in styleVariables) {
        style.innerHTML += strHTMLsafe(`${styleVariables[key]}: ${t[key]}; `)
    }
    style.innerHTML += `}\n`

    style.innerHTML += baseCSS
}
update_style()

export const STYLE = {
    icon: {
        dark: dark_icon,
        light: light_icon,
    },
    theme: {
        dark: darkTheme,
        light: lightTheme,
    },
    update: update_style,
    var: styleVar
}
