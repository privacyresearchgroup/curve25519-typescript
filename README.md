# Typescript Library for Curve 25519

This library isolates the implementation of the X25519 curves used in [libsignal-protocol-javascript](https://github.com/signalapp/libsignal-protocol-javascript)
and exposes the basic functions in an easy to use TypeScript package.

## Installation

Use [yarn](https://yarnpkg.com/) to install:

```
yarn add @privacyresearch/curve25519-typescript
```

Then in your code simply import the class you want:

```typescript
import { Curve25519Wrapper } from '@privacyresearch/curve25519-typescript'
// OR...
import { AsyncCurve25519Wrapper } from '@privacyresearch/curve25519-typescript'
```

We'll say more about the differences between the two curve wrappers below.

## Usage

Before getting into the details, here's a quick example of a Diffie-Hellman key exchange (not that you would ever do both key computations in one place!):

```typescript
const curve = await Curve25519Wrapper.create()

const alicePair = curve.keyPair(alice_bytes)
const bobPair = curve.keyPair(bob_bytes)

const aliceSecret = curve.sharedSecret(bobPair.pubKey, alicePair.privKey)
const bobSecret = curve.sharedSecret(alicePair.pubKey, bobPair.privKey)
```

Note the `await`! The curve wrapper is created asynchronously.

We can sign and verify too:

```typescript
// pub, priv, msg are all ArrayBuffers
const curve = await Curve25519Wrapper.create()
const sig = curve.sign(priv, msg)
const verified = curve.verify(pub, msg, sig)
if (verified) {
  // Yes, this is correct.  `verify` returns `true` for invalid signatures
  throw new Error('INVALID SIGNATURE!')
}
```

Note the return value of `verify`! This is for compatibility with usage in [libsignal-protocol-javascript](https://github.com/signalapp/libsignal-protocol-javascript).
To avoid confusion, we offer an alternative:

```typescript
const signatureIsValid = curve.signatureIsValid(pub, msg, sig)
if (!signatureIsValid) {
  throw new Error('INVALID SIGNATURE!')
}
```

That pretty much covers it, but look at the [tests](https://github.com/privacyresearchgroup/curve25519-typescript/tree/master/src/__tests__) for details about
creating ArrayBuffers for input and getting some sample data to get started.

### Async or not Async?

In the installation instructions we noted that the package exports two classes: `Curve25519Wrapper` and `AsyncCurve25519Wrapper`. The examples above
all use `Curve25519Wrapper`. Here are the differences between the two:

#### Wrapper creation

As seen in the examples above `Curve25519Wrapper` must be created asynchronously, but all of its methods are synchronous.

On the other hand `AsyncCurve25519Wrapper` can be instantiated synchronously, but all of its methods are `async`. For example, here his how
message signing looks with this wrapper:

```typescript
// Just create the wrapper, no need to await it
const curve = new AsyncCurve25519Wrapper()

// but now curve.sign returns a Promise<ArrayBuffer>!
const sigCalc = await curve.sign(priv, msg)
```

## Building

The core curve implementation is written in C and can be found in the [native/](https://github.com/privacyresearchgroup/curve25519-typescript/tree/master/native) directory. It is compiled
to Javascript with [Emscripten](https://emscripten.org/) and the compilation command can be seen in [compile.sh](https://github.com/privacyresearchgroup/curve25519-typescript/blob/master/compile.sh).

If you want to make modifications to the C code or change compilation arguments (e.g. to optimize more aggressively), you will need to install Emscripten.

## Thanks!

This is really just a direct lift of work done by the folks at [Signal](https://signal.org) so that we can use it easily in our TypeScript projects. Thanks to them for putting the core of this together!

## License

Copyright 2020 Privacy Research, LLC

Licensed under the GPLv3: [http://www.gnu.org/licenses/gpl-3.0.html](http://www.gnu.org/licenses/gpl-3.0.html)
