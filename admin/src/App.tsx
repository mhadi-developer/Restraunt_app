import { BrowserRouter , Routes , Route } from "react-router"
import HomePage from "./pages/HomePage"
import "./App.css"
import LoginPage from "./pages/LoginPage"
import GlobalBrandingBar from "./components/TopBar"
import GlobalFooter from "./components/Footer"
import { Toaster } from "react-hot-toast"
import NotFound from "./pages/NotFound"

export default function App() {
  return(
    <div>
      <GlobalBrandingBar
        restaurantName="Maison"
        serviceDate="Oct 24"
        serviceName="Dinner Service"
        userName="Hadi"
      />
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/admin/login' element={<LoginPage />} />
          
          

          <Route path="/*" element={<NotFound/>}/>
        </Routes>
        <GlobalFooter />
        <Toaster
  position="top-center"

  toastOptions={{
    duration: 3000,

    style: {
      background: "#008000",
      color: "#fff",
      fontSize: "18px",
    },

    success: {
      duration: 3000,
      iconTheme: {
        primary: "#008000",
        secondary: "#fff",
      },
    },

    error: {
      duration: 4000,
      iconTheme: {
        primary: "#ef4444",
        secondary: "#fff",
      },
    },
  }}
/>
      </BrowserRouter>
    </div>
  )
}