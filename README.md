# Common package

This is a common utility package to abstrack away the differences between a few `node:buffer` utilities that regular `Uint8Array` can't do on it's own or with the help of any other tools like TextEncoder/TextDecoder or DataView, it's mainly used for hex conversion and converting mostly anything (string, ArrayBuffer, ArrayBufferView) to Uint8Arrays with `toUint8()`

- `arr2hex(arr: Uint8Array): string`
- `hex2arr(hex: string): Uint8Array`

- `binary2hex(binary: string): string`
- `hex2binary(hex: string): string`

- `text2arr(text: string): Uint8Array`
- `arr2text(view: Uint8Array): string`

- `sha1(view: Uint8Array): Promise<Uint8Array>`
- `toUint8(any): Uint8Array`

This package was built for WebTorrent to work better cross platform and apply a [onion architecture](https://codeguru.com/csharp/csharp/cs_misc/designtechniques/understanding-onion-architecture.html)
