/* eslint-disable import/no-extraneous-dependencies */
import React from 'react'
import { shallow, mount, render } from 'enzyme'
import renderer from 'react-test-renderer'
/* eslint-enable import/no-extraneous-dependencies */

import TextField from 'material-ui/TextField'

import FieldClone from '../FieldClone'


describe('FieldClone component', () => {
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

  const el = (
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

  const wrapper = shallow(el)

  function checkIfNative(component) {
    if (component.type.name === undefined) {
      throw new Error('FieldClone does not support native elements')
    }
  }

  it('should render without throwing an error', () => {
    const component = renderer.create(el)
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  })

  it('should have a single child', () => {
    expect(wrapper.find(TextField)).toHaveLength(1)
  })

  it('should not throw', () => {
    function checkTextFieldType() {
      checkIfNative({ type: { name: 'TextField' } })
    }
    expect(() => checkTextFieldType()).not.toThrow()
  })

  it('should have useNativeRequiredValidator prop set to false', () => {
    expect(wrapper.instance().props.useNativeRequiredValidator).toBe(false)
  })

  it('should have a rendered label equal to Name', () => {
    expect(wrapper.props().label).toEqual('Name')
  })
})
