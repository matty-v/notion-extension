import { Button, Dialog, DialogContent, DialogTitle, TextField } from '@mui/material';
import { useState } from 'react';
import { NOTION_TOKEN, OPENAI_TOKEN } from '../utils/consts';

interface AuthTokenDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

export default function AuthTokenDialog(props: AuthTokenDialogProps) {
  const [notionAuthToken, setNotionAuthToken] = useState(localStorage.getItem(NOTION_TOKEN) ?? '');
  const [openAiAuthToken, setOpenAiAuthToken] = useState(localStorage.getItem(OPENAI_TOKEN) ?? '');

  const handleSaveTokens = () => {
    localStorage.setItem(NOTION_TOKEN, notionAuthToken);
    localStorage.setItem(OPENAI_TOKEN, openAiAuthToken);
    handleClose();
  };

  const handleClose = () => {
    props.setOpen(false);
  };

  return (
    <Dialog maxWidth={'md'} open={props.open} onClose={handleClose}>
      <DialogTitle>Auth Tokens</DialogTitle>
      <DialogContent>
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Notion Auth Token"
          value={notionAuthToken}
          onChange={event => setNotionAuthToken(event.target.value)}
        />
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="OpenAI Auth Token"
          value={openAiAuthToken}
          onChange={event => setOpenAiAuthToken(event.target.value)}
        />
        <Button sx={{ textAlign: 'center', m: 2 }} variant="contained" onClick={handleSaveTokens}>
          Save
        </Button>
      </DialogContent>
    </Dialog>
  );
}
