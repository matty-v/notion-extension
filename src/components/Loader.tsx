import { Backdrop, CircularProgress } from '@mui/material';
import { useEffect, useState } from 'react';
import { Events, on } from '../utils/broadcaster';

interface LoaderProps {}

export default function Loader(props: LoaderProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    on<boolean>(Events.Loading).subscribe(isLoading => {
      setOpen(isLoading);
    });
  }, []);

  return (
    <Backdrop sx={{ color: '#fff', zIndex: 999 }} open={open}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
}
