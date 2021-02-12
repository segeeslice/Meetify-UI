import { useContext } from 'react'
import { AlertContext } from '../components/global/AlertProvider'

export default function useAlert () {
  const { message, addMessage, removeMessage } = useContext(AlertContext)
  return { message, addMessage, removeMessage }
}
