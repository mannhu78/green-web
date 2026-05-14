import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom"

import Home from "./pages/Home"
import About from "./pages/About"
import Compare from "./pages/Compare"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ForgotPassword from "./pages/ForgotPassword"
import History from "./pages/History"
import ResetPassword from "./pages/ResetPassword"


function App() {

  return (

    <BrowserRouter>

      <Routes>

        <Route
          path="/login"
          element={<Login />} />
        
        <Route
          path="/register"
          element={<Register />} />
        
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />


        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/about"
          element={<About />}
        />

        <Route
          path="/compare"
          element={<Compare />}
        />

        <Route
          path="/history"
          element={<History />}
        />

        <Route
          path="/reset-password/:token"
          element={<ResetPassword />}
        />

      </Routes>

    </BrowserRouter>
  )
}

export default App