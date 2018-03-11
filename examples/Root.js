import React from 'react'
import ReactDOM from 'react-dom'

/* eslint-disable import/no-extraneous-dependencies */
import { BrowserRouter, Link, Route } from 'react-router-dom'

import Reboot from 'material-ui/Reboot'
import AppBar from 'material-ui/AppBar'
import Toolbar from 'material-ui/Toolbar'
import Button from 'material-ui/Button'
/* eslint-enable import/no-extraneous-dependencies */

import './styles.less'
import MultiStep from './MultiStep'


const wrapperStyle = {
  backgroundColor: 'white',
  height: 'inherit',
  overflowX: 'hidden',
  overflowY: 'auto',
}

const linkStyle = {
  fontFamily: 'sans-serif',
  textDecoration: 'none',
  color: 'white',
}

const Root = () => (
  <div style={wrapperStyle}>
    <Reboot />
    <BrowserRouter>
      <div>
        <AppBar position="sticky">
          <Toolbar>
            <Button><Link to="/" style={linkStyle}>MultiStep</Link></Button>
          </Toolbar>
        </AppBar>

        <Route exact path="/" component={MultiStep} />
      </div>
    </BrowserRouter>
  </div>
)

ReactDOM.render(<Root />, document.querySelector('#root'))
