/*
 * Small hook for providing easier access to the global alert context
 * Can then be used to display alerts from any component
 *
 * See components/global/AlertNofication.jsx for UI component & usage
 */

import { useContext } from 'react'
import { AlertContext } from '../components/global/AlertProvider'

export default function useAlert () {
  const { alert, addAlert, removeAlert } = useContext(AlertContext)
  return { alert, addAlert, removeAlert }
}
