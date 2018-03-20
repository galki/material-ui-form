import React from 'react'
import { shallow } from 'enzyme' // eslint-disable-line import/no-extraneous-dependencies
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'

import Form from '../Form'
import FieldClone from '../FieldClone'


describe('<Form />', () => {
  const submit = jest.fn()

  const wrapper = shallow(
    <Form
      onSubmit={submit}
    >
      <TextField
        label="Name"
        type="text"
        name="name"
        value="mufasa"
        data-validators="isRequired,isAlpha"
      />
      <Button variant="raised" type="submit">Submit</Button>
    </Form>
  )

  it('should render', () => {
    expect(wrapper).toMatchSnapshot()
  })

  it('should have set validation', () => {
    const { validation } = wrapper.instance()
    expect(validation).toHaveProperty('messageMap')
    expect(validation).toHaveProperty('messageMapKeyPrefix')
    expect(validation).toHaveProperty('requiredValidatorName')
    expect(validation).toHaveProperty('validate')
    expect(validation).toHaveProperty('validators')
  })

  it('should have a set state', () => {
    expect(wrapper.state()).toMatchObject({
      disableSubmitButton: false,
      fields: {},
    })
  })

  it('should have 2 children', () => {
    expect(wrapper.children()).toHaveLength(2)
  })

  // it('should have a cloned TextField', () => {
  //   expect(wrapper.find(TextField)).toBeInstanceOf(FieldClone)
  // })

  // it('should have a non-cloned Button', () => {
  //   expect(wrapper.find(Button)).not.toBeInstanceOf(FieldClone)
  // })

  it('should handle submit event', () => {
    const { onSubmit } = wrapper.instance().props
    const event = new Event('submit')
    wrapper.simulate('submit', event)
    expect(onSubmit).toHaveBeenCalled()
  })
})
