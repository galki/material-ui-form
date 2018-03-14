import validators from './validators'
import validationMessageMap from './validationMessageMap'


function sprintf(str, args) {
  let predicate
  if (_.isString(args)) {
    predicate = args
  } else if (_.isObject(args) && !_.isArray(args)) {
    args = Object.values(args)
    predicate = (match, number) => (
      args[number] !== undefined ? args[number] : match
    )
  } else {
    predicate = (match, number) => (
      // eslint-disable-next-line no-nested-ternary
      args[number] !== undefined
        ? (_.isArray(args) ? args.join(', ') : args[number])
        : match
    )
  }
  return str.replace(/{(\d+)}/g, predicate)
}

let messageMap = _.clone(validationMessageMap)

export const createValidation = (
  validator,
  args,
  formValidationMessageMap,
  validationMessageKeyPrefix
) => {
  if (!_.isEmpty(formValidationMessageMap)) {
    messageMap = formValidationMessageMap
  }

  let code = validator
  // first check if prefix code exists
  if (!validator.startsWith(validationMessageKeyPrefix)) {
    const prefixedCode = `${validationMessageKeyPrefix}${validator}`
    if (_.has(messageMap, prefixedCode)) {
      code = prefixedCode
    }
  }

  if (!_.has(messageMap, validator)
    && !validator.startsWith(validationMessageKeyPrefix)
  ) {
    code = `${validationMessageKeyPrefix}${validator}`
  }

  let message = messageMap[code]
  if (message !== undefined && (_.isNumber(args) || !_.isEmpty(args))) {
    message = sprintf(message, args)
  }
  return { code, message }
}

export const validate = (
  value,
  fieldValidators,
  formValidationMessageMap,
  validationMessageKeyPrefix
) => {
  const validations = []
  if (_.isEmpty(fieldValidators)) {
    return []
  } else if (!_.isArray(fieldValidators)) {
    // eslint-disable-next-line no-console
    console.error('invalid validators format:', fieldValidators)
    return false
  }

  fieldValidators.forEach((validator) => {
    let args
    if (_.isObject(validator) && _.size(validator) === 1) {
      args = Object.values(validator)[0] // eslint-disable-line prefer-destructuring
      validator = Object.keys(validator)[0] // eslint-disable-line prefer-destructuring
    } else if (!_.isString(validator)) {
    // eslint-disable-next-line no-console
      console.error('invalid validator:', validator)
    }

    if (validators[validator] === undefined) {
    // eslint-disable-next-line no-console
      console.error('undefined validator:', validator)
    } else {
      value = String(value)
      const validation = validators[validator](value, args)
      // console.log(validator, value, args, validation)
      if (!validation) {
        validations.push(createValidation(
          validator,
          args,
          formValidationMessageMap,
          validationMessageKeyPrefix
        ))
      }
    }
  })

  return validations
}

export {
  validators,
  validationMessageMap,
}
