import { Checkbox, FormControlLabel } from '@mui/material';
import { useEffect, useState } from 'react';
import { Events, on } from '../../utils/broadcaster';
import { DbPropTypeProps } from './DbPropForm';

export default function DbPropCheckbox(props: DbPropTypeProps) {
  const { setValue, propName } = props;
  const [checkboxValue, setCheckboxValue] = useState(false);

  useEffect(() => {
    on(Events.ResetForm).subscribe(_ => setCheckboxValue(false));
  }, []);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            checked={checkboxValue}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              const val = event.target.checked;
              setCheckboxValue(val);
              setValue(val.toString());
            }}
          />
        }
        label={propName}
      />
    </>
  );
}
