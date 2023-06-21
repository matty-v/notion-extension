import { Button, Container } from '@mui/material';
import { useState } from 'react';
import AddPageForm from './AddPageForm';
import DbPropForm, { DbPropValue } from './DbPropForm';
import ItemSelector from './ItemSelector';
import { SELECTED_DB } from './consts';
import {
  ItemType,
  NewPage,
  NotificationPayload,
  NotionDatabaseObject,
  NotionPageOrDatabaseObject,
  NotionPropertyType,
} from './types';
import { Events, broadcast } from './utils/broadcaster';
import {
  createPageInDatabase,
  formatPropValues,
  getName,
  getTitlePropFromDb,
  parseFromLocalStorage,
} from './utils/notion-utils';

interface AddToDbProps {}

export default function AddToDb(props: AddToDbProps) {
  const [selectedDb, setSelectedDb] = useState<NotionDatabaseObject>(parseFromLocalStorage(SELECTED_DB));
  const [newPage, setNewPage] = useState<NewPage>({ title: '', content: '' });
  const [dbPropValues, setDbPropValues] = useState<DbPropValue[]>([]);

  const handleSelectDb = (selectedItem: NotionPageOrDatabaseObject) => {
    const selectedDatabase = selectedItem as NotionDatabaseObject;
    setSelectedDb(selectedDatabase);
    localStorage.setItem(SELECTED_DB, JSON.stringify(selectedDatabase));
  };

  const handleCreatePage = async (): Promise<void> => {
    if (!selectedDb || !newPage) return;

    broadcast<boolean>(Events.Loading, true);

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

    const createdPage = await createPageInDatabase(selectedDb.id, properties, newPage.content);

    broadcast<NotificationPayload>(Events.Notify, {
      Message: `Created [${newPage.title}]`,
      LinkName: 'Link',
      LinkUrl: createdPage.url,
    });
    setNewPage({ title: '', content: '' });
    setDbPropValues([]);

    broadcast<boolean>(Events.Loading, false);
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
      <ItemSelector selectorType="database" item={selectedDb} setItem={handleSelectDb} itemType={ItemType.database} />
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
