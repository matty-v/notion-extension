import { TextField } from '@mui/material';
import AddContentForm from './AddContentForm';
import { NewPage } from './types';

interface AddPageFormProps {
  setNewPage: (newPage: NewPage) => void;
  newPage: NewPage;
}

export default function AddPageForm(props: AddPageFormProps) {
  return (
    <>
      <TextField
        fullWidth
        label="Title"
        variant="outlined"
        sx={{ mt: 2 }}
        value={props.newPage?.title}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const page = { title: event.target.value, content: props.newPage.content };
          props.setNewPage(page);
        }}
      />
      <AddContentForm
        content={props.newPage.content}
        setContent={(content: string) => {
          const page = { title: props.newPage.title, content: content };
          props.setNewPage(page);
        }}
      />
    </>
  );
}
