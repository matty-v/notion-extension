import { TextField } from '@mui/material';
import { useState } from 'react';
import { DbPropTypeProps } from './DbPropForm';

export default function DbPropRichText(props: DbPropTypeProps) {
  const [textValue, setTextValue] = useState('');

  return (
    <>
      <TextField
        fullWidth
        label={props.propName}
        variant="outlined"
        sx={{ mt: 2 }}
        value={textValue}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const val = event.target.value;
          setTextValue(val);
          props.setValue(val);
        }}
      />
    </>
  );
}
