/*
 * Small wrapper for material-ui Badge component
 * Meant to be used on items that need attention
 *
 * Takes all the same props as a normal Badge
 */

import React from 'react'
import {
  Badge,
  Typography,
} from '@material-ui/core'

export default function ErrorBadge (props) {
  return (
    <Badge
      color="error"
      badgeContent={<Typography variant="body1"><strong>!</strong></Typography>}
      {...props}
    />
  )
}
