export default function setupAxios(axios: any, store: any) {
  axios.interceptors.request.use(
    (config: any) => {
      const {
        auth: {access_token},
      } = store.getState()

      if (access_token) {
        config.headers.Authorization = `Bearer ${access_token}`
      }

      return config
    },
    (err: any) => {
      Promise.reject(err)
    }
  )
}
