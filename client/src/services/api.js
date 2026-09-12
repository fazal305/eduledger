import axios from 'axios'
import { useNetworkStore } from '../store/networkStore'

const SLOW_REQUEST_MS = 5000

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

api.interceptors.request.use((config) => {
  const metadata = { fired: false }
  metadata.timer = setTimeout(() => {
    metadata.fired = true
    useNetworkStore.getState().incrementSlow()
  }, SLOW_REQUEST_MS)
  config.metadata = metadata
  return config
})

function settleSlowRequest(config) {
  if (!config?.metadata) return
  clearTimeout(config.metadata.timer)
  if (config.metadata.fired) {
    useNetworkStore.getState().decrementSlow()
  }
}

api.interceptors.response.use(
  (response) => {
    settleSlowRequest(response.config)
    return response
  },
  (error) => {
    settleSlowRequest(error.config)
    if (error.response?.status === 401) {
      useAuthStoreLogoutOn401()
    }
    return Promise.reject(error)
  },
)

let logoutHandler = () => {}
export function registerUnauthorizedHandler(handler) {
  logoutHandler = handler
}
function useAuthStoreLogoutOn401() {
  logoutHandler()
}
