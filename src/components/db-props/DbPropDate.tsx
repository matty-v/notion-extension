import { TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useEffect, useState } from 'react';
import { Events, on } from '../../utils/broadcaster';
import { DbPropTypeProps } from './DbPropForm';

export default function DbPropDate(props: DbPropTypeProps) {
  const { setValue, propName } = props;

  const [dateValue, setDateValue] = useState<Date | null>();

  useEffect(() => {
    on(Events.ResetForm).subscribe(_ => setDateValue(null));
  }, []);

  const handleChange = (newDate: Date | null) => {
    setDateValue(newDate);
    if (newDate) {
      const offset = newDate.getTimezoneOffset();
      const d = new Date(newDate.getTime() - offset * 60 * 1000);
      setValue(d.toISOString().split('T')[0]);
    }
  };

  return (
    <>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label={propName}
          value={dateValue}
          onChange={handleChange}
          renderInput={params => <TextField {...params} />}
        />
      </LocalizationProvider>
    </>
  );
}
