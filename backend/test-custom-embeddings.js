const { Embeddings } = require('@langchain/core/embeddings');
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

class NvidiaEmbeddings extends Embeddings {
  constructor(fields) {
    super(fields ?? {});
    this.apiKey = fields.apiKey;
    this.modelName = fields.modelName || 'nvidia/llama-nemotron-embed-1b-v2';
    this.baseURL = fields.baseURL || 'https://integrate.api.nvidia.com/v1';
  }

  async embedDocuments(documents) {
    const embeddings = [];
    for (const doc of documents) {
      const emb = await this._callApi(doc, 'passage');
      embeddings.push(emb);
    }
    return embeddings;
  }

  async embedQuery(document) {
    return await this._callApi(document, 'query');
  }

  async _callApi(text, inputType) {
    const response = await fetch(`${this.baseURL}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: this.modelName,
        input: text,
        input_type: inputType
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`NVIDIA Embeddings Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    return data.data[0].embedding;
  }
}

async function runTest() {
  console.log('Testing Custom NvidiaEmbeddings class...');
  const customEmbed = new NvidiaEmbeddings({ apiKey });

  try {
    console.log('Embedding query "Hello world"...');
    const queryEmb = await customEmbed.embedQuery('Hello world');
    console.log('Query embedding dimension:', queryEmb.length);
    console.log('First 5 values:', queryEmb.slice(0, 5));

    console.log('Embedding passage "The Bureau is an advanced agentic team."...');
    const docEmbs = await customEmbed.embedDocuments(['The Bureau is an advanced agentic team.']);
    console.log('Doc embedding dimension:', docEmbs[0].length);
    console.log('First 5 values:', docEmbs[0].slice(0, 5));
  } catch (err) {
    console.error('Custom embeddings failed:', err);
  }
}

runTest();
