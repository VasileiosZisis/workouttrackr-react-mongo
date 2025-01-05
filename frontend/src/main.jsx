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
import ExerciseSlugShow from './pages/ExercisesModel/ExerciseSlugShow.jsx'
import ExerciseEdit from './pages/ExercisesModel/ExerciseEdit.jsx'
import WlsessionCreate from './pages/WlsessionsModel/WlsessionCreate.jsx'
import WlsessionShow from './pages/WlsessionsModel/WlsessionShow.jsx'
import WlsessionEdit from './pages/WlsessionsModel/WlsessionEdit.jsx'
import PasessionCreate from './pages/PasessionsModel/PasessionsCreate.jsx'
import PasessionShow from './pages/PasessionsModel/PassesionShow.jsx'
import PasessionEdit from './pages/PasessionsModel/PasessionEdit.jsx'
import Login from './pages/UsersModel/Login.jsx'
import Register from './pages/UsersModel/Register.jsx'
import UpdateProfile from './pages/UsersModel/UpdateProfile.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'
import './index.css'

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />}>
      <Route index path='/' element={<HomePage />} />
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />

      <Route path='' element={<PrivateRoute />}>
        <Route path='/profile' element={<UpdateProfile />} />
        <Route path='/logs' element={<LogsShow />} />
        <Route path='/logs/create-new-log' element={<LogCreate />} />
        <Route path='/logs/:slugLog' element={<LogSlugShow />} />
        <Route path='/logs/edit/:id' element={<LogEdit />} />
        <Route
          path='/logs/:slugLog/create-new-exercise'
          element={<ExerciseCreate />}
        />
        <Route
          path='/logs/:slugLog/:slugExercise'
          element={<ExerciseSlugShow />}
        />
        <Route
          path='/logs/:slugLog/edit/:exerciseId'
          element={<ExerciseEdit />}
        />
        <Route
          path='/logs/:slugLog/:slugExercise/wl/create-new-session'
          element={<WlsessionCreate />}
        />
        <Route
          path='/logs/:slugLog/:slugExercise/wl/:slugSession'
          element={<WlsessionShow />}
        />
        <Route
          path='/logs/:slugLog/:slugExercise/wl/edit/:wlsessionId'
          element={<WlsessionEdit />}
        />
        <Route
          path='/logs/:slugLog/:slugExercise/pa/create-new-session'
          element={<PasessionCreate />}
        />
        <Route
          path='/logs/:slugLog/:slugExercise/pa/:slugSession'
          element={<PasessionShow />}
        />
        <Route
          path='/logs/:slugLog/:slugExercise/pa/edit/:pasessionId'
          element={<PasessionEdit />}
        />
      </Route>
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
