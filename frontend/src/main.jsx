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
import LogsShow from './pages/LogsModel/LogsShow.jsx'
import LogSlugShow from './pages/LogsModel/LogSlugShow.jsx'
import LogEdit from './pages/LogsModel/LogEdit.jsx'
import LogCreate from './pages/LogsModel/LogCreate.jsx'
import ExerciseCreate from './pages/ExercisesModel/ExerciseCreate.jsx'
import './index.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index path='/' element={<HomePage />} />
      <Route path='/logs' element={<LogsShow />} />
      <Route path='/logs/create-new-log' element={<LogCreate />} />
      <Route path='/logs/:slugLog' element={<LogSlugShow />} />
      <Route path='/logs/:slugLog/new-exercise' element={<ExerciseCreate />} />
      <Route path='/logs/edit/:id' element={<LogEdit />} />
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
