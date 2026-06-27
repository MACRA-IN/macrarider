import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { loginRider } from '../services/loginServices'

const Login = () => {
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    if (!phone || !password) {
      setError('Please enter your phone number and password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await loginRider(phone, password)
      console.log('Login data:', data)
      login(data.token, data.rider)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordKeyDown = (e) => {
    if (e.key === 'Enter') handleSubmit()
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-bg px-4">
      <div className="bg-white shadow-card rounded-[18px] p-[24px] w-full max-w-[360px]">

        {/* Logo */}
        <div className="flex items-center justify-center mb-2">
          <span className="font-heading font-bold text-[22px] text-forest tracking-tight">
            macra
          </span>
          <span className="font-heading font-bold text-[22px] text-emerald mx-[1px]">
            .
          </span>
          <span className="font-heading font-bold text-[22px] text-forest tracking-tight">
            rider
          </span>
        </div>

        {/* Tagline */}
        <p className="text-center font-body text-[13px] text-text-muted mb-6">
          Sign in to start your deliveries
        </p>

        {/* Phone */}
        <input
          type="tel"
          placeholder="Phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-sage rounded-[10px] px-4 py-3 text-[14px] font-body text-forest outline-none focus:border-emerald transition-colors mb-3"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handlePasswordKeyDown}
          className="w-full border border-sage rounded-[10px] px-4 py-3 text-[14px] font-body text-forest outline-none focus:border-emerald transition-colors mb-3"
        />

        {/* Error */}
        {error && (
          <p className="text-crimson text-[12px] font-body mb-3">{error}</p>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-emerald hover:bg-emerald-dark text-white font-heading font-semibold text-[15px] py-3 rounded-[12px] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </div>

      {/* Footer */}
      <p className="text-text-muted text-[12px] font-body text-center mt-5">
        Contact your manager if you need help logging in.
      </p>
    </div>
  )
}

export default Login
