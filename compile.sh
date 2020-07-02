#!/bin/bash
# make sure emcc is in your PATH, e.g. source ~/dev/tools/emsdk/emsdk_env.sh
emcc native/ed25519/additions/*.c native/curve25519-donna.c native/ed25519/*.c native/ed25519/sha512/sha2big.c \
-O1 -Qunused-arguments \
-o src/built/curveasm.js \
-Inative/ed25519/nacl_includes -Inative/ed25519 -Inative/ed25519/sha512 \
-s WASM=0 -s MODULARIZE \
-s EXPORTED_FUNCTIONS="['_curve25519_donna','_curve25519_sign','_curve25519_verify','_malloc']"

