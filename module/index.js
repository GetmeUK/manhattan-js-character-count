import * as $ from 'manhattan-essentials'


// -- Class definition --

/**
 * Count and display the number of characters in a text input or textarea.
 * Optionally a maximum number of characters can be specified and displayed.
 */
export class CharacterCount {

    constructor(input, options={}, prefix='data-mh-character-count') {

        // Configure the options (@@ TODO: Address options vs this question)
        $.config(
            this,
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
                'separator': ' / ',

                /**
                 * A class applied to the counter element if the number of
                 * characters in the text field exceeds the maximum.
                 */
                'tooLongCSSClass': 'counter--too-long'

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

        // Create the counter element
        const counter = this.behaviours.counter[this._behaviours.counter]
        this._dom.counter = counter(this)

        // Set up event handlers
        this._handlers = {
            'update': () => {
                this.update()
            }
        }

        // Set up event listeners
        $.listen(this._dom.input, {'input': this._handlers.update})

        // Perform an initial update to set the counter
        this.update()
    }

    // -- Getters & Setters --

    get input() {
        return this._dom.input
    }

    /**
     * Remove the character counter.
     */
    destroy() {
        // Remove event hanglers
        $.ignore(this._dom.input, {'input': this._handlers.update})

        // Remove the counter element
        this._dom.counter.remove()

        // Remove the character count references from the text field
        delete this._dom.input.__mh_character_count
    }

    /**
     * Update the counter to reflect the number of characters within the text
     * field.
     */
    update() {
        // Count the characters
        const characters = this._dom.input.value.length

        // Update the contents of the counter to reflect the new count
        let counterText = characters.toString()
        if (this.maxCharacters > 0) {
            counterText =
                `${characters} ${this.separator} ${this.maxCharacters}`
        }
        this._dom.counter.innerHTML = counterText

        // If a maximum number of characters has been specified then
        // apply/remove a CSS class to flag that the contents exceeds the
        // maximum.
        if (this.maxCharacters > 0) {
            if (characters > this.maxCharacters) {
                this._dom.counter.classList.add(this.tooLongCSSClass)
            } else {
                this._dom.counter.classList.remove(this.tooLongCSSClass)
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
        'default': (characterCount) => {

            // Create a counter element
            const counter = $.create('div', {'class': 'counter'})

            // Insert the counter after the input/textarea
            characterCount.input.parentNode.insertBefore(
                counter,
                characterCount.input.nextSibling
            )

            return counter
        }
    }
}
