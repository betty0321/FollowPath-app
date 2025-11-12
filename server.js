require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Task = require('./Models/task');  // Import model

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// GET /tasks - Fetch with filters/sort/search
app.get('/tasks', async (req, res) => {
  try {
    let query = { where: {} };

    // Filter by status
    if (req.query.status && req.query.status !== 'all') {
      query.where.status = req.query.status;
    }

    // Search by title/description
    if (req.query.search) {
      query.where[Sequelize.Op.or] = [
        { title: { [Sequelize.Op.iLike]: `%${req.query.search}%` } },
        { description: { [Sequelize.Op.iLike]: `%${req.query.search}%` } },
      ];
    }

    // Sort (map your frontend sorts)
    let order = [['dueDate', 'ASC']];  // Default
    if (req.query.sort === 'due-desc') order = [['dueDate', 'DESC']];
    if (req.query.sort === 'title') order = [['title', 'ASC']];
    query.order = order;

    const tasks = await Task.findAll(query);
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /tasks - Create
app.post('/tasks', async (req, res) => {
  try {
    const { title, description, dueDate, status, completion } = req.body;
    const task = await Task.create({
      title,
      description,
      dueDate,
      status: status || 'Pending',
      completion: completion || 0,
    });
    res.status(201).json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// PUT /tasks/:id - Update
app.put('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, dueDate, status, completion } = req.body;
    const [updated] = await Task.update(
      { title, description, dueDate, status, completion },
      { where: { id }, returning: true }  // 'returning: true' for Postgres to get updated row
    );
    if (!updated) {
      return res.status(404).json({ error: 'Task not found' });
    }
    const task = await Task.findByPk(id);  // Fetch full updated task
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// DELETE /tasks/:id
app.delete('/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: 'Task not found' });
    }
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});