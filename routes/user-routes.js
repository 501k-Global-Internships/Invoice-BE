import userController from "../controllers/user-controller";
import { signUpConstraints, signInConstraints } from "../middlewares/user-validate";
import { validateFormData } from "../middlewares/validate";

export default function userRoutes(app) {
  app.post('/sign-up', signUpConstraints, validateFormData, userController.signUp);
  app.post('/sign-in', signInConstraints, validateFormData, userController.signIn);
}