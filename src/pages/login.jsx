import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/authContext'
import { loginRider } from '../services/loginServices'
import MacraLogo from '../assets/logo/Macra.png'

const BG       = "#0F1A13"
const SURFACE  = "#162A1E"
const BORDER   = "#1F3527"
const INPUT_BG = "#1A2F21"
const MUTED    = "#6B8F71"
const GREEN    = "#2CD377"

const Login = () => {
  const [phone,    setPhone]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)
  const { login }  = useAuth()
  const navigate   = useNavigate()

  const handleSubmit = async () => {
    if (!phone || !password) {
      setError('Please enter your phone number and password.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const data = await loginRider(phone, password)
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

  const focusInput  = (e) => { e.target.style.borderColor = GREEN }
  const blurInput   = (e) => { e.target.style.borderColor = BORDER }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-5"
      style={{ backgroundColor: BG }}
    >
      {/* ── Logo block ────────────────────────────── */}
      <div className="flex flex-col items-center mb-10">
        <img
          src={MacraLogo}
          alt="Macra"
          className="h-14 w-auto object-contain mb-3"
        />
        <span
          className="font-heading font-semibold text-sm tracking-[0.2em] uppercase"
          style={{ color: GREEN }}
        >
          rider
        </span>
      </div>

      {/* ── Card ──────────────────────────────────── */}
      <div
        className="w-full max-w-sm rounded-2xl p-6"
        style={{ backgroundColor: SURFACE, border: `1px solid ${BORDER}` }}
      >
        {/* Heading */}
        <h1 className="font-heading font-bold text-white text-[22px] leading-tight mb-1">
          Welcome back
        </h1>
        <p className="font-body text-sm mb-7" style={{ color: MUTED }}>
          Sign in to start your deliveries
        </p>

        {/* Phone */}
        <div className="mb-4">
          <label
            className="block font-body text-[11px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: MUTED }}
          >
            Phone Number
          </label>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onFocus={focusInput}
            onBlur={blurInput}
            className="w-full rounded-xl px-4 py-3.5 text-[14px] font-body text-white outline-none transition-colors placeholder:text-[#3A5A44]"
            style={{ backgroundColor: INPUT_BG, border: `1.5px solid ${BORDER}` }}
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label
            className="block font-body text-[11px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: MUTED }}
          >
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handlePasswordKeyDown}
            onFocus={focusInput}
            onBlur={blurInput}
            className="w-full rounded-xl px-4 py-3.5 text-[14px] font-body text-white outline-none transition-colors placeholder:text-[#3A5A44]"
            style={{ backgroundColor: INPUT_BG, border: `1.5px solid ${BORDER}` }}
          />
        </div>

        {/* Error */}
        {error && (
          <div
            className="rounded-xl px-4 py-3 mb-5 font-body text-sm leading-5"
            style={{ backgroundColor: 'rgba(239,68,68,0.1)', color: '#EF4444' }}
          >
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full py-4 rounded-xl font-heading font-bold text-[15px] text-[#0F2B1D] disabled:opacity-60 active:opacity-80 transition-opacity"
          style={{ backgroundColor: GREEN }}
        >
          {loading ? 'Signing in…' : 'Sign In'}
        </button>
      </div>

      {/* ── Footer ────────────────────────────────── */}
      <p
        className="font-body text-xs text-center mt-8 leading-relaxed max-w-[220px]"
        style={{ color: MUTED }}
      >
        Contact your manager if you need help logging in.
      </p>
    </div>
  )
}

export default Login
