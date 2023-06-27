import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Events, broadcast } from '../utils/broadcaster';
import { AiPrompts, generateChatCompletion } from '../utils/openai-utils';

interface AiContextDialogProps {
  open: boolean;
  handleClose: () => void;
  insertText: (text: string) => void;
  presetText: string;
}

export default function AiContextDialog(props: AiContextDialogProps) {
  const [promptText, setPromptText] = useState(props.presetText);
  const [generatedText, setGeneratedText] = useState('');
  const [prompt, setPrompt] = useState(AiPrompts.ask);

  useEffect(() => {
    setPromptText(props.presetText);
  }, [setPromptText, props.presetText]);

  const handleAiPromptChange = (event: SelectChangeEvent) => {
    setPrompt(event.target.value as AiPrompts);
  };

  const handleGenerateText = async () => {
    broadcast<boolean>(Events.Loading, true);
    const genText = await generateChatCompletion(promptText, prompt);
    setGeneratedText(genText);
    broadcast<boolean>(Events.Loading, false);
  };

  return (
    <>
      <Dialog fullWidth open={props.open} onClose={props.handleClose} sx={{ zIndex: 998 }}>
        <DialogTitle>AI Helper</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }} variant="standard">
            <InputLabel id="ai-prompt-select-label">AI Prompt</InputLabel>
            <Select
              labelId="ai-prompt-select-label"
              id="ai-prompt-select"
              value={prompt}
              label="AI Prompt"
              onChange={handleAiPromptChange}
            >
              <MenuItem value={AiPrompts.ask}>Ask...</MenuItem>
              <MenuItem value={AiPrompts.summarize}>Summarize...</MenuItem>
              <MenuItem value={AiPrompts.add_details}>Add Details...</MenuItem>
            </Select>
            <TextField
              variant="standard"
              sx={{ mt: 1 }}
              fullWidth
              value={promptText}
              onChange={event => setPromptText(event.target.value)}
            />
            <Button sx={{ textAlign: 'center', m: 2 }} variant="outlined" onClick={handleGenerateText}>
              Generate
            </Button>
          </FormControl>

          {generatedText ? (
            <>
              <TextField
                sx={{ mt: 1 }}
                fullWidth
                label="Generated Text"
                multiline
                minRows={5}
                maxRows={5}
                value={generatedText}
                onChange={event => setGeneratedText(event.target.value)}
              />
              <Button
                sx={{ textAlign: 'center', m: 2 }}
                variant="contained"
                onClick={() => {
                  props.insertText(generatedText);
                  setGeneratedText('');
                  props.handleClose();
                }}
              >
                Insert Text
              </Button>
            </>
          ) : (
            <></>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
