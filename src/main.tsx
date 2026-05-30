import { StrictMode, lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Portfolio from './pages/Portfolio.tsx'

const Admin = lazy(() => import('./pages/Admin.tsx'))

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Portfolio />} />
        <Route
          path="/admin"
          element={
            <Suspense fallback={<div style={{ color: '#fff', padding: 40 }}>Loading admin…</div>}>
              <Admin />
            </Suspense>
          }
        />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)


