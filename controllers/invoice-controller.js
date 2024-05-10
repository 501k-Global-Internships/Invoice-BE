import sequelize from 'sequelize';
import PDFDocument from 'pdfkit';
import { getErrorMessage } from '../utils/utils';
import models from '../models';

const { invoice } = models;

const { Op } = sequelize;

class InvoiceController {
  createInvoice(req, res) {
    invoice.create(
      {
        userId: req.user.id,
        brandLogo: req.body.brandLogo,
        name: req.body.name,
        email: req.body.email,
        customerName: req.body.customerName,
        billingAddress: req.body.billingAddress,
        phoneNumber: req.body.phoneNumber,
        customerEmail: req.body.customerEmail,
        invoiceTitle: req.body.invoiceTitle,
        paymentCurrency: req.body.paymentCurrency,
        itemDescription: req.body.itemDescription,
        quantity: req.body.quantity,
        price: req.body.price,
        amount: req.body.amount,
        additionalInfo: req.body.additionalInfo,
        accountName: req.body.accountName,
        accountNumber: req.body.accountNumber,
        bankName: req.body.bankName,
        issueDate: req.body.issueDate,
        dueDate: req.body.dueDate,
        discount: req.body.discount,
        tax: req.body.tax,
      }).then((nvc) => {
        res.status(201).send({
          nvc,
          message: 'Invoice created successfully',
        })
      }).catch((error) => {
        getErrorMessage(error);
      });
  }

  draftInvoice(req, res) {
    invoice.create(
      {
        userId: req.user.id,
        brandLogo: req.body.brandLogo,
        name: req.body.name,
        email: req.body.email,
        customerName: req.body.customerName,
        billingAddress: req.body.billingAddress,
        phoneNumber: req.body.phoneNumber,
        customerEmail: req.body.customerEmail,
        invoiceTitle: req.body.invoiceTitle,
        paymentCurrency: req.body.paymentCurrency,
        itemDescription: req.body.itemDescription,
        quantity: req.body.quantity,
        price: req.body.price,
        amount: req.body.amount,
        additionalInfo: req.body.additionalInfo,
        accountName: req.body.accountName,
        accountNumber: req.body.accountNumber,
        bankName: req.body.bankName,
        issueDate: req.body.issueDate,
        dueDate: req.body.dueDate,
        discount: req.body.discount,
        tax: req.body.tax,
        status: "draft",
      }).then((nvc) => {
        res.status(201).send({
          nvc,
          message: 'Invoice created successfully',
        })
      }).catch((error) => {
        getErrorMessage(error);
      });
  }

  getInvoices(req, res) {
    const { offset, limit, searchKey, status, dateFilter } = req.query;
    const userId = req.user.id.toString()
    const queryLimit = limit;
    const queryOffset = offset || 0;
    const whereClause = {
      [Op.and]: [
        { userId },
        searchKey === undefined ? {} : {
          [Op.or]: {
            customerName: { [Op.iLike]: `%${searchKey}%` },
            itemDescription: { [Op.iLike]: `%${searchKey}%` },
            invoiceTitle: { [Op.iLike]: `%${searchKey}%` },
            billingAddress: { [Op.iLike]: `%${searchKey}%` },
          },
        },
        status === undefined ? {} : { status },
      ],
    };

    if (dateFilter) {
      const today = new Date();

      switch (dateFilter) {
        case 'last30':
          whereClause.createdAt = {
            [Op.gte]: new Date(today.setDate(today.getDate() - 30)),
          };
          break;
        case 'last60':
          whereClause.createdAt = {
            [Op.gte]: new Date(today.setDate(today.getDate() - 60)),
          };
          break;
        case 'last90':
          whereClause.createdAt = {
            [Op.gte]: new Date(today.setDate(today.getDate() - 90)),
          };
          break;
      }
    }

    invoice.count({ where: whereClause }).then((count) => {
      invoice.findAll({
        order: sequelize.literal('id'),
        offset: queryOffset,
        limit: queryLimit,
        where: whereClause,
      }).then((invoices) => {
        res.status(200).send({
          invoices,
          count,
          limit: queryLimit,
          offset: queryOffset,
        });
      })
        .catch((error) => {
          getErrorMessage(error);
        });
    });
  }

  getInvoiceById(req, res) {
    invoice.findOne({ where: { id: req.params.id } }).then((nvc) => {
      if (nvc) {
        res.status(200).send(nvc);
      } else {
        res.status(404).send({
          message: 'Invoice not found',
        });
      }
    });
  }

