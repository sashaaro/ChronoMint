import Immutable from 'immutable'
import ContractsManagerDAO from '../../../dao/ContractsManagerDAO'
import AbstractContractDAO from '../../../dao/AbstractContractDAO'
import ContractModel from '../../../models/ContractModel'

export const CONTRACTS_LIST = 'settings/CONTRACTS_LIST'
export const CLEAN_CONTRACTS_LIST = 'settings/CLEAN_CONTRACTS_LIST'
export const SET_SELECTED = 'settings/SET_SELECTED'
export const UPDATE_SELECTED = 'settings/UPDATE_SELECTED'
export const REMOVE_SELECTED = 'settings/REMOVE_SELECTED'

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
    case CLEAN_CONTRACTS_LIST:
      return {
        ...state,
        list: [],
        isFetched: true
      }
    case SET_SELECTED:
      return {
        ...state,
        selected: action.selected,
      }
    case UPDATE_SELECTED:
      return {
        ...state,
        selected: action.selected,
      }
    case REMOVE_SELECTED:
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

export const cleanContractList = () => (dispatch) => {
  dispatch({type: CLEAN_CONTRACTS_LIST})
}

export const setSelected = (selected: AbstractContractDAO) => (dispatch) => {
  dispatch({type: SET_SELECTED, selected})
}
export const removeSelected = () => (dispatch) => {
  dispatch({type: REMOVE_SELECTED})
}

export const updateSelected = (selected) => (dispatch) => {
  // TODO update selected
  dispatch({type: UPDATE_SELECTED, selected})

  dispatch(cleanContractList())
  dispatch(listContract())
  dispatch(removeSelected())
}



