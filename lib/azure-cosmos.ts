import { CosmosClient } from '@azure/cosmos';

const client = new CosmosClient({
  endpoint: process.env.AZURE_COSMOS_ENDPOINT!,
  key: process.env.AZURE_COSMOS_KEY!
});

const database = client.database('ContentDB');
const container = database.container('content');

export async function getContent(): Promise<{ jp: any; vn: any }> {
  try {
    // Get JP content
    let jpContent = {};
    try {
      const { resource: jpResource } = await container.item('jp', 'jp').read();
      jpContent = jpResource?.data || {};
    } catch (error) {
      console.log('JP content not found, using empty object');
    }

    // Get VN content
    let vnContent = {};
    try {
      const { resource: vnResource } = await container.item('vn', 'vn').read();
      vnContent = vnResource?.data || {};
    } catch (error) {
      console.log('VN content not found, using empty object');
    }

    return { jp: jpContent, vn: vnContent };
  } catch (error) {
    console.error('Error getting content from Cosmos DB:', error);
    
    // Fallback to file-based content if Cosmos DB fails
    try {
      const fs = await import('fs');
      const path = await import('path');
      const filePath = path.join(process.cwd(), 'data', 'content.json');
      const fileContent = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(fileContent);
    } catch (fileError) {
      console.error('Fallback file read failed:', fileError);
      return { jp: {}, vn: {} };
    }
  }
}

export async function saveContent(data: { jp: any; vn: any }): Promise<{ success: boolean; error?: string }> {
  try {
    const timestamp = new Date().toISOString();

    // Save JP content
    const jpItem = {
      id: 'jp',
      language: 'jp',
      data: data.jp,
      lastUpdated: timestamp
    };
    
    // Save VN content  
    const vnItem = {
      id: 'vn',
      language: 'vn',
      data: data.vn,
      lastUpdated: timestamp
    };

    // Upsert both items
    await Promise.all([
      container.items.upsert(jpItem),
      container.items.upsert(vnItem)
    ]);

    return { success: true };
  } catch (error) {
    console.error('Error saving content to Cosmos DB:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

export async function initializeContentFromFile(): Promise<void> {
  try {
    // Read existing content.json file
    const fs = await import('fs');
    const path = await import('path');
    const filePath = path.join(process.cwd(), 'data', 'content.json');
    
    if (fs.existsSync(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      
      // Save to Cosmos DB
      await saveContent(data);
      console.log('Content migrated from file to Cosmos DB successfully');
    }
  } catch (error) {
    console.error('Error initializing content from file:', error);
  }
}
