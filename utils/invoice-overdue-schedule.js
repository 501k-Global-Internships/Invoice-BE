import sequelize from 'sequelize';
import cron from 'node-cron';
import models from '../models';

const { invoice } = models;

export default function scheduleInvoice() {
  // Schedule a task to run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      // Find overdue invoices
      const overdueInvoices = await invoice.findAll({
        where: {
          dueDate: {
            [sequelize.Op.lt]: new Date(), // Due date is in the past
          },
          status: {
            [sequelize.Op.notIn]: ['paid', 'draft', 'overdue'], // Status is not paid, draft or already overdue
          },
        },
      });
  
      // Update status of overdue invoices
      for (const invoice of overdueInvoices) {
        await invoice.update({ status: 'overdue' });
      }
  
      console.log('Updated overdue invoices:', overdueInvoices.length);
    } catch (error) {
      console.error('Error updating overdue invoices:', error);
    }
  });
}
