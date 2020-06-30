import { Curve25519Wrapper } from '../curve-wrapper'

const alice_bytes = hexToArrayBuffer('77076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c2a')
const alice_priv = '70076d0a7318a57d3c16c17251b26645df4c2f87ebc0992ab177fba51db92c6a'
const alice_pub_raw = '8520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a'
// const alice_pub = '058520f0098930a754748b7ddcb43ef75a0dbf3a0d26381af4eba4a98eaa9b4e6a'
const bob_bytes = hexToArrayBuffer('5dab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e0eb')
const bob_priv = '58ab087e624a8a4b79e17f8b83800ee66f3bb1292618b6fd1c2f8b27ff88e06b'
const bob_pub_raw = 'de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f'
// const bob_pub = '05de9edb7d7b7dc1b4d35b61c2ece435373f8343c85b78674dadfc7e146f882b4f'
const shared_sec = '4a5d9d5ba4ce2de1728e3bf480350f25e07e21c947d19e3376f09b3c1e161742'

function hexToArrayBuffer(str: string): ArrayBuffer {
    const ret = new ArrayBuffer(str.length / 2)
    const array = new Uint8Array(ret)
    for (let i = 0; i < str.length / 2; i++) array[i] = parseInt(str.substr(i * 2, 2), 16)
    return ret
}

test(`generate key pair`, async () => {
    const curve = await Curve25519Wrapper.create()
    const alicePair = curve.keyPair(alice_bytes)

    expect(Buffer.from(alicePair.pubKey).toString('hex')).toBe(alice_pub_raw)
    expect(Buffer.from(alicePair.privKey).toString('hex')).toBe(alice_priv)

    const bobPair = curve.keyPair(bob_bytes)

    expect(Buffer.from(bobPair.pubKey).toString('hex')).toBe(bob_pub_raw)
    expect(Buffer.from(bobPair.privKey).toString('hex')).toBe(bob_priv)

    const aliceSecret = curve.sharedSecret(bobPair.pubKey, alicePair.privKey)
    const bobSecret = curve.sharedSecret(alicePair.pubKey, bobPair.privKey)

    expect(Buffer.from(aliceSecret).toString('hex')).toBe(shared_sec)
    expect(Buffer.from(bobSecret).toString('hex')).toBe(shared_sec)
})
