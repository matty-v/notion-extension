import CloseIcon from '@mui/icons-material/Close';
import { Button, IconButton } from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import React, { useEffect, useState } from 'react';
import { Events, on } from '../utils/broadcaster';
import { NotificationPayload } from '../utils/types';

export default function Notification() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [linkName, setLinkName] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    on<NotificationPayload>(Events.Notify).subscribe(payload => {
      setMessage(payload.Message);
      payload.LinkName && setLinkName(payload.LinkName);
      payload.LinkUrl && setLinkUrl(payload.LinkUrl);
      setOpen(true);
    });
  }, []);

  const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const action = (
    <>
      <Button color="primary" size="small" href={linkUrl} target="_blank">
        {linkName}
      </Button>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
        <CloseIcon fontSize="small" />
      </IconButton>
    </>
  );

  return (
    <div>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        open={open}
        message={message}
        autoHideDuration={6000}
        onClose={handleClose}
        action={action}
      />
    </div>
  );
}
