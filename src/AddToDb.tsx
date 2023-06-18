import { Button, Container } from '@mui/material';
import { useState } from 'react';
import AddPageForm from './AddPageForm';
import DbPropForm, { DbPropValue } from './DbPropForm';
import ItemSelector from './ItemSelector';
import { DbPage, ItemType, NotionPropertyType } from './types';
import { createPageInDatabase, formatPropValues, getName, getTitlePropFromDb } from './utils/notion-utils';

interface AddToDbProps {}

const testSelectedDb = {
  object: 'database',
  id: '3cc214ef-3342-4e99-9ab0-c8b394bb9299',
  cover: null,
  icon: null,
  created_time: '2023-06-16T20:56:00.000Z',
  created_by: {
    object: 'user',
    id: 'eed04b94-181c-4f78-b1fe-8dffe391114b',
  },
  last_edited_by: {
    object: 'user',
    id: 'eed04b94-181c-4f78-b1fe-8dffe391114b',
  },
  last_edited_time: '2023-06-16T21:03:00.000Z',
  title: [
    {
      type: 'text',
      text: {
        content: 'Golf Courses',
        link: null,
      },
      annotations: {
        bold: false,
        italic: false,
        strikethrough: false,
        underline: false,
        code: false,
        color: 'default',
      },
      plain_text: 'Golf Courses',
      href: null,
    },
  ],
  description: [],
  is_inline: true,
  properties: {
    Directions: {
      id: 'B%60%3BO',
      name: 'Directions',
      type: 'url',
      url: {},
    },
    Rating: {
      id: 'Nogs',
      name: 'Rating',
      type: 'select',
      select: {
        options: [
          {
            id: '6061155d-89de-46e6-927c-9551789dbd49',
            name: '⭐',
            color: 'red',
          },
          {
            id: '929d4cde-b5da-4287-8d19-c1745d7f4b99',
            name: '⭐⭐',
            color: 'orange',
          },
          {
            id: 'e7bb1224-430d-402e-84df-f5c09dbe8617',
            name: '⭐⭐⭐',
            color: 'yellow',
          },
          {
            id: '9dd2d9b5-819c-4e47-a684-58a63d6ae008',
            name: '⭐⭐⭐⭐',
            color: 'green',
          },
          {
            id: 'a4271419-e0e9-4a13-bf11-abb0dd958766',
            name: '⭐⭐⭐⭐⭐',
            color: 'blue',
          },
        ],
      },
    },
    'Price Range': {
      id: 'g%5B%3F%3C',
      name: 'Price Range',
      type: 'rich_text',
      rich_text: {},
    },
    Location: {
      id: 'mrAa',
      name: 'Location',
      type: 'rich_text',
      rich_text: {},
    },
    Name: {
      id: 'title',
      name: 'Name',
      type: 'title',
      title: {},
    },
  },
  parent: {
    type: 'page_id',
    page_id: 'a6a21e52-29a3-4f64-a83c-3a493d4522a2',
  },
  url: 'https://www.notion.so/3cc214ef33424e999ab0c8b394bb9299',
  public_url: null,
  archived: false,
};

export default function AddToDb(props: AddToDbProps) {
  const [selectedDb, setSelectedDb] = useState<any>();
  const [newPage, setNewPage] = useState<DbPage>({ title: '', content: '' });
  const [dbPropValues, setDbPropValues] = useState<DbPropValue[]>([]);

  const handleCreatePage = async (): Promise<void> => {
    if (!selectedDb || !newPage) return;
    console.log(`Adding page to database [${getName(selectedDb)}]`);
    console.log(`Page title [${newPage.title}]`);
    console.log(`Page content [${newPage.content}]`);
    const titleProp = getTitlePropFromDb(selectedDb);
    const titlePropName = titleProp ? titleProp.name ?? 'Name' : 'Name';

    dbPropValues.push({
      propType: NotionPropertyType.title,
      propName: titlePropName,
      propValue: newPage.title,
    });
    const properties = formatPropValues(dbPropValues);

    console.log(`DB Prop values: [${JSON.stringify(properties)}]`);

    await createPageInDatabase(selectedDb.id, properties, newPage.content);
  };

  const setPropValue = (propName: string, propValue: string, propType: NotionPropertyType) => {
    const newPropValues = dbPropValues.slice();
    const prop = newPropValues.find(prop => prop.propName === propName);
    if (!prop) {
      newPropValues.push({
        propName,
        propValue,
        propType: propType,
      });
    } else {
      prop.propValue = propValue;
    }
    setDbPropValues(newPropValues);
    console.log(JSON.stringify(newPropValues));
  };

  return (
    <Container>
      <ItemSelector setItem={setSelectedDb} itemType={ItemType.database} />
      <AddPageForm setNewPage={setNewPage} newPage={newPage} />
      {selectedDb ? (
        <DbPropForm dbProps={selectedDb?.properties} propValues={dbPropValues} setPropValue={setPropValue} />
      ) : (
        <></>
      )}
      <Button variant="contained" onClick={handleCreatePage} sx={{ mt: 1 }}>
        Create Database Page
      </Button>
    </Container>
  );
}
