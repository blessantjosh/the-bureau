import { Embeddings, type EmbeddingsParams } from '@langchain/core/embeddings';

export interface NvidiaEmbeddingsParams extends EmbeddingsParams {
  apiKey: string;
  modelName?: string;
  baseURL?: string;
}

export class NvidiaEmbeddings extends Embeddings {
  private apiKey: string;
  private modelName: string;
  private baseURL: string;

  constructor(fields: NvidiaEmbeddingsParams) {
    super(fields ?? {});
    this.apiKey = fields.apiKey;
    this.modelName = fields.modelName || 'nvidia/llama-nemotron-embed-1b-v2';
    this.baseURL = fields.baseURL || 'https://integrate.api.nvidia.com/v1';
  }

  async embedDocuments(documents: string[]): Promise<number[][]> {
    const embeddings: number[][] = [];
    for (const doc of documents) {
      const emb = await this.callApi(doc, 'passage');
      embeddings.push(emb);
    }
    return embeddings;
  }

  async embedQuery(document: string): Promise<number[]> {
    return await this.callApi(document, 'query');
  }

  private async callApi(text: string, inputType: 'query' | 'passage'): Promise<number[]> {
    const response = await fetch(`${this.baseURL}/embeddings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.modelName,
        input: text,
        input_type: inputType,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`NVIDIA Embeddings Error (${response.status}): ${errText}`);
    }

    const data = await response.json();
    if (!data.data || !data.data[0] || !data.data[0].embedding) {
      throw new Error('NVIDIA Embeddings API returned an unexpected response structure.');
    }

    return data.data[0].embedding;
  }
}
