import React from 'react'
import ReactDOM from 'react-dom'

/* eslint-disable import/no-extraneous-dependencies */
import { BrowserRouter, Link, Route } from 'react-router-dom'

import CssBaseline from 'material-ui/CssBaseline'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
/* eslint-enable import/no-extraneous-dependencies */

import './styles.less'
import MultiStep from './pages/MultiStep'
import NestedFields from './pages/NestedFields'
import ExtendedValidators from './pages/ExtendedValidators'


const wrapperStyle = {
  backgroundColor: 'white',
  height: 'inherit',
  overflowX: 'hidden',
  overflowY: 'auto',
}

const Root = () => (
  <div style={wrapperStyle}>
    <CssBaseline />
    <BrowserRouter>
      <div>
        <AppBar position="sticky">
          <Toolbar>
            <Button>
              <Link to="/">Nested Fields</Link>
            </Button>
            <Button>
              <Link to="/extended-validators">Extended Validators</Link>
            </Button>
            <Button>
              <Link to="/multi-step">MultiStep</Link>
            </Button>
          </Toolbar>
        </AppBar>

        <Route exact path="/" component={NestedFields} />
        <Route exact path="/extended-validators" component={ExtendedValidators} />
        <Route exact path="/multi-step" component={MultiStep} />
      </div>
    </BrowserRouter>
  </div>
)

ReactDOM.render(<Root />, document.querySelector('#root'))
