import { Box, Divider, Stack } from '@mui/material';
import { ReactFragment, useEffect, useState } from 'react';
import DbPropRichText from './DbPropRichText';
import DbPropSelect from './DbPropSelect';
import { NotionProperties, NotionPropertyType, NotionSelectProp } from './types';

interface DbPropFormProps {
  dbProps: NotionProperties;
  propValues: DbPropValue[];
  setPropValue: (propName: string, propValue: string, propType: NotionPropertyType) => void;
}

export type DbPropValue = {
  propName: string;
  propValue: string;
  propType: NotionPropertyType;
};

export interface DbPropTypeProps {
  setValue: (value: string) => void;
  propName: string;
  selectOptions?: string[];
}

export default function DbPropForm(props: DbPropFormProps) {
  const [propFragments, setPropFragments] = useState<ReactFragment[]>([]);

  useEffect(() => {
    const fragments: any[] = [];

    Object.keys(props.dbProps).forEach(propName => {
      const dbProp = props.dbProps[propName];

      switch (dbProp.type) {
        case NotionPropertyType.select:
          const selectProp = dbProp as NotionSelectProp;
          fragments.push(
            <DbPropSelect
              propName={propName}
              setValue={value => props.setPropValue(propName, value, dbProp.type)}
              selectOptions={selectProp.select.options.map(option => option.name)}
            />,
          );
          break;
        case NotionPropertyType.rich_text:
          fragments.push(
            <DbPropRichText propName={propName} setValue={value => props.setPropValue(propName, value, dbProp.type)} />,
          );
          break;

        default:
          break;
      }
    });

    setPropFragments(fragments);
  }, [props, props.dbProps, props.setPropValue]);

  return (
    <Stack
      direction="row"
      divider={<Divider orientation="vertical" flexItem />}
      spacing={2}
      sx={{ overflowX: 'scroll', pt: 2, pb: 3 }}
    >
      {propFragments.map((fragment, index) => (
        <Box key={index} component="div" sx={{ flexBasis: '90%', flexShrink: 0 }}>
          {fragment}
        </Box>
      ))}
    </Stack>
  );
}
