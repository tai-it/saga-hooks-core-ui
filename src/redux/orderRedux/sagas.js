import { put, takeLatest } from 'redux-saga/effects'
import * as Types from './types'
import { callApi } from '../../utils/apiCaller'

function* fetchOrdersSaga({ payload }) {
  try {
    const { pageIndex, pageSize, fromDate, toDate } = payload
    const token = localStorage.getItem("_token")

    let url = `dashboard/order?offset=${pageIndex || 1}&limit=${pageSize || 10}`

    if (fromDate && toDate) {
      url += `&fromDate=${fromDate}&toDate=${toDate}`
      
    }
    const response = yield callApi(url, 'GET', null, token)
    yield put({ type: Types.FETCH_ORDERS_SUCCEEDED, payload: response.data })
  } catch (error) {
    console.log("function*fetchOrdersSaga -> error", error)
    yield put({ type: Types.FETCH_ORDERS_FAILED, payload: {} })
  }
}

export const watchStationSaga = [
  takeLatest(Types.FETCH_ORDERS_REQUEST, fetchOrdersSaga)
]