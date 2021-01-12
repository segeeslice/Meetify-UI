
/*
 * Redux slice for containing data for the Meet tab
 * (NOTE: Currently just uses test data)
 *
 * Sends to state.meet
 */

import { createSlice } from '@reduxjs/toolkit'

// Temporary test matched users
const TEST_USERS = [{
  displayName: 'Dougy doug',
  profilePicUrl: 'https:2x1dks3q6aoj44bz1r1tr92f-wpengine.netdna-ssl.com/wp-content/uploads/2017/05/Square-face-shape-bespke-unit-Bordered-700x700.png',
  songsMatched: 27,
},{
  displayName: 'Dougina Dougette',
  profilePicUrl: 'https://cdn.shopify.com/s/files/1/2979/1564/files/Square_Final_large.png?v=1535503211',
  songsMatched: 57,
}, {
  displayName: 'Dougronamopolis Jr. doug',
  profilePicUrl: 'https://media.allure.com/photos/5771a6723b5256713da4b855/1:1/w_400%2Cc_limit/hair-ideas-2012-05-square-face-hairstyles-olivia-wilde.jpg',
  songsMatched: 5,
}]

export const meetSlice = createSlice({
  name: 'meet',
  initialState: {
    // Array of dicts containing { displayname, profilePicUrl, songsMatched }
    matches: [],
  },
  reducers: {
    setMatches: (state, action) => {
      state.matches = action.payload
    },
    // TODO: Make async
    findMatches: (state, action) => {
      // const { username } = action.payload

      // NOTE: Just use test data for now
      state.matches = TEST_USERS
    }
  }
})

export const { setMatches, findMatches } = meetSlice.actions
export default meetSlice.reducer
