import { Box, TextField } from '@mui/material';
import { useRef, useState } from 'react';
import AiContextDialog from './AiContextDialog';

interface AddContentFormProps {
  setContent: (content: string) => void;
  content: string;
}

export default function AddContentForm(props: AddContentFormProps) {
  const [selectedText, setSelectedText] = useState('');
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number;
    mouseY: number;
  } | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>();

  const handleSetContent = (content: string) => {
    props.setContent(content);
  };

  const handleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();

    if (!textareaRef.current) return;
    const selectionStart = textareaRef.current.selectionStart;
    const selectionEnd = textareaRef.current.selectionEnd;

    setSelectedText(props.content.substring(selectionStart, selectionEnd));

    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6,
          }
        : null,
    );
  };

  const handleClose = () => {
    setContextMenu(null);
  };

  const insertText = (text: string) => {
    if (!textareaRef.current) return;

    const selectionStart = textareaRef.current.selectionStart;
    const selectionEnd = textareaRef.current.selectionEnd;
    const newContent = `${props.content.substring(0, selectionStart)}${text}${props.content.substring(
      selectionEnd,
      props.content.length,
    )}`;

    props.setContent(newContent);
  };

  return (
    <>
      <Box onContextMenu={handleContextMenu}>
        <TextField
          sx={{ mt: 1 }}
          fullWidth
          label="Content"
          inputRef={textareaRef}
          multiline
          rows={4}
          value={props.content}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleSetContent(event.target.value)}
        />
      </Box>
      <AiContextDialog
        open={contextMenu !== null}
        handleClose={handleClose}
        insertText={insertText}
        presetText={selectedText}
      />
    </>
  );
}
