import axios from 'axios'

export const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
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
