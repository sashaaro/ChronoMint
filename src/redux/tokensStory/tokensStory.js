import { Map } from 'immutable'
import BlockDataPaginator from '../../utils/BlockDataPaginator'
import FilteredTokensStoryTxsProvider from '../../utils/FilteredTokensStoryTxsProvider'
import TokensStoryFilterModel from '../../models/TokensStoryFilterModel'
import PlatformEmitterDAO from '../../dao/PlatformEmitterDAO'

export const TOKENS_STORY_TRANSACTIONS = 'tokensStory/TRANSACTIONS'
export const TOKENS_STORY_TRANSACTIONS_FETCH = 'tokensStory/TRANSACTIONS_FETCH'
export const TOKENS_STORY_TRANSACTIONS_FETCH_NEXT = 'tokensStory/TRANSACTIONS_FETCH_NEXT'
export const TOKENS_STORY_TRANSACTIONS_CLEAR = 'tokensStory/TRANSACTIONS_FETCH_CLEAR'

const initialState = {
  transactions: new Map(),
  isFetching: false,
  toBlock: null,
  isFetched: false
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case TOKENS_STORY_TRANSACTIONS:
      return {
        ...state,
        transactions: action.transactions,
        isFetched: true,
        isFetching: false
      }
    case TOKENS_STORY_TRANSACTIONS_FETCH_NEXT:
      return {
        ...state,
        transactions: state.transactions.merge(action.map),
        toBlock: action.toBlock,
        isFetched: true,
        isFetching: false
      }
    case TOKENS_STORY_TRANSACTIONS_FETCH:
      return {
        ...state,
        isFetching: true
      }
    case TOKENS_STORY_TRANSACTIONS_CLEAR:
      return {
        ...state,
        transactions: new Map(),
        isFetched: false,
      }
    default:
      return state
  }
}

const paginator = new BlockDataPaginator(new FilteredTokensStoryTxsProvider())
paginator.sizePage = 10

export const nextStoryList = () => (dispatch) => {
  dispatch({type: TOKENS_STORY_TRANSACTIONS_FETCH})

  paginator.findNext().then((txs) => {
    PlatformEmitterDAO.prepareTxsMap(txs).then((map) => {
      dispatch({type: TOKENS_STORY_TRANSACTIONS_FETCH_NEXT, map, toBlock: paginator.isDone ? null : paginator.lastBlockNubmer})
    })
  })
}

export const updateListByFilter = (filter: TokensStoryFilterModel) => (dispatch) => {
  dispatch({type: TOKENS_STORY_TRANSACTIONS_CLEAR})
  paginator.reset()
  paginator.provider.filter = filter
  dispatch(nextStoryList())
}

export default reducer