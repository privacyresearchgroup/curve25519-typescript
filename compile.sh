#!/bin/bash
source ~/dev/tools/emsdk/emsdk_env.sh
emcc native/ed25519/additions/*.c native/curve25519-donna.c native/ed25519/*.c native/ed25519/sha512/sha2big.c \
-O1 -Qunused-arguments \
-o src/built/curveasm.js \
-Inative/ed25519/nacl_includes -Inative/ed25519 -Inative/ed25519/sha512 \
-s WASM=0 -s MODULARIZE \
-s EXPORTED_FUNCTIONS="['_curve25519_donna', '_malloc']"
# -s EXPORTED_FUNCTIONS="['_curve25519_donna','_curve25519_sign','_curve25519_verify','_crypto_sign_ed25519_ref10_ge_scalarmult_base', '_sph_sha512_init', '_malloc']"

# src_files: [
#               'native/ed25519/additions/*.c',
#               'native/curve25519-donna.c',
#               'native/ed25519/*.c',
#               'native/ed25519/sha512/sha2big.c'
#             ],
#             methods: [
#               'curve25519_donna',
#               'curve25519_sign',
#               'curve25519_verify',
#               'crypto_sign_ed25519_ref10_ge_scalarmult_base',
#               'sph_sha512_init',
#               'malloc'
#             ]
#             var outfile = 'build/' + this.target + '.js';

#       var exported_functions = this.data.methods.map(function(name) {
#         return "'_" + name + "'";
#       });
#       var flags = [
#           '-O1',
#           '-Qunused-arguments',
#           '-o',  outfile,
#           '-Inative/ed25519/nacl_includes -Inative/ed25519 -Inative/ed25519/sha512',
#           '-s', "EXPORTED_FUNCTIONS=\"[" + exported_functions.join(',') + "]\""];
#       var command = [].concat('emcc', this.data.src_files, flags).join(' ');