import { Router } from 'express';
import { ViewRouter } from './view/view.router';

const AppRouter: Router = Router();

AppRouter.use('/api/view', ViewRouter);

export { AppRouter };
