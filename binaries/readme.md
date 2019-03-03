Add ELLD binaries that should be embedded into the development and final build here. There should be one binary for each target platform. The naming convention for these binaries is as follows:

```
elld-{target platform}.tar.gz
e.g elld-darwin.tar.gz
```

During development, you can use the `TARGET` environment variable to choose which
executable should be embedded and executed.

```
env TARGET=darwin npm run dev
```
