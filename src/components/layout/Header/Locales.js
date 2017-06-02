import React, { Component } from 'react'
import { connect } from 'react-redux'
import { DropDownMenu, MenuItem } from 'material-ui'
import LS from '../../../utils/LocalStorage'
import i18nMessages from '../../../i18n'
import { updateIntl } from 'react-intl-redux'
import { flattenMessages } from '../../../utils/helper'

const mapStateToProps = (state) => ({
  locale: state.get('intl').locale
})

const mapDispatchToProps = (dispatch, state) => ({
  change: (locale) => {
    if (!i18nMessages[locale]) {
      locale = state.get('intl').defaultLocale
    }
    LS.setLocale(locale)
    dispatch(updateIntl(locale, flattenMessages(i18nMessages[locale])))
  }
})

@connect(mapStateToProps, mapDispatchToProps)
class Locales extends Component {
  handleChange = (event, index, value) => {
    this.props.change(value)
  }

  render () {
    const list = Object.keys(require('../../../i18n/'))
    return (
      <DropDownMenu iconStyle={{paddingTop: '5px'}} labelStyle={{color: 'white', height: 'auto', lineHeight: '36px', top: '5px'}} underlineStyle={{border: 0}} value={this.props.locale} onChange={this.handleChange}>
        {list.map(item =>
          <MenuItem value={item} key={item} primaryText={item} />
        )}
      </DropDownMenu>
    )
  }
}

export default Locales
