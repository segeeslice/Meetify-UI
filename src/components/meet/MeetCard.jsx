/*
 * UI component for a single "card" displaying passed contact information
 *
 * Props (all Strings):
 *   - displayName (String)
 *   - profilePicUrl (String)
 *   - songsMatched (int)
 */

import React from 'react';

import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@material-ui/core'
import UserAvatar from '../UserAvatar'

import './MeetCard.css'
import { theme } from '../../theme'

export default function MeetCard (props) {
  const avatarSize = theme.images.cardImageHeight

  return (
    // TODO: Possibly make common component between this and SongTile for alignment?
    <Card className="meet-card-container" raised>
      <CardMedia style={{padding: '8px'}}>
        <UserAvatar
          src={props.profilePicUrl}
          displayName={props.displayName}
          style={{height: avatarSize, width: avatarSize}}
        />
      </CardMedia>

      <div style={{display: 'flex', alignItems: 'center'}}>
        <CardContent>
          <Typography variant="h6">
            {props.displayName || '(no display name)'}
          </Typography>
          <Typography variant="subtitle2">
            Matching songs: {props.songsMatched || 0}
          </Typography>
        </CardContent>
      </div>
    </Card>
  )
}
