import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { validate } from '../../../../models/ContractModel'
import { Translate } from 'react-redux-i18n'
import { validateAddress } from '../../../../redux/settings/contractsManager/contracts'

export const FORM_SETTINGS_CONTRACT = 'SettingsContractForm'

const mapStateToProps = (state) => ({
  initialValues: state.get('settingsContracts').selected.set('address', '')
})

@connect(mapStateToProps)
@reduxForm({form: FORM_SETTINGS_CONTRACT, validate, asyncValidate: validateAddress})
class ContractForm extends Component {
  render () {
    const {submitting} = this.props

    console.log(this.props)
    return (
      <form onSubmit={this.props.handleSubmit}>
        <Field component={TextField}
           name='address'
           style={{width: '100%'}}
           floatingLabelText={<Translate value='common.ethAddress'/>}
        />
      </form>
    )
  }
}

export default ContractForm
