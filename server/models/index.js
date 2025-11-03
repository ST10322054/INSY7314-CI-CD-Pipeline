// models/index.js
const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT || 'sqlite',
  storage: process.env.SQLITE_STORAGE || './data/dev.sqlite',
  logging: false
});

const User = sequelize.define('User', {
  fullName: { type: DataTypes.STRING, allowNull: false },
  idNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  accountNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  passwordHash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.ENUM('customer', 'employee'), defaultValue: 'customer' }
});

const Payment = sequelize.define('Payment', {
  amount: { type: DataTypes.DECIMAL(15,2), allowNull: false },
  currency: { type: DataTypes.STRING, allowNull: false },
  provider: { type: DataTypes.STRING, allowNull: false },
  payeeAccount: { type: DataTypes.STRING, allowNull: false },
  swiftCode: { type: DataTypes.STRING, allowNull: false },
  status: { type: DataTypes.ENUM('pending','verified','submitted'), defaultValue: 'pending' },
  verifiedBy: { type: DataTypes.INTEGER, allowNull: true },
  submittedAt: { type: DataTypes.DATE, allowNull: true }
});

// Associations
User.hasMany(Payment, { foreignKey: 'customerId' });
Payment.belongsTo(User, { foreignKey: 'customerId' });

module.exports = { sequelize, User, Payment };
