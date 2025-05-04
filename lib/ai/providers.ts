import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { groq } from '@ai-sdk/groq';
import { xai } from '@ai-sdk/xai';
import { google } from '@ai-sdk/google';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        // 'chat-model': google('gemini-2.0-flash'),
        'chat-model': wrapLanguageModel({
          model: google('gemini-2.5-flash-preview-04-17'),
          // model: google('gemini-2.0-flash'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'chat-model-reasoning': wrapLanguageModel({
          model: google('gemini-2.0-flash'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': groq('llama-3.1-8b-instant'),
        'artifact-model': groq('llama-3.1-8b-instant'),
      },
      imageModels: {
        'small-model': xai.image('grok-2-image'),
      },
    });
