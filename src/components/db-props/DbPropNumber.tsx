import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Events, on } from '../../utils/broadcaster';
import { DbPropTypeProps } from './DbPropForm';

export default function DbPropNumber(props: DbPropTypeProps) {
  const { setValue, propName } = props;
  const [numberValue, setNumberValue] = useState('');

  useEffect(() => {
    on(Events.ResetForm).subscribe(_ => setNumberValue(''));
  }, []);

  return (
    <>
      <TextField
        fullWidth
        label={propName}
        variant="outlined"
        sx={{ mt: 2 }}
        value={numberValue}
        type="number"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const val = event.target.value;
          setNumberValue(val);
          setValue(val);
        }}
      />
    </>
  );
}
