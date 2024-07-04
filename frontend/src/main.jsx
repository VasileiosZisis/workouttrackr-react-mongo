import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider
} from 'react-router-dom'
import { Provider } from 'react-redux'
import store from '../store.js'
import App from './App.jsx'
import HomePage from './pages/HomePage.jsx'
import LogCreate from './pages/LogsModel/LogCreate.jsx'
import LogsShow from './pages/LogsModel/LogsShow.jsx'
import LogDetails from './pages/LogsModel/LogDetails.jsx'
import LogsEdit from './pages/LogsModel/LogsEdit.jsx'
import './index.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index path='/' element={<HomePage />} />
      <Route path='/logs/:slugLog' element={<LogDetails />} />
      <Route path='/logs/:slugLog/edit' element={<LogsEdit />} />
      <Route path='/logs/new' element={<LogCreate />} />
      <Route path='/logs' element={<LogsShow />} />
    </Route>
  )
)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
)
