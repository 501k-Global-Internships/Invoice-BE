import userRoutes from "./user-routes";
import invoiceRoutes from "./invoice-routes";

export default function routes(app) {
  userRoutes(app);
  invoiceRoutes(app);
}