import MenuIcon from '@mui/icons-material/Menu';
import { Menu, MenuItem } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import AuthTokenDialog from '../components/AuthTokenDialog';

export default function TopBar() {
  const [authDialogOpen, setAuthDialogOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar variant="dense">
            <img
              alt="Notion Helper"
              src="https://upload.wikimedia.org/wikipedia/commons/4/45/Notion_app_logo.png"
              style={{ height: '20px', width: 'auto' }}
            />
            <Typography variant="h6" color="inherit" component="div" sx={{ ml: 2 }}>
              Notion Helper
            </Typography>
            <div style={{ flexGrow: 1 }}></div>
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuClick}>
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      </Box>
      <Menu
        id="top-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem
          onClick={() => {
            setAuthDialogOpen(true);
            handleMenuClose();
          }}
        >
          Auth Tokens
        </MenuItem>
      </Menu>
      <AuthTokenDialog open={authDialogOpen} setOpen={setAuthDialogOpen} />
    </>
  );
}
