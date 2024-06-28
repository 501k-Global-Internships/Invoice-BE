import userController from "../controllers/user-controller";
import {
  signUpConstraints, signInConstraints,
  authSignInConstraints, changePasswordConstraints,
  resetPasswordEmail, resetPassword
} from "../middlewares/user-validate";
import { validateFormData, verifyAuthToken, validateToken } from "../middlewares/validate";

export default function userRoutes(app) {
  app.post('/sign-up', signUpConstraints, validateFormData, userController.signUp);
  app.post('/sign-in', signInConstraints, validateFormData, userController.signIn);
  app.post('/auth-sign-in', authSignInConstraints, validateFormData, userController.authSignIn);
  app.put('/change-password', verifyAuthToken, validateToken, changePasswordConstraints, validateFormData, userController.changePassword);
  app.patch('/reset-password-email', resetPasswordEmail, validateFormData, userController.sendRecoveryPasswordId, userController.resetPasswordEmail);
  app.put('/reset-password', resetPassword, validateFormData, userController.resetPassword);
}