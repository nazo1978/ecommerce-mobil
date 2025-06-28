require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: '2024-01-01',
});

async function testSanityConnection() {
  try {
    console.log('🔍 Sanity bağlantısı test ediliyor...');
    console.log('Project ID:', process.env.NEXT_PUBLIC_SANITY_PROJECT_ID);
    console.log('Dataset:', process.env.NEXT_PUBLIC_SANITY_DATASET);
    console.log('API Token:', process.env.SANITY_API_TOKEN ? 'Mevcut' : 'Yok');
    
    // Basit bir sorgu ile test et
    const result = await client.fetch('*[_type == "product"][0..2]');
    console.log('✅ Sanity bağlantısı başarılı!');
    console.log('Bulunan ürün sayısı:', result.length);
    
  } catch (error) {
    console.error('❌ Sanity bağlantı hatası:', error.message);
    if (error.message.includes('Session does not match project host')) {
      console.log('💡 API token geçersiz. Yeni token oluşturun:');
      console.log('   1. https://sanity.io/manage adresine gidin');
      console.log('   2. Projenizi seçin');
      console.log('   3. API sekmesine gidin');
      console.log('   4. Tokens bölümünden yeni token oluşturun');
      console.log('   5. .env.local dosyasındaki SANITY_API_TOKEN değerini güncelleyin');
    }
  }
}

testSanityConnection();
