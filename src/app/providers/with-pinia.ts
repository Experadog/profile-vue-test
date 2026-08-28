import { createPinia } from 'pinia'

// Single Pinia instance for the whole app. Individual stores are owned
// by their respective entity/feature slices, not defined here.
export const pinia = createPinia()
