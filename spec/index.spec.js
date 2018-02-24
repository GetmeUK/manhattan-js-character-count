import * as chai from 'chai'
import * as sinon from 'sinon'

import * as setup from './setup.js'
import * as $ from 'manhattan-essentials'
import {CharacterCount} from '../module/index.js'

chai.should()
chai.use(require('sinon-chai'))


describe('CharacterCounter', () => {

    let textarea = null,
        textareaWithMax = null

    beforeEach(() => {
        const {body} = document

        textarea = $.create(
            'textarea',
            {'data-mh-character-count': true}
        )
        textarea.value = 'test'
        body.appendChild(textarea)

        textareaWithMax = $.create(
            'textarea',
            {
                'data-mh-character-count': true,
                'data-mh-character-count--max-characters': '10'
            }
        )
        textareaWithMax.value = 'test'
        body.appendChild(textareaWithMax)

    })

    afterEach(() => {
        textarea.remove()
        textareaWithMax.remove()
    })

    describe('constructor', () => {
        it('should generate a new `CharacterClass` instance', () => {
            const characterCount = new CharacterCount(textarea),
                characterCountWithMax = new CharacterCount(textareaWithMax)

            characterCount.should.be.an.instanceof(CharacterCount)
            characterCountWithMax.should.be.an.instanceof(CharacterCount)
        })
    })

    describe('methods', () => {

        let characterCount = null,
            characterCountWithMax = null

        beforeEach(() => {
            characterCount = new CharacterCount(textarea)
            characterCountWithMax = new CharacterCount(textareaWithMax)
        })

        afterEach(() => {
            characterCount.destroy()
            characterCountWithMax.destroy()
        })

        // -- Getters & Setters --

        describe('input', () => {
            it('should return the counter element the character counter is ' +
               'applied to', () => {
                characterCount.init()
                chai.expect(characterCount.counter).not.to.be.undefined
                const {counter} = characterCount._dom
                characterCount.counter.should.equal(counter)
            })

            it('should return the textarea the character counter is ' +
               'applied to', () => {
                characterCount.input.should.equal(textarea)
            })
        })

        // -- Public methods --

        describe('destroy', () => {

            it('should destroy the CharacterCounter', () => {
                characterCount.init()

                // Spy on the update function
                sinon.spy(characterCount, 'update')

                // Destroy the character counter
                characterCount.destroy()

                // Make sure the update function is no longer bound to the
                // textarea.
                $.dispatch(textarea, 'input')
                characterCount.update.should.not.have.been.called

                // Restore the update function (from a spy)
                characterCount.update.restore()

                chai.expect(characterCount._dom.counter.parentNode).to.be.null
                chai.expect(characterCount._dom.input._mhCharacterCount)
                    .to
                    .be
                    .undefined
            })
        })

        describe('init', () => {

            it('should initialize the CharacterCounter', () => {
                characterCount.init()
                characterCountWithMax.init()

                // Check the counter has the correct initial value
                characterCount.counter.innerHTML.should.equal('4')
                characterCountWithMax.counter.innerHTML.should.equal('4 / 10')
                characterCount.counter.classList
                    .contains(CharacterCount.css['counter'])
                    .should
                    .be
                    .true

                // Check the counter's value is correctly updated when the
                // textarea's content is changed.
                characterCount.input.value = 'texttext'
                $.dispatch(textarea, 'input')
                characterCount.counter.innerHTML.should.equal('8')
            })

        })

        describe('update', () => {

            it('should update the counter inline with the textarea\'s ' +
               'content', () => {

                characterCount.init()
                characterCountWithMax.init()

                textarea.value = 'testtest'
                characterCount.update()
                characterCount.counter.innerHTML.should.equal('8')

                textareaWithMax.value = 'testtesttest'
                characterCountWithMax.update()
                characterCountWithMax.counter.innerHTML.should
                    .equal('12 / 10')

                characterCountWithMax.counter.classList
                    .contains(CharacterCount.css['max-exceeded'])
                    .should
                    .be
                    .true
            })
        })
    })
})
