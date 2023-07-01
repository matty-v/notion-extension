import { Button, Container } from '@mui/material';
import { useState } from 'react';
import AddPageForm from '../components/AddPageForm';
import ItemSelector from '../components/ItemSelector';
import DbPropForm, { DbPropValue } from '../components/db-props/DbPropForm';
import { Events, broadcast } from '../utils/broadcaster';
import { SELECTED_DB } from '../utils/consts';
import {
  createPageInDatabase,
  formatPropValues,
  getName,
  getTitlePropFromDb,
  parseFromLocalStorage,
} from '../utils/notion-utils';
import {
  ItemType,
  NewPage,
  NotificationPayload,
  NotionDatabaseObject,
  NotionPageOrDatabaseObject,
  NotionPropertyType,
} from '../utils/types';

interface AddToDbProps {}

export default function AddToDb(props: AddToDbProps) {
  const [selectedDb, setSelectedDb] = useState<NotionDatabaseObject>(parseFromLocalStorage(SELECTED_DB));
  const [newPage, setNewPage] = useState<NewPage>({ title: '', content: '' });
  const [dbPropValues, setDbPropValues] = useState<DbPropValue[]>([]);

  const handleSelectDb = (selectedItem: NotionPageOrDatabaseObject) => {
    const selectedDatabase = selectedItem as NotionDatabaseObject;
    setSelectedDb(selectedDatabase);
    localStorage.setItem(SELECTED_DB, JSON.stringify(selectedDatabase));
    setDbPropValues([]);
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
    broadcast<boolean>(Events.ResetForm, true);

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
      if (!propValue || (propType === NotionPropertyType.checkbox && propValue === 'false')) {
        newPropValues.splice(
          newPropValues.findIndex(prop => prop.propName === propName),
          1,
        );
      } else {
        prop.propValue = propValue;
      }
    }
    setDbPropValues(newPropValues);
    console.log(JSON.stringify(newPropValues));
  };

  return (
    <Container>
      <ItemSelector selectorType="database" item={selectedDb} setItem={handleSelectDb} itemType={ItemType.database} />
      <AddPageForm setNewPage={setNewPage} newPage={newPage} />
      {selectedDb ? (
        <DbPropForm dbProps={selectedDb?.properties} setPropValue={setPropValue} propValues={dbPropValues} />
      ) : (
        <></>
      )}
      <Button variant="contained" onClick={handleCreatePage} sx={{ mt: 1 }}>
        Create Database Page
      </Button>
    </Container>
  );
}
