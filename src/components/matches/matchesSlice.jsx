
/*
 * Redux slice for containing data for the Matches tab
 * (NOTE: Currently just uses test data)
 *
 * Sends to state.matches
 */

import { createSlice } from '@reduxjs/toolkit'

const matchesSlice = createSlice({
  name: 'matches',
  initialState: {
    // Array of dicts containing { displayname, profilePicUrl, songsMatched }
    matches: []
  },
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload
    },
    clearMatches: state => {
      state.matches = []
    },
  }
})

export { matchesSlice }
export const { setMatches, clearMatches } = matchesSlice.actions
export default matchesSlice.reducer
