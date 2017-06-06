import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm } from 'redux-form/immutable'
import { TextField } from 'redux-form-material-ui'
import { validate } from '../../../../models/ContractModel'
import { Translate } from 'react-redux-i18n'

const mapStateToProps = (state) => ({
  initialValues: state.get('settingsContracts').selected.set('address', '')
})

@connect(mapStateToProps, null, null, {withRef: true})
@reduxForm({form: 'SettingsContractForm', validate, asyncValidate: () => {
  // todo
}})
class ContractForm extends Component {
  render () {
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
