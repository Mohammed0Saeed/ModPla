import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Route, Routes, Navigate } from 'react-router-dom'
import SubjectPage from './components/SubjectPage'
import Home from './components/HomePageComponent'
import Login from './components/LoginComponent'
import ProtectedRoute from './components/ProtectedRoute'
import Register from './components/RegisterComponent'

function App() {
  return (
    <>
      <div className="w-100 h-100 bg-light d-flex">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/home" element={<Home />} />
            <Route path="/subject/:subjectId" element={<SubjectPage />} />
          </Route>
          <Route path="/register" element={<Register />}/>
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </>
  )
}

export default App
