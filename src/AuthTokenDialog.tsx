import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import { NOTION_TOKEN } from './consts';

interface AuthTokenDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AuthTokenDialog(props: AuthTokenDialogProps) {
  const [authToken, setAuthToken] = useState(localStorage.getItem(NOTION_TOKEN) ?? '');

  const handleSaveToken = () => {
    localStorage.setItem(NOTION_TOKEN, authToken);
    handleClose();
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <Dialog maxWidth={'md'} open={props.open} onClose={handleClose}>
      <DialogTitle>Auth Token</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Auth Token"
          value={authToken}
          onChange={event => setAuthToken(event.target.value)}
        />
        <Button sx={{ textAlign: 'center', m: 2 }} variant="contained" onClick={handleSaveToken}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
