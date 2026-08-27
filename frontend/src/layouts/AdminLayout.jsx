import { useEffect } from "react"
import { useLocation } from "react-router-dom"

import AdminSidebar from "../components/AdminSidebar"

import {
  getSavedTheme,
  applyTheme
} from "../utils/theme"


function AdminLayout({ children }) {

  const location = useLocation()


  // =====================================================
  // RÉAPPLIQUER LE THÈME À CHAQUE CHANGEMENT DE PAGE
  // =====================================================

  useEffect(() => {

    const theme = getSavedTheme()

    console.log(
      "🎨 Thème appliqué sur la page :",
      location.pathname,
      "=>",
      theme
    )

    applyTheme(theme)

  }, [location.pathname])


  return (

    <div
      className="
        flex
        h-screen
        overflow-hidden
        bg-[#f8fafc]
        text-gray-900
      "
    >

      <AdminSidebar />


      <main
        className="
          flex-1
          overflow-y-auto
          p-10
          bg-[#f8fafc]
        "
      >

        {children}

      </main>

    </div>

  )

}


export default AdminLayout