import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types' // eslint-disable-line import/no-extraneous-dependencies

import Grid from 'material-ui/Grid'
import Button from 'material-ui/Button'
import TextField from 'material-ui/TextField'
import { withStyles } from 'material-ui/styles'
import Divider from 'material-ui/Divider'
import IconButton from 'material-ui/IconButton'

import Form from '../../src/index'
import styles from '../styles'


function getSteps() {
  return [
    'Step 1',
    'Step 2',
  ]
}

const inputStyle = {
  marginRight: '20px',
  width: '250px',
}

@withStyles(styles)
export default class DynamicFields extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
  }

  state = {
    rows: [{ label: '', value: '' }],
    onSubmitValues: null,
  }

  addRow = () => {
    const rows = _.clone(this.state.rows)
    console.log(rows)
    rows.push({ label: '', value: '' })
    this.setState({ rows })
  }

  removeRow = (index) => {
    console.log('remove:', index)
    const rows = _.clone(this.state.rows)
    if (rows.length > 1) {
      delete rows[index]
      // console.log(_.compact(rows))
      this.setState({ rows: _.compact(rows) })
    }
  }

  updateRows = (values) => {
    _.defer(() => {
      // this.setState({ rows: formDataToObject.toObj(values).rows })
      console.log('update:', this.state.rows)
    })
  }

  submit = (values, pristineValues) => {
    // eslint-disable-next-line no-console
    console.log('submit values:', values, 'pristine values:', pristineValues)
    this.setState({ onSubmitValues: values })
  }

  render() {
    const { classes } = this.props

    return (
      <Grid
        container
        direction="row"
        wrap="nowrap"
      >
        <Grid item xs className={classes.gridItem}>
          <Form onSubmit={this.submit} onValuesChange={this.updateRows}>
            {this.state.rows.map((row, i) => (
              // eslint-disable-next-line react/no-array-index-key
              <Fragment key={row + i}>
                <TextField
                  label="Label"
                  helperText="what are you encrypting?"
                  data-validators="isRequired"
                  name={`rows[${i}][label]`}
                  value={row.label}
                  style={inputStyle}
                />
                <TextField
                  label="Value"
                  helperText="the data you want to encrypt"
                  data-validators="isRequired"
                  name={`rows[${i}][value]`}
                  value={row.value}
                  style={inputStyle}
                />
                { i > 0 &&
                  <Button onClick={() => this.removeRow(i)}>Remove Row</Button>
                }
              </Fragment>
            ))}
            <br /><br />
            <Button variant="raised" onClick={this.addRow}>Add row</Button>
            <Divider style={{ margin: '20px 0' }} />
            <Button variant="raised" color="primary" type="submit">Submit</Button>
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
