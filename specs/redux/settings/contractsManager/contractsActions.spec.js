import Immutable from 'immutable'
import * as c from '../../../../src/redux/settings/contractsManager/contracts'
import ContractModel from '../../../../src/models/ContractModel'
import { store } from '../../../init'
import { FORM_SETTINGS_CONTRACT } from '../../../../src/components/pages/SettingsPage/ContractsManagerPage/ContractForm'
import AssetsManagerDAO from '../../../../src/dao/AssetsManagerDAO'

const dao = new AssetsManagerDAO()
const contract = new ContractModel({address: dao.getInitAddress(), name: dao.getContractName(), dao})

describe('settings contracts actions', () => {
  it('should list contracts', () => {
    return store.dispatch(c.fetchContractsList()).then(() => {
      const list = store.getActions()[0].list
      expect(list instanceof Immutable.Map).toBeTruthy()
    })
  })

  it('should show form', () => {
    store.dispatch(c.setSelected(contract))
    expect(store.getActions()).toEqual([
      {type: c.CONTRACTS_MANAGER_SET_SELECTED, selected: contract}
    ])
  })

})
