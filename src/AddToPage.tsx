import { Button, Container } from '@mui/material';
import { useState } from 'react';
import AddContentForm from './AddContentForm';
import ItemSelector from './ItemSelector';
import { ItemType } from './types';

interface AddToPageProps {}

export default function AddToPage(props: AddToPageProps) {
  const [selectedPage, setSelectedPage] = useState<any>();
  const [content, setContent] = useState('');

  const handleAddToPage = () => {
    console.log(`Selected Page: [${JSON.stringify(selectedPage)}]`);
    console.log(`Content to add: [${content}]`);
  };

  return (
    <Container>
      <ItemSelector setItem={setSelectedPage} itemType={ItemType.page} />
      <AddContentForm content={content} setContent={setContent} />
      <Button variant="contained" onClick={handleAddToPage} sx={{ mt: 1 }}>
        Add To Page
      </Button>
    </Container>
  );
}
