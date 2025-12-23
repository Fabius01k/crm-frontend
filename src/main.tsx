import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import router from '@router/router'
import { RouterProvider } from 'react-router'
import { Provider } from 'react-redux'
import { store } from '@store/store'

import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
    
  </StrictMode>
)
