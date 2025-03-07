import OpenAI from 'openai'

const apiKey = process.env['OPENAI_API_KEY']

export const clientAI = new OpenAI({ apiKey })

export function handleOpenAIError(error: any) {
    if (error.name === 'RateLimitError' || error?.status === 429) {
      console.error('🚫 You’ve exceeded your OpenAI API quota.');
      console.error('💡 Visit https://platform.openai.com/account/usage to check your usage.');
      console.error('🔧 Or check your billing at https://platform.openai.com/account/billing');
    } else if (error.response) {
      console.error('❌ API Error:', error.response.status, error.response.data);
    } else {
      console.error('❗ Unexpected Error:', error);
    }
  }