import React from 'react'
import PropTypes from 'prop-types'

/* eslint-disable import/no-extraneous-dependencies */
import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'
/* eslint-enable import/no-extraneous-dependencies */

import Form from '../../src/index'
import styles from '../styles'


@withStyles(styles)
export default class ExtendValidators extends React.Component {
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
              data-validators="isRequired,MycustomValidator"
              fullWidth
            />
            <fieldset>
              <legend>Nested:</legend>
              <TextField
                label="Age"
                type="text"
                name="age"
                value=""
                data-validators="isInt"
                fullWidth
              />
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
