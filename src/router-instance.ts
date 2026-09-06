import { createBrowserRouter } from 'react-router-dom'

export type AppRouter = ReturnType<typeof createBrowserRouter>

let instance: AppRouter | undefined

export const setRouter = (router: AppRouter) => {
  instance = router
}

export const getRouter = () => instance
