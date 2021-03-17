/*
 * Redux slice for the Intersect component, caching the data in case of unmount
 * and handling server interactions
 * (NOTE: Currently just uses test data)
 *
 * Sends to state.intersect
 */

import { createSlice } from '@reduxjs/toolkit'

export const intersectSlice = createSlice({
  name: 'account',
  initialState: {
    username: '',
    songs: [],
  },
  reducers: {
    setIntersectUsername: (state, action) => {
      state.username = action.payload
    },
    setSongs: (state, action) => {
      state.songs = action.payload
    },
    resetIntersectData: state => {
      state = { username: '', songs: [] }
    },
  }
})

export const { setIntersectUsername, setSongs, resetIntersectData } = intersectSlice.actions
export default intersectSlice.reducer
