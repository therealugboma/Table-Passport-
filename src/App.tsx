import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Landing from './pages/Landing'
import Passport from './pages/Passport'
import Booking from './pages/Booking'
import Verify from './pages/Verify'
import Install from './pages/Install'
import { StickerSheet, PlateMock, StickerResolve } from './pages/Print'
import AppLayout from './pages/app/Layout'
import { Overview, Tables } from './pages/app/Core'
import { Reminders, Bookings, Techs } from './pages/app/Service'
import { Stickers, Transfers, Alerts, Settings } from './pages/app/More'
import Tour from './components/Tour'

export default function App() {
  const loc = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  return <>
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/p/:serial" element={<Passport />} />
      <Route path="/r/:serial" element={<Passport resale />} />
      <Route path="/b/:token" element={<Booking />} />
      <Route path="/verify" element={<Verify />} />
      <Route path="/verify/:serial" element={<Verify />} />
      <Route path="/install" element={<Install />} />
      <Route path="/s/:id" element={<StickerResolve />} />
      <Route path="/print/stickers" element={<StickerSheet />} />
      <Route path="/print/plate/:serial" element={<PlateMock />} />
      <Route path="/app" element={<AppLayout />}>
        <Route index element={<Overview />} />
        <Route path="tables" element={<Tables />} />
        <Route path="tables/:serial" element={<Tables />} />
        <Route path="reminders" element={<Reminders />} />
        <Route path="bookings" element={<Bookings />} />
        <Route path="technicians" element={<Techs />} />
        <Route path="stickers" element={<Stickers />} />
        <Route path="transfers" element={<Transfers />} />
        <Route path="alerts" element={<Alerts />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    {!loc.pathname.startsWith('/print') && <Tour />}
  </>
}
