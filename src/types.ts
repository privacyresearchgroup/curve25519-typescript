/*
 * Created April 2020
 *
 * Copyright (c) 2020 Privacy Research, LLC
 *
 *  Licensed under GPL v3 (https://www.gnu.org/licenses/gpl-3.0.en.html)
 *
 */
export interface KeyPair {
    pubKey: ArrayBuffer
    privKey: ArrayBuffer
}

export interface Curve {
    keyPair(privKey: ArrayBuffer): KeyPair
    sharedSecret(pubKey: ArrayBuffer, privKey: ArrayBuffer): ArrayBuffer
    sign(privKey: ArrayBuffer, message: ArrayBuffer): ArrayBuffer
    verify(pubKey: ArrayBuffer, message: ArrayBuffer, sig: ArrayBuffer): boolean
}

export interface AsyncCurve {
    keyPair(privKey: ArrayBuffer): Promise<KeyPair>
    sharedSecret(pubKey: ArrayBuffer, privKey: ArrayBuffer): Promise<ArrayBuffer>
    sign(privKey: ArrayBuffer, message: ArrayBuffer): Promise<ArrayBuffer>
    verify(pubKey: ArrayBuffer, message: ArrayBuffer, sig: ArrayBuffer): Promise<boolean>
}
