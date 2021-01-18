/*
 * Main Redux store setup used for enhanced data management
 * For more information: https://redux.js.org/
 */

import { configureStore } from '@reduxjs/toolkit'
import thunk from 'redux-thunk' // Allows for asynchronous dispatches

import accountReducer from './components/account/accountSlice'
import intersectReducer from './components/intersect/intersectSlice'
import meetReducer from './components/meet/meetSlice'
import chatReducer from './components/chat/chatSlice'

export default configureStore({
  reducer: {
    account: accountReducer,
    intersect: intersectReducer,
    meet: meetReducer,
    chat: chatReducer,
  },
  middleware: [thunk],
})
