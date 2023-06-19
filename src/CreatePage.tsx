import { Button, Container } from '@mui/material';
import { useState } from 'react';
import AddPageForm from './AddPageForm';
import ItemSelector from './ItemSelector';
import { SELECTED_PARENT_PAGE } from './consts';
import { DbPage, ItemType } from './types';
import { createPageInParentPage, getName, parseFromLocalStorage } from './utils/notion-utils';

interface CreatePageProps {}

export default function CreatePage(props: CreatePageProps) {
  const [selectedParentPage, setSelectedParentPage] = useState<any>(parseFromLocalStorage(SELECTED_PARENT_PAGE));
  const [newPage, setNewPage] = useState<DbPage>({ title: '', content: '' });

  const handleSelectParentPage = (selectedParentPage: any) => {
    setSelectedParentPage(selectedParentPage);
    localStorage.setItem(SELECTED_PARENT_PAGE, JSON.stringify(selectedParentPage));
  };

  const handleCreatePage = async (): Promise<void> => {
    if (!selectedParentPage || !newPage) return;
    console.log(`Adding page to parent [${getName(selectedParentPage)}]`);
    console.log(`Page title [${newPage.title}]`);
    console.log(`Page content [${newPage.content}]`);

    await createPageInParentPage(selectedParentPage.id, newPage.title, newPage.content);
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
