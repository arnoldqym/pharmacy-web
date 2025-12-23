import { Provider } from 'react-redux';
import { store } from './redux/store';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import AuthComponent from './components/AuthComponent';
import AuthPage from './pages/AuthPage';
import LandingPage from './pages/LandingPage'
import './App.css'
function App() {
  
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/auth' element={<AuthComponent><AuthPage /></AuthComponent>} />
            <Route path='*' element={<Navigate to='/' />} />
          </Routes>
        </BrowserRouter>
    </Provider>
    </>
  )
}

export default App
