import { put, takeLatest } from 'redux-saga/effects'
import * as Types from './types'
import { callApi } from '../../utils/apiCaller'

function* fetchStationsSaga({ payload }) {
  try {
    const { pageIndex, pageSize, fromDate, toDate } = payload
    const token = localStorage.getItem("_token")
    let url = `dashboard/stations?offset=${pageIndex || 1}&limit=${pageSize || 10}`
    if (fromDate && toDate) {
      url += `&fromDate=${fromDate}&toDate=${toDate}`
    }
    const response = yield callApi(url, 'GET', null, token)
    yield put({ type: Types.FETCH_STATIONS_SUCCEEDED, payload: response.data })
  } catch (error) {
    console.log("function*fetchStationsSaga -> error", error)
    yield put({ type: Types.FETCH_STATIONS_FAILED, payload: {} })
  }
}

export const watchStationSaga = [
  takeLatest(Types.FETCH_STATIONS_REQUEST, fetchStationsSaga)
]