import { BlobServiceClient } from '@azure/storage-blob';
import { CosmosClient } from '@azure/cosmos';
import fs from 'fs';

// Read .env.local file
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key] = valueParts.join('=').replace(/^"|"$/g, '');
    }
  }
});

async function testAzureConnections() {
  console.log('🧪 Testing Azure Connections...\n');

  // Test Azure Storage
  try {
    console.log('📦 Testing Azure Storage...');
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      envVars.AZURE_STORAGE_CONNECTION_STRING
    );
    
    const containerClient = blobServiceClient.getContainerClient(
      envVars.AZURE_STORAGE_CONTAINER_NAME
    );
    
    // Check if container exists
    const exists = await containerClient.exists();
    console.log(`✅ Storage Account: Connected`);
    console.log(`✅ Container "images": ${exists ? 'Found' : 'Not Found (will be created)'}`);
    
    if (!exists) {
      await containerClient.create();
      console.log(`✅ Container "images": Created`);
    }
  } catch (error) {
    console.log(`❌ Storage Error:`, error.message);
  }

  // Test Cosmos DB
  try {
    console.log('\n🗃️ Testing Cosmos DB...');
    const cosmosClient = new CosmosClient(envVars.AZURE_COSMOS_CONNECTION_STRING);
    
    // Test connection
    const { databases } = await cosmosClient.databases.readAll().fetchAll();
    console.log(`✅ Cosmos DB: Connected`);
    console.log(`✅ Available databases: ${databases.length}`);
    
    // Check our database
    const databaseId = envVars.AZURE_COSMOS_DATABASE_NAME;
    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseId });
    console.log(`✅ Database "${databaseId}": Ready`);
    
    // Check our container
    const containerId = envVars.AZURE_COSMOS_CONTAINER_NAME;
    const { container } = await database.containers.createIfNotExists({ 
      id: containerId,
      partitionKey: { paths: ['/id'] }
    });
    console.log(`✅ Container "${containerId}": Ready`);
    
  } catch (error) {
    console.log(`❌ Cosmos DB Error:`, error.message);
    if (error.message.includes('Unauthorized')) {
      console.log('💡 Hint: Check if Cosmos DB connection string is complete (should include AccountEndpoint + AccountKey)');
    }
  }

  console.log('\n🎉 Connection test completed!');
}

testAzureConnections().catch(console.error);
