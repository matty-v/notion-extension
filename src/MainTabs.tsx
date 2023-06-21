import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import { useState } from 'react';
import AddToDb from './AddToDb';
import AddToPage from './AddToPage';
import CreatePage from './CreatePage';
import { CURRENT_TAB } from './consts';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`main-tabpanel-${index}`}
      aria-labelledby={`main-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `main-tab-${index}`,
    'aria-controls': `main-tabpanel-${index}`,
  };
}

export default function MainTabs() {
  const [value, setValue] = useState(Number.parseInt(localStorage.getItem(CURRENT_TAB) ?? '0'));

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
    localStorage.setItem(CURRENT_TAB, newValue.toString());
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="main tabs">
          <Tab label="Add to DB" {...a11yProps(0)} />
          <Tab label="Add to Page" {...a11yProps(1)} />
          <Tab label="Create Page" {...a11yProps(2)} />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        <AddToDb />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AddToPage />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CreatePage />
      </TabPanel>
    </Box>
  );
}
