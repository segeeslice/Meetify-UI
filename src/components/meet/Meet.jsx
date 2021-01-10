/*
 * UI component for the "Meet" section of the app, allowing people to find
 * others with like music interests
 */

import React from 'react'

import MeetCard from './MeetCard'

const TEST_USERS = [{
  displayName: 'Dougy doug',
  profilePicUrl: 'https://wi-images.condecdn.net/image/jgov7eBrRvb/crop/2040/f/6-facial-recognition-hero.jpg',
  songsMatched: 27,
},{
  displayName: 'Dougina Dougette',
  profilePicUrl: 'https://www.4dface.io/wp-content/uploads/2018/10/4DFM_sample2.jpg',
  songsMatched: 57,
}, {
  displayName: 'Dougronamopolis Jr. doug',
  profilePicUrl: 'https://www.cbc.ca/natureofthings/content/legacy/Universal_Expression_Surprise.jpg',
  songsMatched: 5,
}]

export default function Meet () {
  // TODO: Link operations in store
  // TODO: Populate matches on button click?
  const matches = TEST_USERS

  // TODO: Start with primary background gradient and slowly reduce opacity down list
  const meetCards = [...matches]
    .sort((a, b) => b.songsMatched-a.songsMatched)
    .map((o, i) => {
      return (
        <div style={{margin: '8px'}} key={i}>
          <MeetCard {...o}/>
        </div>
      )
  })

  return meetCards
}
