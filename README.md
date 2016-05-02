nightmare-upload
======================

Adds files to form using debugger

## Usage
Require the library: 

```js
require('nightmare-upload')
```
then use .upload(selector, path) action 

### .upload(selector, path)
Adds file to `selector` input.


## Example

```javascript
require('nightmare-upload');

var nightmare = Nightmare();
yield nightmare
  .upload('#single-file-input', path.join(__dirname, '1.txt'))
  .evaluate(function () {
    return document.querySelector('#single-file-input').files.length;
  });
```
