import { Client } from '@elastic/elasticsearch';

const client = new Client({
  node: 'http://localhost:9200',
  
  }
);

// Test connection
async function checkConnection() {
  try {
    await client.ping();
    console.log('✅ Connected to Elasticsearch');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    return false;
  }
}

export { client, checkConnection };