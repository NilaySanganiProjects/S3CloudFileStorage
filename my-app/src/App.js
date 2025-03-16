"use client"

import React, { useState } from "react"
import LoginPage from "./LoginPage"
import S3FileManager from "./S3FileManager"

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  return isAuthenticated ? <S3FileManager /> : <LoginPage onLogin={() => setIsAuthenticated(true)} />
}
