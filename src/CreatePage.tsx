import { Button, Container } from '@mui/material';
import { useState } from 'react';
import AddPageForm from './AddPageForm';
import ItemSelector from './ItemSelector';
import { DbPage, ItemType } from './types';
import { createPageInParentPage, getName } from './utils/notion-utils';

interface CreatePageProps {}

export default function CreatePage(props: CreatePageProps) {
  const [selectedParentPage, setSelectedParentPage] = useState<any>();
  const [newPage, setNewPage] = useState<DbPage>({ title: '', content: '' });

  const handleCreatePage = async (): Promise<void> => {
    if (!selectedParentPage || !newPage) return;
    console.log(`Adding page to parent [${getName(selectedParentPage)}]`);
    console.log(`Page title [${newPage.title}]`);
    console.log(`Page content [${newPage.content}]`);

    await createPageInParentPage(selectedParentPage.id, newPage.title, newPage.content);
  };

  return (
    <Container>
      <ItemSelector setItem={setSelectedParentPage} itemType={ItemType.page} />
      <AddPageForm setNewPage={setNewPage} newPage={newPage} />
      <Button variant="contained" onClick={handleCreatePage} sx={{ mt: 1 }}>
        Create Page
      </Button>
    </Container>
  );
}
