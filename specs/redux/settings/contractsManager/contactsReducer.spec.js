import Immutable from 'immutable'
import reducer, * as c from '../../../../src/redux/settings/contractsManager/contracts'
import ContractModel from '../../../../src/models/ContractModel'

const contract = new ContractModel({address: '0x123', name: 'TestContract'})

let list = new Immutable.Map()
list = list.set(contract.get('name'), contract)

const initialState = {
  list: new Immutable.Map(),
  isFetched: false,
  selected: null
}

describe('settings contracts reducer', () => {
  it('should return the initial state', () => {
    expect(
      reducer(undefined, {})
    ).toEqual(initialState)
  })

  it('should handle CONTRACTS_MANAGER_FETCH_LIST', () => {
    expect(
      reducer([], {type: c.CONTRACTS_MANAGER_FETCH_LIST, list})
    ).toEqual({
      list,
      isFetched: true
    })
  })

  it('should handle CONTRACTS_MANAGER_SET_SELECTED', () => {
    expect(
      reducer([], {type: c.CONTRACTS_MANAGER_SET_SELECTED, selected: contract})
    ).toEqual({
      selected: contract
    })
  })

  it('should handle CONTRACTS_MANAGER_REMOVE_SELECTED', () => {
    expect(
      reducer([], {type: c.CONTRACTS_MANAGER_REMOVE_SELECTED})
    ).toEqual({
      selected: null
    })
  })

  it('should handle CONTRACTS_MANAGER_UPDATE_CONTRACT', () => {
    list = list.set(contract.get('name'), contract.set('address', '0x456'))
    expect(
      reducer({list: new Immutable.Map()}, {type: c.CONTRACTS_MANAGER_UPDATE_CONTRACT, contract: contract.set('address', '0x456')})
    ).toEqual({
      list
    })
  })
})
