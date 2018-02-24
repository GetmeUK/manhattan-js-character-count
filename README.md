<div align="center">
    <img width="196" height="96" vspace="20" src="http://assets.getme.co.uk/manhattan-logo--variation-b.svg">
    <h1>Manhattan Character Count</h1>
    <p>Add a character count to a text input or textarea.</p>
    <a href="https://badge.fury.io/js/manhattan-character-count"><img src="https://badge.fury.io/js/manhattan-character-count.svg" alt="npm version" height="18"></a>
    <a href="https://travis-ci.org/GetmeUK/manhattan-js-character-count"><img src="https://travis-ci.org/GetmeUK/manhattan-js-character-count.svg?branch=master" alt="Build Status" height="18"></a>
    <a href='https://coveralls.io/github/GetmeUK/manhattan-js-character-count?branch=master'><img src='https://coveralls.io/repos/github/GetmeUK/manhattan-js-character-count/badge.svg?branch=master' alt='Coverage Status' height="18"/></a>
    <a href="https://david-dm.org/GetmeUK/manhattan-js-character-count/"><img src='https://david-dm.org/GetmeUK/manhattan-js-character-count/status.svg' alt='dependencies status' height="18"/></a>
</div>

## Installation

`npm install manhattan-character-count --save-dev`


## Usage

```JavaScript
from 'manhattan-character-count' import CharacterCount

for(let textField in $.many('mh-character-count')) {
    let cc = CharacterCount(textField)
    cc.init()
}
```
