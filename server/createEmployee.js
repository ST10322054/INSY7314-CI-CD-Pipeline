require('dotenv').config();
const { sequelize, User } = require('./models');
const bcrypt = require('bcryptjs');

(async () => {
  await sequelize.authenticate();
  const passwordHash = await bcrypt.hash('EmployeeP@ss1', 12);
  const employee = await User.create({
    fullName: 'Staff Member',
    idNumber: '9999999999',
    accountNumber: '20000000',
    username: 'staff1',
    passwordHash,
    role: 'employee'
  });
  console.log('Employee created:', employee.username);
  process.exit();
})();
