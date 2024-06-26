import invoiceController from "../controllers/invoice-controller";
import { invoiceConstraints } from "../middlewares/invoice-validate";
import { validateFormData, verifyAuthToken, validateToken, validParamId } from "../middlewares/validate";

export default function invoiceRoutes(app) {
  app.post('/create-invoice', verifyAuthToken, validateToken, invoiceConstraints, validateFormData, invoiceController.createInvoice, invoiceController.mapInvoiceToItems);
  app.post('/draft-invoice', verifyAuthToken, validateToken, invoiceConstraints, validateFormData, invoiceController.draftInvoice, invoiceController.mapInvoiceToItems);
  app.get('/invoices', verifyAuthToken, validateToken, invoiceController.getInvoices);
  app.get('/invoice/:id', verifyAuthToken, validateToken, validParamId, validateFormData, invoiceController.getInvoiceById);
  app.put('/edit-invoice/:id', verifyAuthToken, validateToken, validParamId, invoiceConstraints, validateFormData, invoiceController.editInvoice);
  app.delete('/delete-invoice/:id', verifyAuthToken, validateToken, validParamId, validateFormData, invoiceController.deleteInvoice);
  app.get('/download-invoice/:id', verifyAuthToken, validateToken, validParamId, validateFormData, invoiceController.downloadInvoice);
  app.patch('/update-invoice-status/:id', verifyAuthToken, validateToken, validParamId, validateFormData, invoiceController.updateInvoiceStatus);
}