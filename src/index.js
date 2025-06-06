import { client, checkConnection } from './config.js';

async function main() {
  try {
    // 1. Verify connection
    if (!await checkConnection()) return;
    
    // 2. Clean up existing index
    await client.indices.delete({ 
      index: 'books', 
      ignore_unavailable: true
    });
    
    // 3. Create fresh index
    await client.indices.create({
      index: 'books',
      body: {
        mappings: {
          properties: {
            title: { type: 'text' },
            author: { type: 'keyword' },
            year: { type: 'integer' },
            in_stock: { type: 'boolean' },
            genre: { type: 'keyword' },
            pages: { type: 'integer' },
          }
        }
      }
    });
    
    //  Index single document
    await client.index({
      index: 'books',
      id: '1',  
      body: {   
        title: 'The Rumbling',
        author: 'Anna Lool',
        year: 1917,
        in_stock: true,
        genre: 'drama',
        pages: 250,

      }
    });


    //  Bulk insert 
    const { body: bulkResponse } = await client.bulk({
      refresh: true,
      body: [
        { index: { _index: 'books', _id: '2' } }, 
        { title: 'The Hobbit', author: 'J.R.R. Tolkien', year: 1937, in_stock: true, genre: 'Fantasy', pages: 310 },
        
        { index: { _index: 'books', _id: '3' } },  
        { title: 'A book', author: 'Radnom Person', year: 1900, in_stock: false, genre: 'Mystery', pages: 20 },
        
        { index: { _index: 'books', _id: '4' } },
        { title: 'Beach Alley', author: 'Player One', year: 2022, in_stock: true, genre: 'Horror', pages: 400 }
      ]
    });
    console.log('✅ Documents indexed');
    
    //update book
    await client.update({
        index: 'books',
        id: '1',
        body:{
            doc:{
                year: 1938,
                in_stock: false
            }
        }
    });
    console.log('🔄 Document updated');

    //delete a book
    await client.delete({
        index: 'books',
        id: '3'
    });
    console.log('Document deleted');

    const result = await client.search({
  index: 'books',
  query: {
    bool: {
      must: { match: { in_stock: true } },
      filter: { range: { year: { gte: 1900 } } }
    }
  }
});
console.log(result.hits.hits);


  } catch (error) {
    console.error('⚠️ Error:', error.meta?.body?.error || error.message);
  }
}

main();