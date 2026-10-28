import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom'
import App from './App'
import './styles/tokens.css'
import './styles/app.css'
import './styles/passport.css'
createRoot(document.getElementById('root')!).render(<HashRouter><App /></HashRouter>)
