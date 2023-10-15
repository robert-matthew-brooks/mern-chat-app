import Nav from './Nav';
import Contacts from './Contacts';
import Chat from './Chat';
import './Main.css';

export default function Main() {
  return (
    <div id="Main">
      <Nav />
      <Contacts />
      <Chat />
    </div>
  );
}
