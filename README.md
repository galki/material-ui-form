[![npm package](https://img.shields.io/npm/v/material-ui-form.svg)](https://www.npmjs.com/package/material-ui-form)
[![Build Status](https://travis-ci.org/unitedhubs/material-ui-form.svg?branch=dev)](https://travis-ci.org/unitedhubs/material-ui-form)
[![PeerDependencies](https://img.shields.io/david/peer/unitedhubs/material-ui-form.svg)](https://david-dm.org/unitedhubs/material-ui-form?type=peer)
[![Dependencies](https://img.shields.io/david/unitedhubs/material-ui-form.svg)](https://david-dm.org/unitedhubs/material-ui-form)
[![DevDependencies](https://img.shields.io/david/dev/unitedhubs/material-ui-form.svg)](https://david-dm.org/unitedhubs/material-ui-form?type=dev)

## About

material-ui-form aims to be a minimal wrapper for your form so you can get state and validation management "as-is" without having to configure anything or make changes to your input components. 


is a form component that wraps your current 

## Setup

#### install
```
npm install --save material-ui-form
```

#### local demo
1. `git clone https://github.com/unitedhubs/material-ui-form.git`
2. `cd material-ui-form`
3. `npm install && npm start`

#### features

- supports nested [material-UI](https://material-ui-1dab0.firebaseapp.com/getting-started/usage/) and custom form input components
- takes care of state
- takes care of validation (uses [validator.js](https://github.com/chriso/validator.js) natively)
- allows to extend/overwrite validation messages and validators separately
- allows to pass a custom validation function
- allows to pass validations to the form (ie server errors)

