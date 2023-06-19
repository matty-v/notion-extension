import './App.css';
import MainTabs from './MainTabs';
import Notification from './Notification';
import TopBar from './TopBar';

function App() {
  return (
    <div className="App">
      <TopBar />
      <MainTabs />
      <Notification />
    </div>
  );
}

export default App;
