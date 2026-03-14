import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // Check if it's the first time setup (no users exist)
    // For simplicity right now, we'll just attempt login.
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    } else {
      window.location.href = '/admin' // Refresh to catch session
    }
    
    setLoading(false)
  }

  return (
    <div className="admin-login-container">
      <div className="admin-login-box">
        <h2 className="admin-title">SYSTEM AUTHORIZATION</h2>
        <div className="admin-subtitle">Provide credentials to access core systems</div>
        
        {error && <div className="admin-error">{error}</div>}
        
        <form onSubmit={handleLogin} className="admin-form">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Operator ID (Email)"
            required
            className="admin-input"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Passcode"
            required
            className="admin-input"
          />
          <button type="submit" disabled={loading} className="admin-btn">
            {loading ? 'AUTHENTICATING...' : 'ACCESS'}
          </button>
        </form>
      </div>
    </div>
  )
}
