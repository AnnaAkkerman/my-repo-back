import express from 'express';
import { JoiSchemas } from '../../validation/index.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { ctrlWrapper } from '../../utils/ctrlWrapper.js';
import { Controllers } from '../../controllers/index.js';
import { authenticate } from '../../middlewares/authenticate.js';

export const usersRouter = express.Router();

usersRouter.post(
  '/register',
  validateBody(JoiSchemas.auth.registerUserSchema),
  ctrlWrapper(Controllers.users.RegisterController),
);

usersRouter.post(
  '/login',
  validateBody(JoiSchemas.auth.loginUserSchema),
  ctrlWrapper(Controllers.users.LoginController),
);

usersRouter.post(
  '/refresh',
  authenticate,
  ctrlWrapper(Controllers.users.RefreshController),
);

usersRouter.post(
  '/logout',
  authenticate,
  ctrlWrapper(Controllers.users.LogoutController),
);

usersRouter.post(
  '/request-reset-password',
  validateBody(JoiSchemas.auth.requestResetPasswordSchema),
  ctrlWrapper(Controllers.users.RequestResetPasswordController),
);

usersRouter.post(
  '/reset-pwd',
  validateBody(JoiSchemas.auth.resetPwdSchema),
  ctrlWrapper(Controllers.users.ResetPwdController),
);

usersRouter.get(
  '/get-oauth-url',
  ctrlWrapper(Controllers.users.getGoogleAuthUrlController),
);

usersRouter.post(
  '/confirm-oauth',
  validateBody(JoiSchemas.auth.loginWithGoogleAuthSchema),
  ctrlWrapper(Controllers.users.loginWithGoogleController),
);