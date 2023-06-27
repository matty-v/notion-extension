import { TextField } from '@mui/material';
import { useEffect, useState } from 'react';
import { Events, on } from '../../utils/broadcaster';
import { DbPropTypeProps } from './DbPropForm';

export default function DbPropRichText(props: DbPropTypeProps) {
  const { setValue, propName } = props;
  const [textValue, setTextValue] = useState('');

  useEffect(() => {
    on(Events.ResetForm).subscribe(_ => setTextValue(''));
  }, []);

  return (
    <>
      <TextField
        fullWidth
        label={propName}
        variant="outlined"
        sx={{ mt: 2 }}
        value={textValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const val = event.target.value;
          setTextValue(val);
          setValue(val);
        }}
      />
    </>
  );
}
