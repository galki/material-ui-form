import validators from './validators'
import defaultValidationMessageMap from './validationMessageMap'


function sprintf(str, args) {
  return str.replace(/{(\d+)}/g, (match, number) => (
    args[number] !== undefined ? args[number] : match
  ))
}

export const createValidation = (
  validator,
  args,
  validationMessageMap,
  validationMessageKeyPrefix
) => {
  if (_.isEmpty(validationMessageMap)) {
    validationMessageMap = defaultValidationMessageMap
  }

  let code = validator
  if (!_.has(validationMessageMap, validator)
    && !validator.startsWith(validationMessageKeyPrefix)
  ) {
    code = `${validationMessageKeyPrefix}${validator}`
  }

  let message = validationMessageMap[code]
  if (message !== undefined && (_.isNumber(args) || !_.isEmpty(args))) {
    message = sprintf(message, args)
  }
  return { code, message }
}

export const validate = (
  value,
  fieldValidators,
  validationMessageMap,
  validationMessageKeyPrefix
) => {
  const validations = []
  if (_.isEmpty(fieldValidators)) {
    return []
  } else if (!_.isArray(fieldValidators)) {
    console.error('invalid validators format:', fieldValidators)
    return false
  }

  fieldValidators.forEach((validator) => {
    let args = []
    if (_.isObject(validator) && _.size(validator) === 1) {
      args = Object.values(validator)[0]
      validator = Object.keys(validator)[0]
      if (_.isObject(args)) {
        args = Object.values(args)
      } else if (!_.isArray(args)) {
        args = [args]
      }
    } else if (!_.isString(validator)) {
      console.error('invalid validator:', validator)
    }

    if (validators[validator] === undefined) {
      console.error('undefined validator:', validator)
    } else {
      const validation = validators[validator](value, ...args)
      if (!validation) {
        validations.push(createValidation(
          validator,
          args,
          validationMessageMap,
          validationMessageKeyPrefix
        ))
      }
    }
  })

  return validations
}

export {
  validators,
  defaultValidationMessageMap,
}
