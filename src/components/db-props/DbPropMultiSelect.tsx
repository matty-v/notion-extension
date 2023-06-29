import { Box, Chip, FormControl, InputLabel, MenuItem, OutlinedInput, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import { Events, on } from '../../utils/broadcaster';
import { DbPropTypeProps } from './DbPropForm';

export default function DbPropMultiSelect(props: DbPropTypeProps) {
  const { setValue, propName, selectOptions } = props;
  const [selectValues, setSelectValues] = useState<string[]>([]);

  useEffect(() => {
    on(Events.ResetForm).subscribe(_ => setSelectValues([]));
  }, []);

  const handleChange = (event: SelectChangeEvent<typeof selectValues>) => {
    const value = event.target.value;
    const values = typeof value === 'string' ? value.split(',') : value;
    setSelectValues(values);
    setValue(values.join(','));
  };

  return (
    <FormControl fullWidth sx={{ mt: 2 }}>
      <InputLabel id={`${propName}-select-label`}>{propName}</InputLabel>
      <Select
        fullWidth
        labelId={`${propName}-select-label`}
        id={`${propName}-select`}
        multiple
        value={selectValues}
        label={propName}
        onChange={handleChange}
        input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
        renderValue={selected => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map(value => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
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
