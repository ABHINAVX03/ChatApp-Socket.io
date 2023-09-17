import './App.css';
import Homepage from './pages/HomePage';
import { Route,Routes } from 'react-router-dom';
import ChatPage from './pages/ChatPage';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' Component={Homepage}/>
        <Route path='/chats' Component={ChatPage}/>
      </Routes>
    </div>
  );
}

export default App;
