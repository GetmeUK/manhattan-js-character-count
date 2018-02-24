<div align="center">
    <img width="196" height="96" vspace="20" src="http://assets.getme.co.uk/manhattan-logo--variation-b.svg">
    <h1>Manhattan Character Count</h1>
    <p>Add a character count to a text input or textarea.</p>
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
