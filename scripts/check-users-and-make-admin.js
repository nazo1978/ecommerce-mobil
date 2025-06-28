require('dotenv').config({ path: '.env.local' });
const { createClerkClient } = require('@clerk/nextjs/server');

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

async function checkUsersAndMakeAdmin() {
  try {
    console.log('🔍 Tüm kullanıcılar listeleniyor...\n');

    // Tüm kullanıcıları listele
    const userList = await clerkClient.users.getUserList({
      limit: 50,
      orderBy: '-created_at'
    });

    if (!userList || !userList.data || userList.data.length === 0) {
      console.log('❌ Hiç kullanıcı bulunamadı.');
      return;
    }

    console.log(`📋 Toplam ${userList.data.length} kullanıcı bulundu:\n`);

    // Her kullanıcıyı listele
    userList.data.forEach((user, index) => {
      const email = user.emailAddresses[0]?.emailAddress || 'Email yok';
      const role = user.publicMetadata?.role || 'role yok';
      const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'İsim yok';
      
      console.log(`${index + 1}. Kullanıcı:`);
      console.log(`   📧 Email: ${email}`);
      console.log(`   👤 İsim: ${name}`);
      console.log(`   🔑 User ID: ${user.id}`);
      console.log(`   👑 Rol: ${role}`);
      console.log(`   📅 Kayıt: ${new Date(user.createdAt).toLocaleDateString('tr-TR')}`);
      console.log(`   🔗 Provider: ${user.externalAccounts?.[0]?.provider || 'email'}`);
      console.log('');
    });

    // emrevaryemez22@gmail.com kullanıcısını bul
    const targetUser = userList.data.find(user => 
      user.emailAddresses.some(email => 
        email.emailAddress === 'emrevaryemez22@gmail.com'
      )
    );

    if (targetUser) {
      console.log('✅ emrevaryemez22@gmail.com kullanıcısı bulundu!');
      console.log(`   Mevcut rol: ${targetUser.publicMetadata?.role || 'role yok'}`);
      
      if (targetUser.publicMetadata?.role === 'admin') {
        console.log('✅ Kullanıcı zaten admin!');
      } else {
        console.log('🔄 Admin rolü atanıyor...');
        
        await clerkClient.users.updateUserMetadata(targetUser.id, {
          publicMetadata: {
            ...targetUser.publicMetadata,
            role: 'admin'
          }
        });
        
        console.log('🎉 emrevaryemez22@gmail.com başarıyla admin yapıldı!');
      }
    } else {
      console.log('❌ emrevaryemez22@gmail.com kullanıcısı bulunamadı.');
      console.log('💡 Lütfen önce bu email ile Clerk\'te kayıt olun.');
    }

    console.log('\n🔄 Tarayıcıda çıkış yapıp tekrar giriş yapın.');
    console.log('📱 Google ile giriş yapıyorsanız, Google hesabınızın email adresini kontrol edin.');

  } catch (error) {
    console.error('❌ Hata:', error.message);
    if (error.status === 401) {
      console.log('💡 Clerk API anahtarlarınızı kontrol edin.');
    }
  }
}

checkUsersAndMakeAdmin();
