import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash' // eslint-disable-line import/no-extraneous-dependencies

import {
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
} from 'material-ui/Form'
import { InputLabel } from 'material-ui/Input'

import FormControlClone from './FormControlClone'
import FormControlLabelClone from './FormControlLabelClone'
import FieldClone from './FieldClone'
import { validate } from '../validation'


const FIELD_VALIDATORS_PROP_NAME = 'data-validators'
const REQUIRED_VALIDATOR_NAME = 'isRequired'

function checkElementInteractivity(component) {
  const whitelist = [
    FormControlLabel,
  ]

  return whitelist.includes(component.type)
   || (_.has(component, 'props.name') && _.has(component, 'props.value'))
}

function isValidForm(fields) {
  return _.size(_.filter(fields, field => field.validations.length > 0)) === 0
}

function getFieldValues(fields) {
  const values = {}
  _.each(fields, (field, name) => { values[name] = field.value })
  return values
}

function getPristineFieldValues(fields) {
  const values = {}
  _.each(fields, (field, name) => {
    if (!field.isPristine) {
      values[name] = field.pristineValue
    }
  })
  return values
}

function extractFieldValidators(fieldProps) {
  let validators = _.get(fieldProps, FIELD_VALIDATORS_PROP_NAME)
  if (validators !== undefined) {
    if (_.isString(validators)) {
      validators = validators.replace(/\s/g, '').split(',')
    } else if (!_.isArray(validators)) {
      validators = [validators]
    }
    return validators
  }
  return []
}

function getFieldTemplate() {
  return {
    isPristine: true,
    isRequired: null,
    pristineValue: null,
    validations: [],
    validators: [],
    value: null,
  }
}

