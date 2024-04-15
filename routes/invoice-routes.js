import invoiceController from "../controllers/invoice-controller";
import { invoiceConstraints } from "../middlewares/invoice-validate";
import { validateFormData, verifyAuthToken, validateToken, validParamId } from "../middlewares/validate";

export default function invoiceRoutes(app) {
  app.post('/create-invoice', verifyAuthToken, validateToken, invoiceConstraints, validateFormData, invoiceController.createInvoice);
  app.post('/draft-invoice', verifyAuthToken, validateToken, invoiceConstraints, validateFormData, invoiceController.draftInvoice);
  app.get('/invoices', verifyAuthToken, validateToken, invoiceController.getInvoices);
  app.put('/edit-invoice/:id', verifyAuthToken, validateToken, validParamId, invoiceConstraints, validateFormData, invoiceController.editInvoice);
  app.delete('/delete-invoice/:id', verifyAuthToken, validateToken, validParamId, validateFormData, invoiceController.deleteInvoice);
  app.get('/download-invoice/:id', verifyAuthToken, validateToken, validParamId, validateFormData, invoiceController.downloadInvoice);
  app.patch('/update-invoice-status/:id', verifyAuthToken, validateToken, validParamId, validateFormData, invoiceController.updateInvoiceStatus);
}