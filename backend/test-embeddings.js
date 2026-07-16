const { OpenAIEmbeddings } = require('@langchain/openai');
const fs = require('fs');

const envPath = '.env';
let apiKey = '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';

if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const apiKeyMatch = envContent.match(/NVIDIA_API_KEY\s*=\s*(.*)/);
  if (apiKeyMatch) {
    apiKey = apiKeyMatch[1].trim();
  }
}

console.log('Testing NVIDIA Embeddings...');

async function testEmbeddings() {
  const start = Date.now();
  try {
    const embeddings = new OpenAIEmbeddings({
      apiKey: apiKey,
      openAIApiKey: apiKey,
      configuration: {
        baseURL: 'https://integrate.api.nvidia.com/v1',
      },
      modelName: 'nvidia/llama-nemotron-embed-1b-v2', // Multilingual embedding model
    });

    console.log('Generating embedding...');
    const result = await embeddings.embedQuery('Hello world');
    const duration = Date.now() - start;
    console.log(`Duration: ${duration}ms`);
    console.log(`Embedding dimensions: ${result.length}`);
    console.log(`First 5 values:`, result.slice(0, 5));
  } catch (error) {
    console.error('Embeddings error:', error);
  }
}

testEmbeddings();
