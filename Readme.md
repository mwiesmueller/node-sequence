# node-sequence

A module that performs bundled javascript functions one after the other.

## Install

```
npm i node-sequence --save --save-exact
```

## Work with node-sequence

You can work with node-sequence by async/await or Promise.

```
'use strict';

const sequence = require('node-sequence');

(async () => {
  await sequence(seqDef, library, base);
})();
```

### Arguments

#### Sequence definition (seqDef):

This argument must be of type object-array. Follow properties are valid:

* method (string): Describe the called javascript method. (Example: console.log)
* await (boolean): Set it to true, if you whant to run this part as async.
* args (array): Describes the arguments to run the function in this part.

If you want to use the response from the previous part, you can define the `%RES%` placeholder in an argument. When the previous response is of type object, you can use this placeholder also in the deep. Ex: `%RES%.foo.bar`

If you want to use a base object where are handle in the complete sequence, it's possible to declare the `base` property in function call. The object is reachable via `%BASE%` placeholder in the arguments. To use this placeholder in the deep is also possible. (Ex. `%BASE%.foo.bar`)

#### Insert Library (library):

In this value it's possible to insert a complete library as argument.

Example:

```
await sequence(seqDef, require('fooBar'));
```

In this case, you must use this library with the `lib` placeholder in your definitions.

### Example:

```
'use strict';

const sequence = require('node-sequence');

const process = [
  { method: 'lib.test1', await: true, params: [ ] }, // Returns { text: { foo: 'bar' }}
  { method: 'lib.test2.output', await: false, params: [ '%RES%.text.foo' ] }, // Runs function with the argument `bar`
  { method: 'console.log', await: false, params: [ '%RES%.text.foo' ] }, // You can use plain javascript functions, too!
];

(async () => {
  await sequence(process, require('someModule'));
})();

```


## License

The MIT License (MIT)
Copyright (c) 2019 Martin Wiesmüller - WERBAS AG / Werbas Innotec GmbH.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
