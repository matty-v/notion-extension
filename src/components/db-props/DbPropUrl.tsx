import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Events, on } from '../../utils/broadcaster';
import { DbPropTypeProps } from './DbPropForm';

export default function DbPropUrl(props: DbPropTypeProps) {
  const { setValue, propName } = props;
  const [urlValue, setUrlValue] = useState('');

  useEffect(() => {
    on(Events.ResetForm).subscribe(_ => setUrlValue(''));
  }, []);

  return (
    <>
      <TextField
        fullWidth
        label={propName}
        variant="outlined"
        sx={{ mt: 2 }}
        value={urlValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const val = event.target.value;
          setUrlValue(val);
          setValue(val);
        }}
      />
    </>
  );
}
