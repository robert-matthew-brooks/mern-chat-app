import { UserContextProvider } from './UserContext';
import Routes from './components/Routes';
import fillScreen from './js/fill-screen';

fillScreen();
window.addEventListener('resize', fillScreen);

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
