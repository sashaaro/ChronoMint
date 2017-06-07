import Immutable from 'immutable'
import ContractsManagerDAO from '../../../dao/ContractsManagerDAO'
import AbstractContractDAO from '../../../dao/AbstractContractDAO'
import ContractModel from '../../../models/ContractModel'

export const CONTRACTS_MANAGER_FETCH_LIST = 'settings/CONTRACTS_MANAGER_FETCH_LIST'
export const CONTRACTS_MANAGER_UPDATE_CONTRACT = 'settings/CONTRACTS_MANAGER_UPDATE_CONTRACT'
export const CONTRACTS_MANAGER_SET_SELECTED = 'settings/CONTRACTS_MANAGER_SET_SELECTED'
export const CONTRACTS_MANAGER_REMOVE_SELECTED = 'settings/CONTRACTS_MANAGER_REMOVE_SELECTED'

const initialState = {
  list: new Immutable.Map(),
  isFetched: false,
  selected: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTRACTS_MANAGER_FETCH_LIST:
      return {
        ...state,
        list: action.list,
        isFetched: true
      }
    case CONTRACTS_MANAGER_UPDATE_CONTRACT:
      return {
        ...state,
        list: state.list.set(action.contract.get('name'), action.contract),
      }
    case CONTRACTS_MANAGER_SET_SELECTED:
      return {
        ...state,
        selected: action.selected,
      }
    case CONTRACTS_MANAGER_REMOVE_SELECTED:
      return {
        ...state,
        selected: null,
      }
    default:
      return state
  }
}

export const fetchContractsList = () => async (dispatch) => {
  const contracts = await ContractsManagerDAO.getDAOContracts()
  let map = {}
  contracts.map((contractDAO: AbstractContractDAO) => {
    map[contractDAO.getContractName()] = new ContractModel({
      name: contractDAO.getContractName(),
      address: contractDAO.getInitAddress(),
      dao: contractDAO
    })
  })

  const list = new Immutable.Map(map)

  dispatch({type: CONTRACTS_MANAGER_FETCH_LIST, list})
}

export const setSelected = (selected: ContractModel) => (dispatch) => {
  dispatch({type: CONTRACTS_MANAGER_SET_SELECTED, selected})
}
export const removeSelected = () => (dispatch) => {
  dispatch({type: CONTRACTS_MANAGER_REMOVE_SELECTED})
}

export const validateAddress = async (contract: ContractModel) => {
  const dao: AbstractContractDAO = contract.get('dao')
  const address: string = contract.get('address')
  const isSameContract = await dao.isSameContractCode(address)

  if (!isSameContract) {
    throw {address: 'Can\'t init ' + dao.getContractName() + ' at ' + address}
  }
}

export const updateSelected = (selected: ContractModel, newAddress) => async (dispatch) => {
  const prevAddress = selected.get('address')
  selected = selected.set('address', newAddress).fetching()

  dispatch({type: CONTRACTS_MANAGER_UPDATE_CONTRACT, contract: selected})
  dispatch(removeSelected())

  try {
    await ContractsManagerDAO.setContractAddress(prevAddress, selected.get('address'))
    dispatch({type: CONTRACTS_MANAGER_UPDATE_CONTRACT, contract: selected.notFetching()})
  } catch (e) {
    dispatch({type: CONTRACTS_MANAGER_UPDATE_CONTRACT, contract: selected.set('address', prevAddress).notFetching()})
  }
}



