import { UserContextProvider } from './UserContext';
import Routes from './components/Routes';
import './App.css';

function App() {
  return (
    <div id="App">
      <div id="App__inner-wrapper">
        <UserContextProvider>
          <Routes />
        </UserContextProvider>
      </div>
    </div>
  );
}

export default App;
