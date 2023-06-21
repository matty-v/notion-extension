import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './App.css';
import Loader from './Loader';
import MainTabs from './MainTabs';
import Notification from './Notification';
import TopBar from './TopBar';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <div className="App">
        <TopBar />
        <MainTabs />
        <Notification />
        <Loader />
      </div>
    </ThemeProvider>
  );
}

export default App;
