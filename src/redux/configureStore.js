import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import Immutable from 'immutable'
import { browserHistory } from 'react-router'
import { combineReducers } from 'redux-immutable'
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux'
import { reducer as formReducer } from 'redux-form/immutable'
import routingReducer from './routing'
import * as ducksReducers from './ducks'
import { intlReducer } from 'react-intl-redux'
import LS from '../utils/LocalStorage'
import i18nMessages from '../i18n'
import { flattenMessages } from '../utils/helper'
import en from 'react-intl/locale-data/en';
import ru from 'react-intl/locale-data/ru';
import {addLocaleData} from 'react-intl';

addLocaleData([...en, ...ru])

const getNestedReducers = (ducks) => {
  let reducers = {}
  Object.keys(ducks).forEach(r => {
    reducers = {...reducers, ...(typeof (ducks[r]) === 'function' ? {[r]: ducks[r]} : getNestedReducers(ducks[r]))}
  })
  return reducers
}

// Create enhanced history object for router
const createSelectLocationState = () => {
  let prevRoutingState, prevRoutingStateJS
  return (state) => {
    const routingState = state.get('routing') // or state.routing
    if (typeof prevRoutingState === 'undefined' || prevRoutingState !== routingState) {
      prevRoutingState = routingState
      prevRoutingStateJS = routingState.toJS()
    }
    return prevRoutingStateJS
  }
}

const defaultLocale = 'en'
let locale = LS.getLocale() || defaultLocale

const configureStore = () => {
  if (!i18nMessages[locale]) {
    locale = defaultLocale
  }
  const initialState = Immutable.fromJS({
    intl: {
      defaultLocale: defaultLocale,
      locale: locale,
      messages: flattenMessages(i18nMessages[locale])
    }
  })

  const appReducer = combineReducers({
    form: formReducer,
    routing: routingReducer,
    intl: intlReducer,
    ...getNestedReducers(ducksReducers)
  })

  const createStoreWithMiddleware = compose(
    applyMiddleware(
      thunk,
      routerMiddleware(browserHistory)
    ),
    window.devToolsExtension
      ? window.devToolsExtension()
      : (f) => f
  )(createStore)

  return createStoreWithMiddleware(
    appReducer,
    initialState
  )
}

const store = configureStore()

const history = syncHistoryWithStore(browserHistory, store, {
  selectLocationState: createSelectLocationState()
})

export { store, history }
