import constants from '../constants'


it('should have a key-value set', () => {
  expect(constants).toMatchObject({
    REQUIRED_VALIDATOR_NAME: 'isRequired',
  })
})
