import { Button, Container } from '@mui/material';
import { useState } from 'react';
import AddPageForm from './AddPageForm';
import DbPropForm, { DbPropValue } from './DbPropForm';
import ItemSelector from './ItemSelector';
import { DbPage, ItemType, NotionPropertyType } from './types';
import { createPageInDatabase, formatPropValues, getName, getTitlePropFromDb } from './utils/notion-utils';

interface AddToDbProps {}

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
