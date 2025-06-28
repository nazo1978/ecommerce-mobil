require('dotenv').config({ path: '.env.local' });
const { createClerkClient } = require('@clerk/nextjs/server');

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function makeUserAdmin() {
  try {
    console.log('🔍 Kullanıcı aranıyor: emrevaryemez22@gmail.com');

    // Email adresine göre kullanıcıyı bul
    const userList = await clerkClient.users.getUserList({
      emailAddress: ['emrevaryemez22@gmail.com']
    });

    if (!userList || !userList.data || userList.data.length === 0) {
      console.log('❌ Kullanıcı bulunamadı: emrevaryemez22@gmail.com');
      console.log('💡 Önce Clerk\'te kayıt olduğunuzdan emin olun.');
      return;
    }

    const user = userList.data[0];
    console.log('✅ Kullanıcı bulundu!');
    console.log('   User ID:', user.id);
    console.log('   Email:', user.emailAddresses[0].emailAddress);
    console.log('   Mevcut metadata:', user.publicMetadata);

    // Kullanıcıyı admin yap
    await clerkClient.users.updateUserMetadata(user.id, {
      publicMetadata: {
        ...user.publicMetadata,
        role: 'admin'
      }
    });

    console.log('🎉 Kullanıcı başarıyla admin yapıldı!');
    console.log('   User ID:', user.id);
    console.log('   Email:', user.emailAddresses[0].emailAddress);
    console.log('   Yeni Role: admin');
    console.log('');
    console.log('🔄 Şimdi tarayıcıda çıkış yapıp tekrar giriş yapın.');

  } catch (error) {
    console.error('❌ Hata:', error.message);
    if (error.status === 401) {
      console.log('💡 Clerk API anahtarlarınızı kontrol edin.');
    }
  }
}

makeUserAdmin();
