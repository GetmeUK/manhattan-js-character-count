import * as $ from 'manhattan-essentials'


// -- Class definition --

/**
 * Count and display the number of characters in a text input or textarea.
 * Optionally a maximum number of characters can be specified and displayed.
 */
export class CharacterCount {

    constructor(input, options={}, prefix='data-mh-character-count--') {

        // Configure the options
        this._options = {}

        $.config(
            this._options,
            {

                /**
                 * The maximum number of characters that can be entered into
                 * the text field (a value of 0 means there is no maximum).
                 */
                'maxCharacters': 0,

                /**
                 * The separator string used to separate the current number of
                 * characters and the maximum.
                 */
                'separator': ' / '

            },
            options,
            input,
            prefix
        )

        // Configure the behaviours
        this._behaviours = {}

        $.config(
            this._behaviours,
            {'counter': 'default'},
            options,
            input,
            prefix
        )

        // Domain for related DOM elements
        this._dom = {}

        // Store a reference to the input field (we also store a reverse
        // reference to this instance against the input).
        this._dom.input = input
        this._dom.input._mhCharacterCount = this

        // Set up event handlers
        this._handlers = {
            'update': () => {
                this.update()
            }
        }
    }

    // -- Getters & Setters --

    get counter() {
        return this._dom.counter
    }

    get input() {
        return this._dom.input
    }

    // -- Public methods --

    /**
     * Remove the character counter.
     */
    destroy() {
        // Remove event handlers
        $.ignore(this._dom.input, {'input': this._handlers.update})

        // Remove the counter element
        if (this._dom.counter) {
            this._dom.counter.remove()
        }

        // Remove the character count reference from the text field
        delete this._dom.input._mhCharacterCount
    }

    /**
     * Initialize the character counter.
     */
    init() {
        // Create the counter element
        const cls = this.constructor
        const counter = cls.behaviours.counter[this._behaviours.counter]
        this._dom.counter = counter(this)

        // Set up event listeners
        $.listen(this._dom.input, {'input': this._handlers.update})

        // Perform an initial update to set the counter
        this.update()
    }

    /**
     * Update the counter to reflect the number of characters within the text
     * field.
     */
    update() {
        // Count the characters
        const cls = this.constructor
        const characters = this._dom.input.value.length
        const {maxCharacters} = this._options

        // Update the contents of the counter to reflect the new count
        let counterText = characters.toString()
        if (maxCharacters > 0) {
            counterText
                = `${characters}${this._options.separator}${maxCharacters}`
        }
        this._dom.counter.innerHTML = counterText

        // If a maximum number of characters has been specified then
        // apply/remove a CSS class to flag that the contents exceeds the
        // maximum.
        if (maxCharacters > 0) {
            if (characters > maxCharacters) {
                this._dom.counter.classList.add(cls.css['max-exceeded'])
            } else {
                this._dom.counter.classList.remove(cls.css['max-exceeded'])
            }
        }
    }
}


// -- Behaviours --

CharacterCount.behaviours = {

    /**
     * The `counter` behaviour is used to return an elemnt to display the
     * character count. The behaviour can return a reference to an existing
     * element or create, insert and return a new element.
     */
    'counter': {

        /**
         * The default behaviour creates a new div element and inserts it into
         * the the DOM after the text field.
         */
        'default': (inst) => {

            // Create a counter element
            const cls = inst.constructor
            const counter = $.create('div', {'class': cls.css['counter']})

            // Insert the counter after the input/textarea
            inst.input.parentNode.insertBefore(
                counter,
                inst.input.nextSibling
            )

            return counter
        }
    }
}


// -- CSS classes --

CharacterCount.css = {

    /**
     * Applied to the counter element.
     */
    'counter': 'mh-counter',

    /**
     * Applied to the counter element if the number of characters exceeds the
     * maximum number of characters.
     */
    'max-exceeded': 'mh-counter--max-exceeded'

}
