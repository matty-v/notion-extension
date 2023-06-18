import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { DbPropTypeProps } from './DbPropForm';

export default function DbPropSelect(props: DbPropTypeProps) {
  const [age, setAge] = useState('');

  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
    props.setValue(event.target.value);
  };

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel id={`${props.propName}-select-label`}>{props.propName}</InputLabel>
      <Select
        fullWidth
        labelId={`${props.propName}-select-label`}
        id={`${props.propName}-select`}
        value={age}
        label={props.propName}
        onChange={handleChange}
      >
        {props.selectOptions && props.selectOptions.map(option => <MenuItem value={option}>{option}</MenuItem>)}
      </Select>
    </FormControl>
  );
}
