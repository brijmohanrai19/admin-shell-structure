const bcrypt = require('bcrypt');

async function hashPassword(password) {
  const hash = await bcrypt.hash(password, 10);
  console.log('\n═══════════════════════════════════════');
  console.log('Password Hash Generated');
  console.log('═══════════════════════════════════════');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('═══════════════════════════════════════');
  console.log('\nCopy this hash to migrations/001_create_users.sql');
  console.log('Replace the existing hash in INSERT statement.\n');
}

const password = process.argv[2] || 'admin123';
hashPassword(password);
