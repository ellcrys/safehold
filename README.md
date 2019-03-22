# Safehold - Ellcrys Desktop Client

Safehold is the official desktop client that allows users to join the Ellcrys network, manage their Ellcrys accounts, send and receive
the native cryptocurrency and more. Safehold provides a beautiful graphic user interface that allows all categories of users experience and interact with the network easily.

## Installation

[TODO]

## Development

Safehold is actively being developed by the Ellcrys team. It will continue to mature as the protocol itself gains more features and improvements.

### Install Dependencies

After cloning the repository, you need to install all dependencies using the command

```bash
npm install
```

### Embedded ELLD

Internally, Safehold embeds and execute a copy of [ELLD](https://github.com/ellcrys/elld) (our official CLI network client) to gain access to all features supported by the protocol. During development, you will need to add pre-built binaries into the [binaries](https://github.com/ellcrys/safehold/tree/master/binaries) directory where it will be picked up by the build script and embedded into the build.

```bash
env TARGET=darwin npm run dev
# TARGET = darwin, linux or windows
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
```

Troubleshooting

```
> safehold@0.1.0 copybin:darwin /Users/princesegzy01/Documents/ellcrys_web_project/safehold
> cpy binaries/elld-darwin.tar.gz static/bin --rename=elld.tar.gz

sh: cpy: command not found
npm ERR! file sh
npm ERR! code ELIFECYCLE
npm ERR! errno ENOENT
npm ERR! syscall spawn
npm ERR! safehold@0.1.0 copybin:darwin: `cpy binaries/elld-darwin.tar.gz static/bin --rename=elld.tar.gz`
npm ERR! spawn ENOENT
npm ERR!
npm ERR! Failed at the safehold@0.1.0 copybin:darwin script.
npm ERR! This is probably not a problem with npm. There is likely addit
```

npm install cpy-cli -g

```


An unhandled error occurred inside electron-rebuild
  CXX(target) Release/obj.target/bignum/bignum.o
../bignum.cc:9:10: fatal error: 'openssl/bn.h' file not found
#include <openssl/bn.h>
         ^~~~~~~~~~~~~~

```

brew update
brew upgrade openssl
