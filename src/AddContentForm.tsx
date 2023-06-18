import { TextField } from '@mui/material';

interface AddContentFormProps {
  setContent: (content: string) => void;
  content: string;
}

export default function AddContentForm(props: AddContentFormProps) {
  return (
    <>
      <TextField
        sx={{ mt: 1 }}
        fullWidth
        label="Content"
        multiline
        rows={4}
        value={props.content}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          const content = event.target.value;
          props.setContent(content);
        }}
      />
    </>
  );
}
