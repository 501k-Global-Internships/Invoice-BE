import sequelize, { where } from 'sequelize';
import PDFDocument from 'pdfkit';
import { getErrorMessage } from '../utils/utils';
import models from '../models';

const { invoice, item } = models;

const { Op } = sequelize;

class InvoiceController {
  createInvoice(req, res, next) {
    const items = req.body.items;
    const discount = parseFloat(req.body.discount) || 0;
    const tax = parseFloat(req.body.tax) || 0;

    const subTotal = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    const total = (subTotal - discount) + tax;

    invoice.create({
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
      additionalInfo: req.body.additionalInfo,
      accountName: req.body.accountName,
      accountNumber: req.body.accountNumber,
      bankName: req.body.bankName,
      issueDate: req.body.issueDate,
      dueDate: req.body.dueDate,
      discount: req.body.discount,
      tax: req.body.tax,
      total: total
    }).then((createdInvoice) => {
      req.invoice = createdInvoice;
      req.items = req.body.items;

      return next();
    }).catch((error) => {
      getErrorMessage(error);
    });
  }

  draftInvoice(req, res, next) {
    const items = req.body.items;
    const discount = parseFloat(req.body.discount) || 0;
    const tax = parseFloat(req.body.tax) || 0;

    const subTotal = items.reduce((sum, item) => sum + parseFloat(item.amount), 0);

    const total = (subTotal - discount) + tax;
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
        additionalInfo: req.body.additionalInfo,
        accountName: req.body.accountName,
        accountNumber: req.body.accountNumber,
        bankName: req.body.bankName,
        issueDate: req.body.issueDate,
        dueDate: req.body.dueDate,
        discount: req.body.discount,
        tax: req.body.tax,
        total: total,
        status: "draft",
      }).then((createdInvoice) => {
        req.invoice = createdInvoice;
        req.items = req.body.items;

        return next();
      }).catch((error) => {
        getErrorMessage(error);
      });
  }

  mapInvoiceToItems(req, res) {
    const { invoice } = req;

    const newInvoiceItems = req.body.items.map(item => ({
      userId: req.user.id,
      invoiceId: invoice.id,
      itemDescription: item.itemDescription,
      quantity: item.quantity,
      price: parseFloat(item.price),
      amount: parseFloat(item.amount)
    }));

    item.bulkCreate(newInvoiceItems).then((itemRecords) => {
      res.status(201).send({
        message: 'Invoice created successfully',
        invoice: { ...invoice.dataValues, items: itemRecords },
        itemsCount: itemRecords.length,
      });
    }).catch((error) => {
      res.status(400).send({ message: error.name });
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
            name: { [Op.iLike]: `%${searchKey}%` },
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
        return Promise.all(invoices.map((inv) => {
          return item.findAll({ where: { invoiceId: inv.id } })
            .then((itemRecords) => {
              return { ...inv.dataValues, items: itemRecords };
            });
        })).then((invoicesWithItems) => {
          res.status(200).send({
            invoices: invoicesWithItems,
            count,
            limit: queryLimit,
            offset: queryOffset,
          });
        });
      }).catch((error) => {
        getErrorMessage(error);
      });
    });
  }

  getInvoiceById(req, res) {
    const id = req.params.id
    invoice.findOne({ where: { id } }).then((invoice) => {
      if (invoice) {
        item.findAll({ where: { invoiceId: id } }).then((itemRecords) => {
          res.status(200).send({
            ...invoice.dataValues, items: itemRecords,
          });
        })
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

  downloadInvoice = (req, res) => {
    invoice.findOne({ where: { id: req.params.id } })
      .then((nvc) => {
        if (nvc) {
          item.findAll({ where: { invoiceId: req.params.id } }).then((itemRecords) => {
            const doc = new PDFDocument();

            // Set response headers
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=invoice_${nvc.id}.pdf`);

            doc.pipe(res); // Pipe the PDF to the response

            doc.font('Helvetica-Bold')
              .fontSize(16)
              .fillColor('blue')
              .text(nvc.invoiceTitle, { align: 'center' });

            doc.moveDown();
            doc.font('Helvetica')
              .fontSize(12)
              .fillColor('black')
              .fontSize(14).text(`Invoice ID: ${nvc.id}`);
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
            itemRecords.forEach(item => {
              doc.text(`Item Description: ${item.itemDescription}, Quantity: ${item.quantity}, Price: ${item.price}, Amount: ${item.amount}`);
              doc.moveDown();
            });
            doc.text(`Discount: $${nvc.discount}`);
            doc.moveDown();
            doc.text(`Tax: $${nvc.tax}`);
            doc.moveDown();
            doc.text(`Total: $${nvc.total}`);
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
          })
        } else {
          res.status(404).send({
            message: 'Invoice not found',
          });
        }
      }).catch((error) => {
        console.error('Error downloading invoice:', error);
        res.status(500).send({
          message: 'Error downloading invoice',
        });
      });
  };

  updateInvoiceStatus(req, res) {
    const newInvoice = invoice.update({ status: "paid" },
      { where: { id: req.params.id }, returning: true, });
    newInvoice.then((updated) => {
      const updatedInvoice = updated[1][0];

      if (updatedInvoice) {
        return res.status(200).send({
          message: 'Invoice status updated to "paid"',
          Invoice: updatedInvoice,
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