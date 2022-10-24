import { createHTMLElement } from './modules/htmlElement.js'

export class Debug_View {
    constructor(
        parent,
        on_start,
        on_stop,
    ) {
        this.container = createHTMLElement('div', {}, parent)

        const start_button = createHTMLElement('button', {
            background: 'hsl(240, 100%, 70%)',
        }, this.container, 'Start')

        start_button.addEventListener('click', on_start)

        const stop_button = createHTMLElement('button', {
            background: 'hsl(0, 100%, 70%)'
        }, this.container, 'Stop')

        stop_button.addEventListener('click', on_stop)

        this.dispose = () => {
            start_button.removeEventListener('click', on_start)
            stop_button.removeEventListener('click', on_stop)
        }
    }
}
