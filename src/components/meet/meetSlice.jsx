
/*
 * Redux slice for containing data for the Meet tab
 * (NOTE: Currently just uses test data)
 *
 * Sends to state.meet
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { TEST_SONG_DATA } from '../intersect/intersectSlice'

// Temporary test matched users
const TEST_USERS = [{
  displayName: 'Dougy doug',
  profilePicUrl: 'https:2x1dks3q6aoj44bz1r1tr92f-wpengine.netdna-ssl.com/wp-content/uploads/2017/05/Square-face-shape-bespke-unit-Bordered-700x700.png',
  songs: TEST_SONG_DATA.concat(TEST_SONG_DATA),
},{
  displayName: 'Dougina Dougette',
  profilePicUrl: 'https://cdn.shopify.com/s/files/1/2979/1564/files/Square_Final_large.png?v=1535503211',
  songs: TEST_SONG_DATA.concat(TEST_SONG_DATA).concat(TEST_SONG_DATA).concat(TEST_SONG_DATA),
}, {
  displayName: 'Dougronamopolis Jr. doug',
  profilePicUrl: 'https://media.allure.com/photos/5771a6723b5256713da4b855/1:1/w_400%2Cc_limit/hair-ideas-2012-05-square-face-hairstyles-olivia-wilde.jpg',
  songs: TEST_SONG_DATA,
}]

const findMatches = createAsyncThunk(
  'meet/findMatchesStatus',
  async ({ username }, thunkAPI) => {
    // For now, just return test data after a pause
    return new Promise(resolve => setTimeout(() => resolve(TEST_USERS), 2000))
  }
)

const meetSlice = createSlice({
  name: 'meet',
  initialState: {
    // Array of dicts containing { displayname, profilePicUrl, songsMatched }
    matches: [],
  },
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload
    },
    clearMatches: state => {
      state.matches = []
    },
  },
  extraReducers: {
    // When findMatches succeeds, do this with the result...
    [findMatches.fulfilled]: (state, action) => {
      state.matches = action.payload
    },
  }
})

export { meetSlice, findMatches }
export const { setMatches, clearMatches } = meetSlice.actions
export default meetSlice.reducer
