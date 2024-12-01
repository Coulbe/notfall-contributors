const cron = require('node-cron');
const Task = require('../models/Task');

const scheduleRecurringTasks = () => {
  cron.schedule('0 0 * * *', async () => {
    const recurringTasks = await Task.find({ isRecurring: true });
    for (const task of recurringTasks) {
      const newTask = { ...task.toObject(), isRecurring: false, status: 'Pending' };
      delete newTask._id;
      await Task.create(newTask);
    }
    console.log('Recurring tasks scheduled.');
  });
};

module.exports = { scheduleRecurringTasks };
