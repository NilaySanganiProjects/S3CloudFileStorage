"use client"

import React, { useState } from "react"
import "./LoginPage.css" // Importing the new CSS file

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const handleLogin = () => {
    if (username.trim() && password.trim()) {
      onLogin() // Simulating login success
    } else {
      setError("❌ Invalid username or password")
    }
  }

  return (
    <div className="container">
      <div className="card">
        <div className="card-header">
          <h2>Login</h2>
          <p>Enter your credentials to continue</p>
        </div>

        <div className="card-body">
          <div className="input-group">
            <label>Username</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          {error && <p className="status error">{error}</p>}

          <button onClick={handleLogin}>Login</button>
        </div>
      </div>
    </div>
  )
}
