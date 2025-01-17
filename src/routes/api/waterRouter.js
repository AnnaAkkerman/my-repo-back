import express from 'express';
import { JoiSchemas } from '../../validation/index.js';
import { validateBody } from '../../middlewares/validateBody.js';
import { ctrlWrapper } from '../../utils/ctrlWrapper.js';
import { Controllers } from '../../controllers/index.js';
import { authenticate } from '../../middlewares/authenticate.js';
import multer from 'multer';

export const waterRouter = express.Router();
const upload = multer();

waterRouter.use(authenticate);

waterRouter.post(
  '/',
  upload.none(),
  // validateBody(JoiSchemas.water.addWaterSchema),
  ctrlWrapper(Controllers.water.addWaterVolumeController),
);

waterRouter.patch(
  '/:id',
  validateBody(JoiSchemas.water.editWaterSchema),
  ctrlWrapper(Controllers.water.editWaterVolumeController),
);

waterRouter.delete(
  '/:id',
  ctrlWrapper(Controllers.water.deleteWaterVolumeController),
);

waterRouter.get(
  '/daily',
  // validateBody(JoiSchemas.water.getDailyWaterSchema),
  ctrlWrapper(Controllers.water.getDailyWaterVolumeController),
);

waterRouter.get(
  '/monthly',
  // validateBody(JoiSchemas.water.getMonthlyWaterSchema),
  ctrlWrapper(Controllers.water.getMonthlyWaterVolumeController),
);
