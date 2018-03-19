/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { shallow, mount, render } from 'enzyme'
import renderer from 'react-test-renderer'
/* eslint-enable import/no-extraneous-dependencies */

import TextField from 'material-ui/TextField'

import FieldClone from '../FieldClone'


describe('A suite', () => {
  const field = {
    isPristine: true,
    isRequired: null,
    pristineValue: null,
    validations: [],
    validators: [],
    value: null,
  }

  const onFieldConstruct = ({ checked, name, required, value }) => {}
  const onFieldToggle = ({ event, checked }) => {}
  const onFieldValueChange = ({ name, value }) => {}

  const el = shallow(
    <FieldClone
      key="name"
      field={field}
      onConstruct={onFieldConstruct}
      onToggle={onFieldToggle}
      onValueChange={onFieldValueChange}
      useNativeRequiredValidator={false}
    >
      <TextField
        label="Name"
        type="text"
        name="name"
        value="mufasa"
        data-validators="isRequired,isAlpha"
      />
    </FieldClone>
  )

  it('should render without throwing an error', () => {
    expect(el.find(TextField)).toBeTruthy()
  })
})
