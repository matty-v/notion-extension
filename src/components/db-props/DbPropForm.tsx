import { Box, Button, Divider, Drawer, Stack } from '@mui/material';
import { ReactElement, useEffect, useState } from 'react';
import {
  NotionMultiSelectProp,
  NotionProperties,
  NotionPropertyType,
  NotionSelectProp,
  NotionStatusProp,
} from '../../utils/types';
import DbPropCheckbox from './DbPropCheckbox';
import DbPropDate from './DbPropDate';
import DbPropMultiSelect from './DbPropMultiSelect';
import DbPropNumber from './DbPropNumber';
import DbPropRichText from './DbPropRichText';
import DbPropSelect from './DbPropSelect';
import DbPropUrl from './DbPropUrl';

interface DbPropFormProps {
  dbProps: NotionProperties;
  setPropValue: (propName: string, propValue: string, propType: NotionPropertyType) => void;
  propValues: DbPropValue[];
}

export type DbPropValue = {
  propName: string;
  propValue: string;
  propType: NotionPropertyType;
};

export interface DbPropTypeProps {
  setValue: (value: string) => void;
  value: string | undefined;
  propName: string;
  selectOptions?: string[];
}

export default function DbPropForm(props: DbPropFormProps) {
  const [drawerState, setDrawerState] = useState(false);
  const { dbProps, setPropValue, propValues } = props;
  const [propFragments, setPropFragments] = useState<{ key: string; fragment: ReactElement }[]>([]);

  useEffect(() => {
    const fragments: { key: string; fragment: ReactElement }[] = [];

    Object.keys(dbProps).forEach(propName => {
      const dbProp = dbProps[propName];
      console.log(JSON.stringify(dbProp, null, 2));

      switch (dbProp.type) {
        case NotionPropertyType.status:
          const statusProp = dbProp as NotionStatusProp;
          fragments.push({
            key: propName,
            fragment: (
              <DbPropSelect
                propName={propName}
                setValue={value => setPropValue(propName, value, dbProp.type)}
                value={propValues.find(propval => propval.propName === propName)?.propValue}
                selectOptions={statusProp.status.options.map(option => option.name)}
              />
            ),
          });
          break;
        case NotionPropertyType.select:
          const selectProp = dbProp as NotionSelectProp;
          fragments.push({
            key: propName,
            fragment: (
              <DbPropSelect
                propName={propName}
                setValue={value => setPropValue(propName, value, dbProp.type)}
                value={propValues.find(propval => propval.propName === propName)?.propValue}
                selectOptions={selectProp.select.options.map(option => option.name)}
              />
            ),
          });
          break;
        case NotionPropertyType.multi_select:
          const multiSelectProp = dbProp as NotionMultiSelectProp;
          fragments.push({
            key: propName,
            fragment: (
              <DbPropMultiSelect
                propName={propName}
                setValue={value => setPropValue(propName, value, dbProp.type)}
                value={propValues.find(propval => propval.propName === propName)?.propValue}
                selectOptions={multiSelectProp.multi_select.options.map(option => option.name)}
              />
            ),
          });
          break;
        case NotionPropertyType.rich_text:
          fragments.push({
            key: propName,
            fragment: (
              <DbPropRichText
                propName={propName}
                setValue={value => setPropValue(propName, value, dbProp.type)}
                value={propValues.find(propval => propval.propName === propName)?.propValue}
              />
            ),
          });
          break;
        case NotionPropertyType.number:
          fragments.push({
            key: propName,
            fragment: (
              <DbPropNumber
                propName={propName}
                setValue={value => setPropValue(propName, value, dbProp.type)}
                value={propValues.find(propval => propval.propName === propName)?.propValue}
              />
            ),
          });
          break;
        case NotionPropertyType.url:
          fragments.push({
            key: propName,
            fragment: (
              <DbPropUrl
                propName={propName}
                setValue={value => setPropValue(propName, value, dbProp.type)}
                value={propValues.find(propval => propval.propName === propName)?.propValue}
              />
            ),
          });
          break;
        case NotionPropertyType.date:
          fragments.push({
            key: propName,
            fragment: (
              <DbPropDate
                propName={propName}
                setValue={value => setPropValue(propName, value, dbProp.type)}
                value={propValues.find(propval => propval.propName === propName)?.propValue}
              />
            ),
          });
          break;
        case NotionPropertyType.checkbox:
          fragments.push({
            key: propName,
            fragment: (
              <DbPropCheckbox
                propName={propName}
                setValue={value => setPropValue(propName, value, dbProp.type)}
                value={propValues.find(propval => propval.propName === propName)?.propValue}
              />
            ),
          });
          break;
        default:
          break;
      }
    });

    setPropFragments(fragments);
  }, [dbProps, setPropValue, propValues]);

  const toggleDrawer = (state: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' || (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerState(state);
  };

  const calcSetPropsNumber = (): string => {
    let dbPropCount = 0;
    Object.keys(dbProps).forEach(propName => {
      const propType = dbProps[propName].type;
      if (
        propType !== NotionPropertyType.title &&
        propType !== NotionPropertyType.created_time &&
        propType !== NotionPropertyType.last_edited_time
      ) {
        dbPropCount++;
      }
    });
    const setPropCount = propValues.length;
    return `${setPropCount} of ${dbPropCount}`;
  };

  return (
    <>
      <Stack direction="row" divider={<Divider orientation="vertical" flexItem />} spacing={2} sx={{ pt: 2, pb: 2 }}>
        <Button onClick={toggleDrawer(true)}>Set Database Properties</Button>
        <Box sx={{ pt: 1 }}>{calcSetPropsNumber()}</Box>
      </Stack>
      <Drawer
        anchor="right"
        PaperProps={{
          sx: { width: '75%' },
        }}
        open={drawerState}
        onClose={toggleDrawer(false)}
      >
        {propFragments.map(propFragment => (
          <Box sx={{ m: 1 }} key={propFragment.key}>
            {propFragment.fragment}
          </Box>
        ))}
      </Drawer>
    </>
  );
}