export default class Form extends React.Component {
  static propTypes = {
    children: PropTypes.array.isRequired,
    disableSubmitButtonOnError: PropTypes.bool,
    requiredValidatorName: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.bool,
    ]),
    validate: PropTypes.func,
    validations: PropTypes.object,
    validationMessageMap: PropTypes.object,
    validationMessageKeyPrefix: PropTypes.string,
    onSubmit: PropTypes.func.isRequired,
  }

  static defaultProps = {
    disableSubmitButtonOnError: true,
    requiredValidatorName: REQUIRED_VALIDATOR_NAME,
    validate: null,
    validations: {},
    validationMessageMap: {},
    validationMessageKeyPrefix: '',
  }

  constructor(props) {
    super(props)
    this.validate = props.validate || validate
    this.state = {
      disableSubmitButton: false,
      fields: {},
    }
  }

  componentWillReceiveProps(nextProps) {
    const { fields } = this.state
    _.each(nextProps.validations, (validations, name) => {
      fields[name].validations = validations
    })
    this.setState({ fields })
  }

  onFieldConstruct = (fieldProps) => {
    const {
      checked,
      name,
      required,
      value,
    } = fieldProps

    // checkable input
    if (checked === true) {
      _.defer(() => {
        this.setState({
          fields: {
            ...this.state.fields,
            [name]: {
              ...getFieldTemplate(),
              checked: checked || false,
              value,
            },
          },
        })
      })
    // other inputs
    } else if (!_.isBoolean(checked)) {
      const { requiredValidatorName } = this.props
      if (!_.has(this.state.fields, name)) {
        const validators = extractFieldValidators(fieldProps)

        if (required && !_.isEmpty(requiredValidatorName)) {
          validators.unshift(requiredValidatorName)
        }
        const isRequired = required || validators.includes(requiredValidatorName)

        _.defer(() => {
          this.setState({
            fields: {
              ...this.state.fields,
              [name]: {
                ...getFieldTemplate(),
                isRequired,
                pristineValue: value,
                validators,
                value,
              },
            },
          })

          if (!_.isEmpty(validators) && !_.isEmpty(value)) {
            this.validateField(name, value)
          }
        })
      }
    }
  }

  onFieldValueChange = (name, value) => {
    _.defer(() => {
      this.setState({
        fields: {
          ...this.state.fields,
          [name]: {
            ...this.state.fields[name],
            isPristine: false,
            validations: [],
            value,
          },
        },
      })

      if (isValidForm(this.state.fields)) {
        this.enableSubmitButton()
      }

      this.validateField(name, value)
    })
  }

  onFieldToggle = (name, value, checked) => {
    if (_.isEmpty(value)) {
      const fields = _.omit(this.state.fields, name)
      this.setState({ fields })
    } else {
      this.onFieldConstruct({ name, value, checked }, true)
    }
  }

  validateField = (name, value) => {
    const field = this.state.fields[name]

    const validations = this.validate(
      String(value),
      field.validators,
      this.props.validationMessageMap,
      this.props.validationMessageKeyPrefix
    )

    field.validations = validations
    this.setState({
      fields: {
        ...this.state.fields,
        [name]: field,
      },
    })
  }

  submit = (event) => {
    event.preventDefault()
    const { fields } = this.state
    _.each(fields, (field, name) => {
      if (field.isRequired && field.value === '') {
        this.validateField(name, '')
      }
    })

    if (!isValidForm(fields)) {
      this.disableSubmitButton()
    } else {
      this.props.onSubmit(
        getFieldValues(fields),
        getPristineFieldValues(fields)
      )
    }
  }

  enableSubmitButton() {
    if (this.state.disableSubmitButton) {
      this.setState({ disableSubmitButton: false })
    }
  }

  disableSubmitButton() {
    if (this.props.disableSubmitButtonOnError) {
      this.setState({ disableSubmitButton: true })
    }
  }

  cloneChildrenRecursively(children) {
    return React.Children.map(children, (child) => {
      // skip blanks
      if (_.isEmpty(child)) {
        return null
      }

      const isInteractiveElement = checkElementInteractivity(child)
      const nestedChildren = _.isArray(child.props.children) && !isInteractiveElement
        ? _.filter(child.props.children, _.isObject)
        : false

      // nested elements
      if (nestedChildren !== false) {
        // FormControl element
        if (child.type === FormControl) {
          const fieldElement = nestedChildren.find(el =>
            ![FormLabel, InputLabel, FormHelperText].includes(el.type)
            // el.type !== FormLabel
            // && el.type !== InputLabel
            // && el.type !== FormHelperText
            && el.props.name !== undefined
            && el.props.value !== undefined)
          // name/value group
          if (fieldElement !== undefined) {
            const { name } = fieldElement.props
            return (
              <FormControlClone
                key={name}
                field={this.state.fields[name]}
                formControlElement={child}
                onConstruct={this.onFieldConstruct}
                onValueChange={this.onFieldValueChange}
              />
            )
          // non-name/value group
          // eslint-disable-next-line
          }/* else {

          }*/
        }
        // non-FormControl element
        return (
          <child.type>
            {this.cloneChildrenRecursively(nestedChildren)}
          </child.type>
        )
      }
      // add disable functionality to submit button
      if (child.props.type === 'submit') {
        return React.cloneElement(child, {
          disabled: this.state.disableSubmitButton,
        })
      // non-interactive elements should be rendered as is
      } else if (!isInteractiveElement) {
        return child
      }
      // clone control label
      if (child.type === FormControlLabel) {
        const { name } = child.props.control.props
        return (
          <FormControlLabelClone
            key={name}
            field={this.state.fields[name]}
            control={child.props.control}
            label={child.props.label}
            onConstruct={this.onFieldConstruct}
            onToggle={this.onFieldToggle}
          />
        )
      }
      // clone input element
      const { name } = child.props
      return (
        <FieldClone
          key={name}
          field={this.state.fields[name]}
          onConstruct={this.onFieldConstruct}
          onToggle={this.onFieldToggle}
          onValueChange={this.onFieldValueChange}
          requiredValidatorName={this.props.requiredValidatorName}
        >
          {child}
        </FieldClone>
      )
    })
  }

  render() {
    return (
      <form
        onSubmit={this.submit}
        autoComplete="false"
      >
        { this.cloneChildrenRecursively(this.props.children) }
      </form>
    )
  }
}
