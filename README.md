# sh

> An electron-vue project

#### Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:9080
npm run dev

# build electron application for production
npm run build

<<<<<<< HEAD
**Build vue-electron**

```sh
npm run dev   // On terminal 1
```

**Compile Typescript Files**

```sh
npm run compile  // On terminal 2
=======

>>>>>>> 017d960c7932a72aa77a34f7b59dc5d90a1c8406
```

---

<<<<<<< HEAD
To create a production build, run the following command:

```bash
npm run build
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
=======
This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[8fae476](https://github.com/SimulatedGREG/electron-vue/tree/8fae4763e9d225d3691b627e83b9e09b56f6c935) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
>>>>>>> 017d960c7932a72aa77a34f7b59dc5d90a1c8406
