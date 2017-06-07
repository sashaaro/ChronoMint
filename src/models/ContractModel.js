import React from 'react'
import { abstractFetchingModel } from './AbstractFetchingModel'
import validator from '../components/forms/validator'
import ErrorList from '../components/forms/ErrorList'

export default class ContractModel extends abstractFetchingModel({
  name: '',
  address: null,
  dao: null
}) {

}

export const validate = values => {
  const errors = {}
  errors.address = ErrorList.toTranslate(validator.address(values.get('address')))
  return errors
}

