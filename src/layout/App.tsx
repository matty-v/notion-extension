import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import Loader from '../components/Loader';
import Notification from '../components/Notification';
import MainTabs from './MainTabs';
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
