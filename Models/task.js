const { DataTypes } = require('sequelize');
const sequelize = require('./index');  // Import connection

const Task = sequelize.define('Task', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING(255),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  dueDate: {  // Matches 'due_date' in DB
    type: DataTypes.DATEONLY,  // Just date, no time
    field: 'due_date',  // Maps to DB column
    allowNull: true,
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Completed', 'Cancelled'),
    defaultValue: 'Pending',
    allowNull: false,
  },
  completion: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: { min: 0, max: 100 },
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at',
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'updated_at',
  },
}, {
  tableName: 'tasks',  // Explicit table name
  timestamps: true,    // Auto-manages createdAt/updatedAt
  underscored: true,   // Uses snake_case for DB columns (e.g., due_date)
});

// Sync model with DB (creates table if missing; use { force: true } to drop/recreate for dev resets)
Task.sync({ alter: true })  // 'alter' updates schema if needed without dropping data
  .then(async () => {
    console.log('Task model synced!');
    await seedSamples();  // Now waits for sync to finish
  })
  .catch(err => console.error('Sync error:', err));

// Optional: Seed sample data (runs once on sync)
const seedSamples = async () => {
  try {
    const count = await Task.count();
    if (count === 0) {
      await Task.bulkCreate([
        {
          title: 'Sample Task',
          description: 'Do something fun',
          dueDate: '2025-11-15',
          status: 'Pending',
          completion: 0,
        },
        {
          title: 'Another One',
          description: 'Halfway there',
          dueDate: '2025-11-20',
          status: 'In Progress',
          completion: 50,
        },
      ]);
      console.log('Sample tasks seeded!');
    } else {
      console.log(`Skipping seed—${count} tasks already exist.`);
    }
  } catch (err) {
    console.error('Seed error:', err);
  }
};

module.exports = Task;