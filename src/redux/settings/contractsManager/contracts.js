import Immutable from 'immutable'
import ContractsManagerDAO from '../../../dao/ContractsManagerDAO'
import AbstractContractDAO from '../../../dao/AbstractContractDAO'
import ContractModel from '../../../models/ContractModel'

export const CONTRACTS_LIST = 'settings/CONTRACTS_LIST'
export const MODIFY_TOGGLE = 'settings/MODIFY_TOGGLE'
export const REMOVE_TOGGLE = 'settings/REMOVE_TOGGLE'

const initialState = {
  list: [],
  isFetched: false,
  selected: null
}

export default (state = initialState, action) => {
  switch (action.type) {
    case CONTRACTS_LIST:
      return {
        ...state,
        list: action.list,
        isFetched: true
      }
    case MODIFY_TOGGLE:
      return {
        ...state,
        selected: action.contract,
      }
    case REMOVE_TOGGLE:
      return {
        ...state,
        selected: null,
      }
    default:
      return state
  }
}

export const listContract = () => async (dispatch) => {
  const contracts = await ContractsManagerDAO.getDAOContracts()
  dispatch({type: CONTRACTS_LIST, list: contracts.map((contract: AbstractContractDAO) => new ContractModel({
    name: contract.getContractName(),
    address: contract.getInitAddress()
  }))})
}

export const modifyToggle = (contract: AbstractContractDAO) => (dispatch) => {
  dispatch({type: MODIFY_TOGGLE, contract})
}
export const removeToggle = () => (dispatch) => {
  dispatch({type: REMOVE_TOGGLE})
}



