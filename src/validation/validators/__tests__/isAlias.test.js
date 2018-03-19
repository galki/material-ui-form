import isAlias from '../isAlias'


test('isAlias is true', () => {
  expect(isAlias('azAZ09-_.')).toBe(true)
})
