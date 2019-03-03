# Safehold - The Official Desktop Client of the Ellcrys Network

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

Internally, Safehold embeds and execute a copy of [ELLD](https://github.com/ellcrys/elld) (our official CLI network client) to gain access to all features supported by the protocol. During development, you will need to add pre-built binaries into the `binaries` directory where it will be picked up by the build script and embedded into the build.

```bash
env TARGET=darwin npm run dev
# TARGET = darwin, linux or windows
```

## Build

To create a production build, run the following command:

```bash
npm run build
```


