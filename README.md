### material-ui-form

[![npm](https://img.shields.io/npm/v/material-ui-form.svg)](https://www.npmjs.com/package/material-ui-form)
[![David](https://david-dm.org/unitedhubs/material-ui-form.svg)](https://david-dm.org/unitedhubs/material-ui-form.svg)
[![Build Status](https://travis-ci.org/unitedhubs/material-ui-form.svg?branch=dev)](https://travis-ci.org/unitedhubs/material-ui-form)
[![Coverage Status](https://coveralls.io/repos/github/unitedhubs/material-ui-form/badge.svg)](https://coveralls.io/github/unitedhubs/material-ui-form)
[![tested with jest](https://img.shields.io/badge/tested_with-jest-99424f.svg)](https://github.com/facebook/jest)

1. [About](#about)
2. [Setup](#setup)
3. [Props](#props)
    - [Form props](#form-props-optional)
    - [Field props](#field-props)
    - [Other props](#other-props)
4. [Examples](#examples)
    - [Nested fields](#nested-fields)
    - [Custom validation messages](#custom-validation-messages)
    - [Custom validators](#custom-validators)
    - [Custom validation logic](#custom-validation-logic)
    - [Misc form settings](#form-autocomplete-and-on-error-submission)
    - [Getting values on field update](#getting-form-values-on-field-change)
    - [Multi-page form](#multi-page-form)
    - [Dynamic array fields](#dynamic-array-fields-notice-the-deletefieldrow-prop-on-the-remove-row-button)
    - [Custom component handler](#custom-components-with-custom-handlers)
5. [Contributing](#contributing)

## About

_material-ui-form_ is a React wrapper for Material-UI form components. Simply replace the `<form>` element with `<MaterialUIForm>` to get out-of-the-box state and validation support ***as-is***. There's no need to use any other components, alter your form's nesting structure, or write onChange handlers.

Validation is done with [validator.js](https://github.com/chriso/validator.js) but you can extend/customize validation messages, validators, and use your own validation logic too. Steppers (multi-page forms) and dynamic array fields are also supported without extra configuration. 

#### use and requirements

- requires React 16.2.0 or later
- supports official and unofficial [Material-UI](https://material-ui-1dab0.firebaseapp.com/getting-started/usage/) fields (other input elements are rendered without state/validation support)
- every input field must have `value` and `name` props
- every input field should NOT have `onChange` and `onBlur` props (unless you need custom field-specific logic)
- add a `data-validators` prop to any input field (or FormControl / FormControlLabel) to specify validation rules

#### extra validators

_material-ui-form_ extends [_validator.js_ validators](https://github.com/chriso/validator.js#validators) with the following validators:

- isAlias `/^[a-zA-Z0-9-_\.]*$/i`
- isDate
- isNumber `/^([,.\d]+)$/`
- isRequired `value.length !== 0`
- isSerial `/^([-\s\da-zA-Z]+)$/`
- isSize `value >= min && value <= max`
- isTime

#### _NOTE!_

While most Material-UI field components are supported there may be some that are not. Support for Material-UI field component props is another issue. Please [check here](https://github.com/unitedhubs/material-ui-form/issues/5) to see what is currently tested to be working.  

## Setup

#### install
```
npm install --save material-ui-form
```

#### demo
1. `$ git clone https://github.com/unitedhubs/material-ui-form.git`
2. `$ cd material-ui-form`
3. `$ npm install && npm run dev`

## Props

#### Form props (optional):

Prop                          | Description               | Default
------------------------------| --------------------------|------------
***autoComplete*** _[string]_ | Sets form _autoComplete_ prop. Accepts one of ["on", "off"] | "off"
***disableSubmitButtonOnError*** _[boolean]_ | Disables submit button if any errors exist | true 
***onSubmit*** _[func]_       | Returns _@values_ and _@pristineValues_ on form submission |
***onValuesChange*** _[func]_ | Returns _@values_ and _@pristineValues_ on field value change |
***validation*** _[object]_   | Object specifing validation config options (prefixed below with ↳) |
↳ ***messageMap*** _[object]_ | A key-value list where the key is the validator name and the value is the error message. Is exposed as a _material-ui-form_ export parameter | _object_
↳ ***messageKeyPrefix*** _[string]_ | Optional prefix to apply to all messageMap keys. If specified, field validator names will automatically be appended the prefix | ""
↳ ***requiredValidatorName*** _[boolean, string]_ | Specifies the validator name and matching messegeMap key for required fields. To disable and rely on the native _required_ field prop, set to `false` | "isRequired"
↳ ***validate*** _[func]_ | Overrides the internal validate method. Receives the following parameters: _@fieldValue_, _@fieldValidators_, and _@...rest_ (where _@...rest_ is the **validation** prop object) | _func_
↳ ***validators*** _[object]_ | Defaults to an extended validator.js object. Is exposed as a _material-ui-form_ export parameter | _object_
↳ ***validateInputOnBlur*** _[boolean]_ | Makes text input validations happen on blur instead of on change | false
***validations*** _[object]_ | Validations to pass to the form (i.e. from the server). Should be an object with keys representing field _name_ props and values as arrays of field error messages. The first error message will be displayed per field | 

#### Field props:

Prop                          | Description               | Required
------------------------------| --------------------------|------------
***value*** _[any]_ | The value of the field. If empty set an empty string | Yes
***name*** _[string]_ | The name of the field | Yes
***data-validators*** _[string, array[object]]_ | Validators to apply to the field. Multiple validator names can be specified with a comma-delimited string |  
***onBlur*** _[func]_ | A custom handler that will be called after the field's `onBlur` event. Provides _@value/checked_, _@field_ and _@event_ parameters | 
***onChange*** _[func]_ | A custom handler that will be called after the field's `onChange` event. Provides _@value/checked_, _@field_ and _@event_ parameters |  

#### Other props:

Prop                     | Value             | Description       
-------------------------| ------------------|------------------------
[***deletefieldrow***](#dynamic-array-fields-notice-the-deletefieldrow-prop-on-the-remove-row-button) _[string]_ | Field **name** prop up to and including the row index (i.e. _rooms[2]_) | Add to button components that use _onClick_ to remove any array field rows

## Examples

#### Nested fields:
```jsx
import MaterialUIForm from 'material-ui-form'


class MyForm extends React.Component {
  submit = (values, pristineValues) => {
    // on form submission you get the values and pristineValues
  }

  customInputHandler = (value, { name }, event) => {
    // the form will update the field as usual, and then call this handler
  }

  customToggleHandler = (checked, { name, value }, event) => {
    // the form will update the field as usual, and then call this handler
  }

  render() {
    return (
      <MaterialUIForm onSubmit={this.submit}>
        <TextField
          label="Name"
          type="text"
          name="name"
          value=""
          data-validators="isRequired,isAlpha"
          onChange={this.customInputHandler}
        />

        <fieldset>
          <legend>Nested</legend>
          <Checkbox
            checked
            name="love"
            value="yes"
            onChange={this.customToggleHandler}
          />
          <span>I love it</span>

          <FormControl required>
            <InputLabel>Age</InputLabel>
            <Select value="" name="age">
              <MenuItem value=""><em>Please select your age ...</em></MenuItem>
              <MenuItem value={10}>Teens</MenuItem>
              <MenuItem value={20}>Twenties</MenuItem>
              <MenuItem value={30}>Thirties</MenuItem>
              <MenuItem value="40+">Fourties +</MenuItem>
            </Select>
            <FormHelperText>Some important helper text</FormHelperText>
          </FormControl>

        </fieldset>
        <Button variant="raised" type="reset">Reset</Button>
        <Button variant="raised" type="submit">Submit</Button>
      </MaterialUIForm>
    )
  }
}
```

#### Custom validation messages:
```jsx
import Form, { messageMap } from '../../src/index'
 

const customMessageMap = Object.assign(messageMap, {
  myCustomPrefix_isInt: 'Invalid integer',
  myCustomPrefix_isEmail: 'メールアドレスが無効です',
  myCustomPrefix_isIn: '「{0}」のいずれかを記入してください',
  myCustomPrefix_isWhitelisted: '文字は「{0}」から選択してください',
  myCustomPrefix_isLength: '文字数は{0}以上{1}以下であることは条件',
})

class MyForm extends React.Component {
  submit = (values, pristineValues) => {
    // on form submission you get the values and pristineValues
  }

  render() {
    return (
      <MaterialUIForm
        onSubmit={this.submit}
        validation={{
          messageMap: customMessageMap,
          messageKeyPrefix: 'myCustomPrefix_',
        }}
      >
        <TextField
          label="Email"
          type="text"
          name="email"
          value="invalid@email."
          data-validators="isEmail"
        />

        <TextField
          label="Inclusion"
          type="number"
          name="number"
          value="3"
          data-validators={[{ isIn: [1, 2, 4] }]}
        />

        <TextField
          label="Whitelisted characters"
          type="text"
          name="whitelisted"
          value="abc1234"
          data-validators={[{ isWhitelisted: 'abc123' }]}
        />

        <TextField
          label="Lenght test"
          type="text"
          name="length"
          value="123"
          data-validators={[{ isLength: { min: 4, max: 5 } }]}
        />

        <Button variant="raised" type="submit">Submit</Button>
      </MaterialUIForm>
    )
  }
}
```

#### Custom validators:
```jsx
import Form, { messageMap, validators } from '../../src/index'
 

validators.isBorat = value => value === 'borat'
const customMessageMap = Object.assign(messageMap, {
  isBorat: 'NAAAAAT! You can only write "borat" lol',
})

class MyForm extends React.Component {
  submit = (values, pristineValues) => {
    // on form submission you get the values and pristineValues
  }

  render() {
    return (
      <MaterialUIForm
        onSubmit={this.submit}
        validation={{
          messageMap: customMessageMap,
          validators,
        }}
      >
        <TextField
          label="Write anything..."
          type="text"
          name="trickster"
          value=""
          helperText="this is not a trick"
          data-validators="isBorat"
        />

        <Button variant="raised" type="submit">Submit</Button>
      </MaterialUIForm>
    )
  }
}
```

#### Custom validation logic:
```jsx
import MaterialUIForm from 'material-ui-form'
 

function validate(value, fieldValidators, options) {
  const fieldValidations = []
  fieldValidators.forEach((validator) => {
    const validation = {
      code: String(validator),
      message: 'its invalid so maybe try harder...',
    }
    if (_.has(options, 'genericMessage')) {
      validation.message = options.genericMessage
    }
    fieldValidations.push(validation)
  })
  return fieldValidations
}

const validationOptions = {
  genericMessage: 'yeah... *tisk*',
}

class MyForm extends React.Component {
  submit = (values, pristineValues) => {
    // on form submission you get the values and pristineValues
  }

  render() {
    return (
      <MaterialUIForm
        onSubmit={this.submit}
        validation={{
          requiredValidatorName: false,
          validate,
          ...validationOptions,
        }}
      >
        <TextField
          label="Whatever you write isn't gonna be good enough"
          type="text"
          name="test"
          value=""
          data-validators="whatever - our custom validator will ignore this"
          required
        />

        <Button variant="raised" type="submit">Submit</Button>
      </MaterialUIForm>
    )
  }
}
```

#### Server validations:
```jsx
import MaterialUIForm from 'material-ui-form'
 

const mockServerValidations = {
  name: [{ code: 'isInvalid', message: 'such invalid...' }],
}

class MyForm extends React.Component {
  state = {
    mockServerValidations,
  }

  componentDidMount() {
    let validations = {
      name: [{ message: 'such WOOOOOOOOOW...' }],
    }

    setTimeout(() => {
      this.setState({ mockServerValidations: validations })
    }, 1500)

    setTimeout(() => {
      validations = {
        name: [{ message: 'so still haven\'t watched Italian Spiderman?' }],
      }
      this.setState({ mockServerValidations: validations })
    }, 3000)
  }

  submit = (values, pristineValues) => {
    // on form submission you get the values and pristineValues
  }

  render() {
    return (
      <MaterialUIForm
        onSubmit={this.submit}
        validations={this.state.mockServerValidations}
      >
        <TextField
          label="Name"
          type="text"
          name="name"
          value="doge"
        />

        <Button variant="raised" type="submit">Submit</Button>
      </MaterialUIForm>
    )
  }
}
```

#### Form autoComplete and "on error" submission:
```jsx
import MaterialUIForm from 'material-ui-form'
 

class MyForm extends React.Component {
  submit = (values, pristineValues) => {
    // on form submission you get the values and pristineValues
  }

  render() {
    return (
      <MaterialUIForm
        autoComplete="on"
        disableSubmitButtonOnError={false}
        onSubmit={this.submit}
      >
        <TextField
          label="Name"
          type="text"
          name="name"
          value="doge"
          data-validators="isInt"
        />

        <Button variant="raised" type="submit">Submit</Button>
      </MaterialUIForm>
    )
  }
}
```

#### Getting form values on field change:
```jsx
import MaterialUIForm from 'material-ui-form'
 

class MyForm extends React.Component {
  handleValuesChange = (values, pristineValues) => {
    // on field change you get the form values and pristineValues
  }

  submit = (values, pristineValues) => {
    // on form submission you get the values and pristineValues
  }

  render() {
    return (
      <MaterialUIForm
        onSubmit={this.submit}
        onValuesChange={this.handleValuesChange}
      >
        <TextField
          label="Name"
          type="text"
          name="name"
          value="doge"
        />

        <Button variant="raised" type="submit">Submit</Button>
      </MaterialUIForm>
    )
  }
}
```

#### Multi-page form:
```jsx
import Stepper, { Step, StepLabel } from 'material-ui/Stepper'
import MaterialUIForm from 'material-ui-form'
 

function getSteps() {
  return [
    'Step 1',
    'Step 2',
  ]
}

class MyForm extends React.Component {
  state = {
    activeStep: 0,
  }

  clickNext = () => {
    this.setState({
      activeStep: this.state.activeStep + 1,
    })
  }

  clickBack = () => {
    this.setState({
      activeStep: this.state.activeStep - 1,
    })
  }

  submit = (values, pristineValues) => {
    // on form submission you get the values and pristineValues
  }

  render() {
    const steps = getSteps()

    return (
      <div>
        <Stepper activeStep={this.state.activeStep} alternativeLabel>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <MaterialUIForm onSubmit={this.submit}>
          {this.state.activeStep === 0 &&
            <React.Fragment>
              <TextField
                label="Name"
                type="text"
                name="name"
                value=""
              />
              <Button variant="raised" onClick={this.clickNext}>Next</Button>
            </React.Fragment>
          }

          {this.state.activeStep === 1 &&
            <React.Fragment>
              <TextField
                label="Address"
                type="text"
                name="address"
                value=""
              />
              <Button variant="raised" onClick={this.clickBack}>Back</Button>
              <Button variant="raised" type="submit">Submit</Button>
            </React.Fragment>
          }
        </MaterialUIForm>
      </div>
    )
  }
}
```

#### Dynamic array fields (notice the `deletefieldrow` prop on the "Remove Row" button):
```jsx
import MaterialUIForm from 'material-ui-form'
 

class MyForm extends React.Component {
  state = {
    rows: [{ label: '', value: '' }],
    onSubmitValues: null,
  }

  addRow = () => {
    const { rows } = this.state
    rows.push({ label: '', value: '' })
    this.setState({ rows })
  }

  removeRow = (index) => {
    const { rows } = this.state
    if (rows.length > 1) {
      rows.splice(index, 1)
      this.setState({ rows })
    }
  }

  submit = (values, pristineValues) => {
    // on form submission you get the values and pristineValues
  }

  render() {
    const steps = getSteps()

    return (
      <MaterialUIForm onSubmit={this.submit}>
        {this.state.rows.map((row, i) => (
          <Fragment key={_.uniqueId()}>
            <TextField
              label="Label"
              name={`rows[${i}][label]`}
              value=""
              required
            />
            <TextField
              label="Value"
              name={`rows[${i}][value]`}
              value=""
            />
            { this.state.rows.length > 1 &&
              <Button
                onClick={() => this.removeRow(i)}
                deletefieldrow={`rows[${i}]`}
              >
                Remove Row
              </Button>
            }
          </Fragment>
        ))}
        
        <Button variant="raised" onClick={this.addRow}>Add row</Button>
        <Button variant="raised" color="primary" type="submit">Submit</Button>
      </MaterialUIForm>
    )
  }
}
```

#### Custom components with custom handlers:
```jsx
import MaterialUIForm from 'material-ui-form'
 

class MyForm extends React.Component {
  uploadFile = (event) => {
    console.log(event.target.files)
  }

  render() {
    return (
      <div>
        <MaterialUIForm>
          {'Upload file: '}
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="raised-button-file"
            multiple
            type="file"
            onChange={this.uploadFile}
          />
          <label htmlFor="raised-button-file">
            <Button variant="raised" component="span">
              Upload
            </Button>
          </label>
        </MaterialUIForm>
      </div>
    )
  }
}
```

## Contributing

This is a new project and contributions are welcome so feel free to [open an issue](https://github.com/unitedhubs/material-ui-form/issues) or fork and create a pull request. Collaborators are also welcome - please send an email to info@unitedhubs.com.

## License

This project is licensed under the terms of the [MIT license](https://github.com/unitedhubs/material-ui-form/blob/dev/LICENSE).
