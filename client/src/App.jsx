import { UserContextProvider } from './UserContext';
import Routes from './components/Routes';

function App() {
  return (
    <div id="App">
      <UserContextProvider>
        <Routes />
      </UserContextProvider>
    </div>
  );
}

export default App;
