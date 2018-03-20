import React from 'react'
import { shallow, mount, render } from 'enzyme'
import TextField from 'material-ui/TextField'

import FieldClone from '../FieldClone'


describe('<FieldClone />', () => {
  const field = {
    isPristine: true,
    isRequired: null,
    pristineValue: null,
    validations: [],
    validators: [],
    value: undefined,
  }

  const onFieldConstruct = jest.fn(({ checked, name, required, value }) => {})
  const onFieldToggle = ({ event, checked }) => {}
  const onFieldValueChange = ({ name, value }) => {}

  const wrapper = shallow(
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
    expect(wrapper).toMatchSnapshot()
  })

  it('should have a single child', () => {
    expect(wrapper.find(TextField)).toHaveLength(1)
  })

  it('should not throw if field type prop is undefined', () => {
    function checkTypeName() {
      if (wrapper.instance().props.children.type.name === undefined) {
        throw new Error('FieldClone does not support native elements')
      }
    }
    expect(checkTypeName).not.toThrow()
  })

  it('should not throw if field component name and value are defined', () => {
    function testNameAndValueProps() {
      const { name, value } = wrapper.instance().props.children.props
      if (name === undefined || value === undefined) {
        throw new Error('FieldClone name and value must be defined')
      }
    }
    expect(testNameAndValueProps).not.toThrow()
  })

  it('should have a rendered child with an undefined value prop', () => {
    expect(wrapper.prop('value')).toBeUndefined()
  })

  it('should call onConstruct', () => {
    expect(wrapper.instance().props.onConstruct).toHaveBeenCalled()
  })
})
