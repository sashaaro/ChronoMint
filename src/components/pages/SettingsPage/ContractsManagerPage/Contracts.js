import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn } from 'material-ui/Table'
import { Dialog, FlatButton, RaisedButton, Paper, Divider, CircularProgress } from 'material-ui'
import { Translate } from 'react-redux-i18n'
import globalStyles from '../../../../styles'
import styles from '../styles'
import { listContract, modifyToggle, removeToggle } from '../../../../redux/settings/contractsManager/contracts'
import AbstractContractDAO from '../../../../dao/AbstractContractDAO'
import ContractModel from '../../../../models/ContractModel'
import ContractForm from './ContractForm'

const mapStateToProps = (state) => {
  state = state.get('settingsContracts')
  return {
    list: state.list,
    isFetched: state.isFetched,
    selected: state.selected
  }
}

const mapDispatchToProps = (dispatch) => ({
  getList: () => dispatch(listContract()),
  modifyToggle: (contract) => dispatch(modifyToggle(contract)),
  removeToggle: () => dispatch(removeToggle()),
})

@connect(mapStateToProps, mapDispatchToProps)
export default class Contacts extends Component {
  componentWillMount () {
    if (!this.props.isFetched) {
      this.props.getList()
    }
  }

  render () {
    const {list, isFetched, selected} = this.props

    let body =
      <TableRow>
        <TableRowColumn>
          <CircularProgress size={24} thickness={1.5}/>
        </TableRowColumn>
      </TableRow>

    if (isFetched) {
      body = list.map((contract: ContractModel, i) =>
        <TableRow key={i}>
          <TableRowColumn style={styles.columns.name}>{contract.get('name')}</TableRowColumn>
          <TableRowColumn style={styles.columns.address}>{contract.get('address')}</TableRowColumn>
          <TableRowColumn style={styles.columns.action}>
            <RaisedButton label='Modify' style={styles.actionButton} onTouchTap={this.props.modifyToggle.bind(null, contract)}/>
          </TableRowColumn>
        </TableRow>
      )
    }

    let dialogModal = null
    if (selected) {
      dialogModal =
        <Dialog
          title='Modify CBE address'
          actions={[
            <FlatButton
              label='Cancel'
              primary
              onTouchTap={this.props.removeToggle.bind(null)}
            />,
            <FlatButton
              label='Modify'
              primary
              keyboardFocused
            />
          ]}
          modal={false}
          open={true}
          onRequestClose={this.props.removeToggle.bind(null, null)}
        >
          Do you really want to modify "{this.props.selected.get('name')}" contract
          with address "{this.props.selected.get('address')}"?
          <ContractForm/>
        </Dialog>
    }

    return (
      <Paper style={globalStyles.paper}>
        <h3 style={globalStyles.title}><Translate value='settings.contracts.title'/></h3>
        <Divider />
        <Table>
          <TableHeader className='xs-hide' adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn style={styles.columns.name}><Translate value='common.name'/></TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.address}><Translate value='common.address'/></TableHeaderColumn>
              <TableHeaderColumn style={styles.columns.action}><Translate value='nav.actions'/></TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody className='xs-reset-table' displayRowCheckbox={false}>
            {body}
          </TableBody>
        </Table>

        {dialogModal}

        <div style={globalStyles.clear}/>
      </Paper>
    )
  }
}
