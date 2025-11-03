const bcrypt = require('bcryptjs');
const { User, sequelize } = require('./models');

async function createEmployee(username, password, fullName) {
  await sequelize.sync();
  
  const passwordHash = await bcrypt.hash(password, 12);
  const employee = await User.create({
    fullName,
    idNumber: `EMP${Date.now()}`,
    accountNumber: `ACC${Date.now()}`,
    username,
    passwordHash,
    role: 'employee'
  });
  
  console.log(`✓ Employee created: ${username}`);
  return employee;
}

// Usage: node server/createEmployee.js <username> <password> <fullName>
if (require.main === module) {
  const [,, username, password, fullName] = process.argv;
  if (!username || !password || !fullName) {
    console.error('Usage: node createEmployee.js <username> <password> <fullName>');
    process.exit(1);
  }
  createEmployee(username, password, fullName)
    .then(() => process.exit(0))
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { createEmployee };
