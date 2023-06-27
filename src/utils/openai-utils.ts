import axios, { AxiosInstance } from 'axios';
import { OPENAI_TOKEN } from './consts';

const openAiApiUrl = 'https://api.openai.com/v1/';
const model = 'gpt-3.5-turbo';

export enum AiPrompts {
  ask = 'ask',
  summarize = 'summarize',
  add_details = 'add_details',
}

export const generateChatCompletion = async (promptText: string, prompt: AiPrompts): Promise<string> => {
  const body = {
    model,
    messages: [{ role: 'user', content: promptText }],
  };
  const promptContext = createPromptContext(prompt);
  if (promptContext) {
    body.messages.push({ role: 'user', content: promptContext });
  }

  const response = await createOpenAiApiClient().post('chat/completions', body);

  return response.data.choices[0].message.content;
};

const createOpenAiApiClient = (): AxiosInstance => {
  return axios.create({
    baseURL: openAiApiUrl,
    headers: {
      ...getAuthHeader(),
    },
  });
};

const getAuthHeader = (): { Authorization: string } => {
  return { Authorization: `Bearer ${localStorage.getItem(OPENAI_TOKEN)}` };
};

const createPromptContext = (prompt: AiPrompts): string => {
  switch (prompt) {
    case AiPrompts.ask:
      return '';
    case AiPrompts.summarize:
      return 'Create a summary';
    case AiPrompts.add_details:
      return 'Add more details';
  }
};
