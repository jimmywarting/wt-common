const browser = require('./browser.js')
const node = require('./node.js')

/**
 * @param {boolean} res
 * @param {string} [message]
 */
function assert (res, message) {
  if (res !== true) throw new Error(message)
}

const rgb = new Uint8Array([255, 0, 255])

function isUint8 (x, y) {
  assert(x instanceof Uint8Array, `result of ${y} should be a instances of Uint8array`)
  assert(x.constructor.name === 'Uint8Array', `result of ${y} constructor should be a Uint8Array`)
}

function isEqual (a, b, m = '') {
  assert(a === b, m)
}

/** @type {({name: string, only: boolean, ignore: boolean, fn(arg0: browser|node):void})[]} */
const cases = [{
  name: 'hex2arr',
  ignore: false,
  only: false,
  fn: ({ hex2arr }) => {
    isEqual(typeof hex2arr, 'function', 'hex2arr should be a function')

    const result = hex2arr('ff00ff')
    isUint8(result)
    isEqual(result.join(''), '2550255', 'hex2arr(`ff00ff`) should be [255, 0, 255]')
  }
}, {
  ignore: false,
  only: false,
  name: 'hex2arr',
  fn: ({ arr2hex }) => {
    isEqual(typeof arr2hex, 'function', 'arr2hex should be a function')

    const result = arr2hex(rgb)
    isEqual(typeof result, 'string', 'arr2hex should return a string')
    isEqual(result, 'ff00ff', 'arr2hex([255, 0, 255]) should be `ff00ff`')
  }
}, {
  ignore: false,
  only: false,
  name: 'sha1',
  fn: async ({ sha1, arr2hex }) => {
    isEqual(typeof sha1, 'function', 'sha1 should be a function')

    const result = sha1(rgb)
    isEqual(typeof result?.then, 'function', 'sha1 should return a promise')

    const uint8 = await result
    const expected = '3a043594c187ec4b7c4adce40b173d018ad0c57a'
    isUint8(uint8, 'sha1')
    isEqual(arr2hex(uint8), expected, `sha1([255, 0, 255]) should produce ${expected}`)
  }
}, {
  ignore: false,
  only: false,
  name: 'text2arr',
  fn: ({ text2arr }) => {
    isUint8(text2arr('abc'), 'text2arr')
    isEqual(text2arr('abc').join(''), '979899')
  }
}, {
  ignore: false,
  only: false,
  name: 'arr2text',
  fn: ({ arr2text }) => {
    isEqual(arr2text(new Uint8Array([97, 98, 99])), 'abc')
  }
}, {
  ignore: false,
  only: false,
  name: 'hex2binary',
  fn: ({ hex2binary }) => {
    const ctrl = '3a043594c187ec4b7c4adce40b173d018ad0c57a'
    isEqual(
      escape(hex2binary(ctrl)),
      '%3A%045%94%C1%87%ECK%7CJ%DC%E4%0B%17%3D%01%8A%D0%C5z',
      'hex2binary should work like Buffer.from(a, `hex`).toString(`binary`)'
    )
  }
}, {
  ignore: false,
  only: false,
  name: 'hex2binary',
  fn: ({ binary2hex }) => {
    const ctrl = unescape('%3A%045%94%C1%87%ECK%7CJ%DC%E4%0B%17%3D%01%8A%D0%C5z')
    isEqual(escape(binary2hex(ctrl)), '3a043594c187ec4b7c4adce40b173d018ad0c57a')
  }
}]

// cases.forEach(testCase => {
//   Deno.test({
//     ...testCase,
//     fn: () => testCase.fn(web)
//   })
// })

cases.forEach(testCase => {
  testCase.fn(node)
})

cases.forEach(testCase => {
  testCase.fn(browser)
})
