# SafeHold - Ellcrys Desktop Client

SafeHold is the official desktop client that allows users to join the Ellcrys network, manage their Ellcrys accounts, send and receive
the native cryptocurrency and more. SafeHold provides a beautiful graphic user interface that allows all categories of users experience and interact with the network easily.

## Installation

[TODO]

## Development

SafeHold is actively being developed by the Ellcrys team. It will continue to mature as the protocol itself gains more features and improvements.

### Install Dependencies

After cloning the repository, you need to install all dependencies using the command

```bash
npm install
```

### Embedded ELLD

Internally, SafeHold embeds and execute a copy of [ELLD](https://github.com/ellcrys/elld) (our official CLI network client) to gain access to all features supported by the protocol. During development, you will need to add pre-built binaries into the [binaries](https://github.com/ellcrys/safehold/tree/master/binaries) directory where it will be picked up by the build script and embedded into the build.

```bash
env npm run dev
#env npm run dev-linux
#env npm run dev-win
```

## SetUp Development Environment

You will need to start up two terminals to run the build processes for vue-electron and typescript compilation.

**Build vue-electron**

```sh
npm run dev   // On terminal 1
```

**Compile Typescript Files**

```sh
npm run compile  // On terminal 2
```

## Build

To create a production build, run the following command:

```bash
npm run build
# npm run build-win
# npm run build-linux
```

## Troubleshooting

```
sh: cpy: command not found
```

#### Solution

To solve the above error, you need to install `cpy-cli` globally with nom.

-   code `npm install cpy-cli -g`

```
An unhandled error occurred inside electron-rebuild
  CXX(target) Release/obj.target/bignum/bignum.o
../bignum.cc:9:10: fatal error: 'openssl/bn.h' file not found
#include <openssl/bn.h>
```

#### Solution :

(Mac)

```
brew update
brew upgrade openssl
```
