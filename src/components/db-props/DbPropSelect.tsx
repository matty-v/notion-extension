import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import { Events, on } from '../../utils/broadcaster';
import { DbPropTypeProps } from './DbPropForm';

export default function DbPropSelect(props: DbPropTypeProps) {
  const { setValue, propName, selectOptions } = props;
  const [selectValue, setSelectValue] = useState('');

  useEffect(() => {
    on(Events.ResetForm).subscribe(_ => setSelectValue(''));
  }, []);

  const handleChange = (event: SelectChangeEvent) => {
    setSelectValue(event.target.value);
    setValue(event.target.value);
  };

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel id={`${propName}-select-label`}>{propName}</InputLabel>
      <Select
        fullWidth
        labelId={`${propName}-select-label`}
        id={`${propName}-select`}
        value={selectValue}
        label={propName}
        onChange={handleChange}
      >
        {selectOptions?.map(option => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
