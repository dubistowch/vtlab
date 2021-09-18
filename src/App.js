import React, { Component } from 'react'
import App from 'base-shell/lib'
import config from './config'
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

library.add(fab, fas, far)

export default class Demo extends Component {
  render() {
    return <App config={config} />
  }
}
