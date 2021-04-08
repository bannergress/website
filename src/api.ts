import { create } from 'apisauce'

// define the api
export const api = create({
  baseURL: process.env.API_BASE_URL,
  headers: { Accept: 'application/json' },
})
