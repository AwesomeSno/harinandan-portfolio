import { useState, useEffect } from 'react'
import { supabase } from '../../utils/supabase'
import Login from './Login'
import Dashboard from './Dashboard'
import './admin.css' // We will add specific admin styles here

export default function AdminIndex() {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoading(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return <div className="admin-loading">ESTABLISHING SECURE LINK...</div>
  }

  if (!session) {
    return <Login />
  }

  return <Dashboard session={session} />
}
