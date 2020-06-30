/// <reference types="emscripten" />
// eslint-disable-next-line @typescript-eslint/no-var-requires
import factory from './built/curveasm'
import { KeyPair } from './types'

interface CurveModule extends EmscriptenModule {
    _curve25519_donna(mypublic_ptr: number, secret_ptr: number, basepoint_ptr: number): number
}

export class Curve25519Wrapper {
    static async create(): Promise<Curve25519Wrapper> {
        const instance = await factory()
        return new Curve25519Wrapper(instance)
    }

    private _module: CurveModule
    basepoint: Uint8Array
    constructor(module: CurveModule) {
        this._module = module
        this.basepoint = new Uint8Array(32).fill(0)
        this.basepoint[0] = 9
    }

    private _allocate(bytes) {
        const address = this._module._malloc(bytes.length)
        this._module.HEAPU8.set(bytes, address)

        return address
    }

    private _readBytes(address, length, array) {
        array.set(this._module.HEAPU8.subarray(address, address + length))
    }

    keyPair(privKey: ArrayBuffer): KeyPair {
        const priv = new Uint8Array(privKey)
        priv[0] &= 248
        priv[31] &= 127
        priv[31] |= 64

        // Where to store the result
        const publicKey_ptr = this._module._malloc(32)

        // Get a pointer to the private key
        const privateKey_ptr = this._allocate(priv)

        // The basepoint for generating public keys
        const basepoint_ptr = this._allocate(this.basepoint)

        // The return value is just 0, the operation is done in place
        const err = this._module._curve25519_donna(publicKey_ptr, privateKey_ptr, basepoint_ptr)
        if (err !== 0) {
            throw new Error(`Error performing curve scalar multiplication: ${err}`)
        }

        const res = new Uint8Array(32)
        this._readBytes(publicKey_ptr, 32, res)

        this._module._free(publicKey_ptr)
        this._module._free(privateKey_ptr)
        this._module._free(basepoint_ptr)

        return { pubKey: res.buffer, privKey: priv.buffer }
    }

    sharedSecret(pubKey: ArrayBuffer, privKey: ArrayBuffer): ArrayBuffer {
        // Where to store the result
        const sharedKey_ptr = this._module._malloc(32)

        // Get a pointer to our private key
        const privateKey_ptr = this._allocate(new Uint8Array(privKey))

        // Get a pointer to their public key, the basepoint when you're
        // generating a shared secret
        const basepoint_ptr = this._allocate(new Uint8Array(pubKey))

        // Return value is 0 here too of course
        const err = this._module._curve25519_donna(sharedKey_ptr, privateKey_ptr, basepoint_ptr)
        if (err !== 0) {
            throw new Error(`Error performing curve scalar multiplication: ${err}`)
        }

        const res = new Uint8Array(32)
        this._readBytes(sharedKey_ptr, 32, res)

        this._module._free(sharedKey_ptr)
        this._module._free(privateKey_ptr)
        this._module._free(basepoint_ptr)

        return res.buffer
    }
}
