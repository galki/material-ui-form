import validators from './validators'
import defaultValidationMessageMap from './validationMessageMap'


const INPUT_CODE_PREFIX = ''

function sprintf(str, args) {
  return str.replace(/{(\d+)}/g, (match, number) => (
    args[number] !== undefined ? args[number] : match
  ))
}

export const createValidation = (validator, args, validationMessageMap) => {
  if (_.isEmpty(validationMessageMap)) {
    validationMessageMap = defaultValidationMessageMap
  }

  const code = (
    _.has(validationMessageMap, validator) || validator.startsWith(INPUT_CODE_PREFIX)
  )
    ? validator
    : `${INPUT_CODE_PREFIX}${validator}`
  let message = validationMessageMap[code]
  if (message !== undefined && (_.isNumber(args) || !_.isEmpty(args))) {
    message = sprintf(message, args)
  }
  return { code, message }
}

export const validate = (value, fieldValidators, validationMessageMap) => {
  console.log('!!!')
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

      console.log('VALIDATION:', validator, value)

      const validation = validators[validator](value, ...args)
      if (!validation) {
        validations.push(createValidation(validator, args, validationMessageMap))
      }
    }
  })

  return validations
}

export {
  validators,
  defaultValidationMessageMap,
}
