import { Provider } from 'react-redux';
import { store } from './redux/store';
import AuthComponent from './components/AuthComponent';
import './App.css'

function App() {
  
  return (
    <>
      <Provider store={store}>
      <AuthComponent />
    </Provider>
    </>
  )
}

export default App
