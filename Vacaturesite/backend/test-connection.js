// backend/test-connection.js
const connectDB = require('./db');
const TestUser = require('./models/TestUser');

async function main() {
  await connectDB();
  console.log('Verbonden met MongoDB!');

  // Test: maak een gebruiker aan
  const user = await TestUser.create({ name: 'Test Gebruiker', email: 'test@example.com' });
  console.log('Testgebruiker aangemaakt:', user);

  // Test: haal alle gebruikers op
  const users = await TestUser.find();
  console.log('Alle gebruikers:', users);

  process.exit(0);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
