import React from 'react'
import PropTypes from 'prop-types'

/* eslint-disable import/no-extraneous-dependencies */
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import { MenuItem } from 'material-ui/Menu'
import { withStyles } from 'material-ui/styles'
import Checkbox from 'material-ui/Checkbox'
import {
  FormLabel,
  FormControl,
  FormGroup,
  FormControlLabel,
  FormHelperText,
} from 'material-ui/Form'
/* eslint-enable import/no-extraneous-dependencies */

import Form from '../../src/index'
import styles from '../styles'


@withStyles(styles)
export default class NestedFields extends React.Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    onSubmitValues: null,
  }

  submit = (values, pristineValues) => {
    // eslint-disable-next-line no-console
    console.log('submit values:', values, 'pristine values:', pristineValues)
    this.setState({ onSubmitValues: values })
  }

  render() {
    // eslint-disable-next-line no-console
    console.log('Form:', this.props, this.state)
    const { classes } = this.props

    return (
      <Grid
        container
        direction="row"
        wrap="nowrap"
      >
        <Grid item xs className={classes.gridItem}>
          <Form onSubmit={this.submit}>
            <TextField
              label="Name"
              type="text"
              name="name"
              value=""
              data-validators="isRequired,isAlpha"
              fullWidth
            />
            <fieldset>
              <legend>Nested</legend>
              <TextField
                label="Age"
                type="text"
                name="age"
                helperText="enter your real age :o"
                value=""
                data-validators="isInt"
                required
                fullWidth
              />
              <fieldset>
                <legend>Nested nested</legend>
                <TextField
                  select
                  label="Years left"
                  name="yearsLeft"
                  value="a lot"
                  margin="normal"
                  SelectProps={{ native: true }}
                  fullWidth
                >
                  <option value="a lot">A lot</option>
                  <option value="not many">Not many</option>
                </TextField>
                <fieldset>
                  <legend>Nested nested nested</legend>
                  <FormControlLabel
                    control={<Checkbox name="use" value="wisely" />}
                    label="I will use them wisely"
                  />
                </fieldset>
              </fieldset>
            </fieldset>
            <Button variant="raised" type="submit">Submit</Button>
          </Form>
        </Grid>
        <Grid item xs className={classes.gridItem}>
          <pre>
            {this.state.onSubmitValues &&
              JSON.stringify(this.state.onSubmitValues, null, 2)
            }
          </pre>
        </Grid>
      </Grid>
    )
  }
}
