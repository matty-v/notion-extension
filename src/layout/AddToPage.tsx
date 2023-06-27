import { Button, Container } from '@mui/material';
import { useState } from 'react';
import AddContentForm from '../components/AddContentForm';
import ItemSelector from '../components/ItemSelector';
import { Events, broadcast } from '../utils/broadcaster';
import { SELECTED_PAGE } from '../utils/consts';
import { addToPage, getName, parseFromLocalStorage } from '../utils/notion-utils';
import { ItemType, NotificationPayload, NotionPageObject, NotionPageOrDatabaseObject } from '../utils/types';

interface AddToPageProps {}

export default function AddToPage(props: AddToPageProps) {
  const [selectedPage, setSelectedPage] = useState<NotionPageObject>(parseFromLocalStorage(SELECTED_PAGE));
  const [content, setContent] = useState('');

  const handleSelectPage = (selectedItem: NotionPageOrDatabaseObject) => {
    const page = selectedItem as NotionPageObject;
    setSelectedPage(page);
    localStorage.setItem(SELECTED_PAGE, JSON.stringify(page));
  };

  const handleAddToPage = async () => {
    if (!selectedPage || !content) return;

    broadcast<boolean>(Events.Loading, true);

    console.log(`Selected Page: [${JSON.stringify(selectedPage)}]`);
    console.log(`Content to add: [${content}]`);

    await addToPage(selectedPage.id, content);
    broadcast<NotificationPayload>(Events.Notify, {
      Message: `Added to [${getName(selectedPage)}]`,
      LinkName: 'Link',
      LinkUrl: selectedPage.url,
    });
    setContent('');

    broadcast<boolean>(Events.Loading, false);
  };

  return (
    <Container>
      <ItemSelector selectorType="page" item={selectedPage} setItem={handleSelectPage} itemType={ItemType.page} />
      <AddContentForm content={content} setContent={setContent} />
      <Button variant="contained" onClick={handleAddToPage} sx={{ mt: 1 }}>
        Add To Page
      </Button>
    </Container>
  );
}
