import { createContext, useContext, useState } from 'react'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('rider_token'))
  console.log("token",token)
  const [rider, setRider] = useState(() => {
   
    try {
      const stored = localStorage.getItem('rider_info')
      return stored ? JSON.parse(stored) : null
    } catch {
      return null
    }
  })

  const login = (newToken, riderData) => {
    localStorage.setItem('rider_token', newToken)
    localStorage.setItem('rider_info', JSON.stringify(riderData))
    setToken(newToken)
    setRider(riderData)
  }

  const logout = () => {
    localStorage.removeItem('rider_token')
    localStorage.removeItem('rider_info')
    setToken(null)
    setRider(null)
  }

  return (
    <AuthContext.Provider value={{ token, rider, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
