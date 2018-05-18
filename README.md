# GarbageCollector

## Overview
- the game of collecting litter (we call it garbage.)
- operate garbage collector to keep load clean.

---

## Installation

- install GarbageCollector from GitHub repository.
```sh
git clone https://github.com/azuki-penguin/GarbageCollector.git
cd GarbageCollector
```

- install enchant.js from GitHub repository.
```sh
git clone https://github.com/wise9/enchant.js.git
cd enchant.js
```

- install grunt and coffee script if not installed.
```sh
which grunt > /dev/null 2>&1 || npm install grunt-cli -g
which coffee > /dev/null 2>&1 || npm install coffee-script -g
```

- install dependent package using `npm`
```sh
npm install
```

- build `enchant.min.js`
```sh
grunt concat
grunt uglify
```