  editInvoice(req, res) {
    const newInvoice = invoice.update(
      {
        userId: req.user.id,
        brandLogo: req.body.brandLogo,
        name: req.body.name,
        email: req.body.email,
        customerName: req.body.customerName,
        billingAddress: req.body.billingAddress,
        phoneNumber: req.body.phoneNumber,
        customerEmail: req.body.customerEmail,
        invoiceTitle: req.body.invoiceTitle,
        paymentCurrency: req.body.paymentCurrency,
        itemDescription: req.body.itemDescription,
        quantity: req.body.quantity,
        price: req.body.price,
        amount: req.body.amount,
        additionalInfo: req.body.additionalInfo,
        accountName: req.body.accountName,
        accountNumber: req.body.accountNumber,
        bankName: req.body.bankName,
        issueDate: req.body.issueDate,
        dueDate: req.body.dueDate,
        discount: req.body.discount,
        tax: req.body.tax,
      },
      { where: { id: req.params.id }, returning: true, },
    );
    newInvoice.then((updated) => {
      const updatedInvoice = updated[1][0];

      if (updatedInvoice) {
        return res.status(200).send({
          message: 'Invoice updated successfully',
          meal: updatedInvoice,
        });
      }

      res.status(404).send({
        message: 'Invoice not found',
      });
    }).catch((error) => {
      getErrorMessage(error);
    });
  }

  deleteInvoice(req, res) {
    invoice.destroy({
      where: { id: req.params.id },
    }).then((deleted) => {
      if (deleted) {
        res.status(200).send({
          message: 'Invoice deleted successfully',
        });
      } else {
        res.status(404).send({
          message: 'Invoice not found',
        });
      }
    }).catch((error) => {
      res.status(400).send({ message: error.name });
    });
  }

  downloadInvoice(req, res) {
    invoice.findOne({ where: { id: req.params.id } }).then((nvc) => {
      if (nvc) {
        const doc = new PDFDocument();
        doc.pipe(res); // Pipe the PDF to the response

        doc.font('Helvetica-Bold')
          .fontSize(16)
          .fillColor('blue')
          .text(nvc.invoiceTitle, { align: 'center' });

        doc.moveDown();
        doc.font('Helvetica')
          .fontSize(12)
          .fillColor('black')
        doc.fontSize(14).text(`Invoice ID: ${nvc.id}`);
        doc.moveDown();
        doc.fontSize(12).text(`Name: ${nvc.name}`);
        doc.moveDown();
        doc.text(`Email: ${nvc.email}`);
        doc.moveDown();
        doc.text(`Customer Name: ${nvc.customerName}`);
        doc.moveDown();
        doc.text(`Billing Address: ${nvc.billingAddress}`);
        doc.moveDown();
        doc.text(`Phone Number: ${nvc.phoneNumber}`);
        doc.moveDown();
        doc.text(`Customer Email: ${nvc.customerEmail}`);
        doc.moveDown();
        doc.text(`Payment Currency: ${nvc.paymentCurrency}`);
        doc.moveDown();
        doc.text(`Item Description: ${nvc.itemDescription}`);
        doc.moveDown();
        doc.text(`Quantity: ${nvc.quantity}`);
        doc.moveDown();
        doc.text(`Price: $${nvc.price}`);
        doc.moveDown();
        doc.text(`Amount: $${nvc.amount}`);
        doc.moveDown();
        doc.text(`Discount: $${nvc.discount}`);
        doc.moveDown();
        doc.text(`Tax: $${nvc.tax}`);
        doc.moveDown();
        doc.text(`Account Name: ${nvc.accountName}`);
        doc.moveDown();
        doc.text(`Account Number: ${nvc.accountNumber}`);
        doc.moveDown();
        doc.text(`Bank Name: ${nvc.bankName}`);
        doc.moveDown();
        doc.text(`Issue Date: ${new Date(nvc.issueDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`);
        doc.moveDown();
        doc.text(`Due Date: ${new Date(nvc.dueDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}`);

        // End PDF creation
        doc.end();
      } else {
        res.status(404).send({
          message: 'Invoice not found',
        });
      }
    }).catch((error) => {
      console.error('Error downloading invoice:', error);
    })
  }

  updateInvoiceStatus(req, res) {
    const newInvoice = invoice.update({ status: "paid" },
      { where: { id: req.params.id, status: "unpaid" }, returning: true, });
    newInvoice.then((updated) => {
      const updatedInvoice = updated[1][0];

      if (updatedInvoice) {
        return res.status(200).send({
          message: 'Invoice status updated to "paid"',
          meal: updatedInvoice,
        });
      }

      res.status(404).send({
        message: 'Invoice not found or does not match',
      });
    }).catch((error) => {
      getErrorMessage(error);
    });
  }

}

export default new InvoiceController();