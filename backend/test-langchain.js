const { ChatOpenAI } = require('@langchain/openai');
const { SystemMessage, HumanMessage } = require('@langchain/core/messages');
const fs = require('fs');

const envPath = '.env';
let apiKey = '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';
let model = 'meta/llama-3.1-8b-instruct';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const apiKeyMatch = envContent.match(/NVIDIA_API_KEY\s*=\s*(.*)/);
  if (apiKeyMatch) {
    apiKey = apiKeyMatch[1].trim();
  }
  const modelMatch = envContent.match(/NVIDIA_MODEL\s*=\s*(.*)/);
  if (modelMatch) {
    model = modelMatch[1].trim();
  }
}

console.log('Testing with ChatOpenAI...');
console.log('Model:', model);

async function testLangChain() {
  const start = Date.now();
  try {
    const chat = new ChatOpenAI({
      apiKey: apiKey,
      openAIApiKey: apiKey,
      configuration: {
        baseURL: 'https://integrate.api.nvidia.com/v1',
      },
      modelName: model,
      temperature: 0.7,
    });

    console.log('Invoking model...');
    const response = await chat.invoke([
      new SystemMessage('You are a helpful assistant.'),
      new HumanMessage('Say hello in 5 words.')
    ]);

    const duration = Date.now() - start;
    console.log(`Duration: ${duration}ms`);
    console.log('Response content:', response.content);
  } catch (error) {
    console.error('LangChain error:', error);
  }
}

testLangChain();
