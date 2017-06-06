import React, { Component } from 'react'
import styles from '../../styles'
import { Translate } from 'react-redux-i18n'
import Contacts from '../../components/pages/SettingsPage/ContractsManagerPage/Contracts'

export default class ContractsManagerPage extends Component {
  render () {

    return (
      <div>
        <span style={styles.navigation}>
          <Translate value='nav.project' /> / <Translate value='nav.settings' /> /&nbsp;
          <Translate value='settings.contracts.title' />
        </span>

        <Contacts/>
      </div>
    )
  }
}
