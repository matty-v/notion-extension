import { Button, Container } from '@mui/material';
import { useState } from 'react';
import AddPageForm from '../components/AddPageForm';
import ItemSelector from '../components/ItemSelector';
import { Events, broadcast } from '../utils/broadcaster';
import { SELECTED_PARENT_PAGE } from '../utils/consts';
import { createPageInParentPage, getName, parseFromLocalStorage } from '../utils/notion-utils';
import { ItemType, NewPage, NotificationPayload, NotionPageObject, NotionPageOrDatabaseObject } from '../utils/types';

interface CreatePageProps {}

export default function CreatePage(props: CreatePageProps) {
  const [selectedParentPage, setSelectedParentPage] = useState<NotionPageObject>(
    parseFromLocalStorage(SELECTED_PARENT_PAGE),
  );
  const [newPage, setNewPage] = useState<NewPage>({ title: '', content: '' });

  const handleSelectParentPage = (selectedItem: NotionPageOrDatabaseObject) => {
    const page = selectedItem as NotionPageObject;
    setSelectedParentPage(page);
    localStorage.setItem(SELECTED_PARENT_PAGE, JSON.stringify(page));
  };

  const handleCreatePage = async (): Promise<void> => {
    if (!selectedParentPage || !newPage) return;

    broadcast<boolean>(Events.Loading, true);

    console.log(`Adding page to parent [${getName(selectedParentPage)}]`);
    console.log(`Page title [${newPage.title}]`);
    console.log(`Page content [${newPage.content}]`);

    const createdPage = await createPageInParentPage(selectedParentPage.id, newPage.title, newPage.content);
    broadcast<NotificationPayload>(Events.Notify, {
      Message: `Created [${newPage.title}]`,
      LinkName: 'Link',
      LinkUrl: createdPage.url,
    });
    setNewPage({ title: '', content: '' });

    broadcast<boolean>(Events.Loading, false);
  };

  return (
    <Container>
      <ItemSelector
        selectorType="parent page"
        item={selectedParentPage}
        setItem={handleSelectParentPage}
        itemType={ItemType.page}
      />
      <AddPageForm setNewPage={setNewPage} newPage={newPage} />
      <Button variant="contained" onClick={handleCreatePage} sx={{ mt: 1 }}>
        Create Page
      </Button>
    </Container>
  );
}
