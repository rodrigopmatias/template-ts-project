import {
  Router, Request, Response, Application,
} from 'express';
import { AuthController } from '@/controllers/auth';
import { controllerByName } from '@/controllers';

export default (app: Application): void => {
  const routes = Router();
  const authController: AuthController = controllerByName('authController');

  routes
    .post('/register', (req: Request, res: Response): Promise<Response> => authController.register(req, res))
    .post('/token', (req: Request, res: Response): Promise<Response> => authController.token(req, res));

  app.use('/auth', routes);
};
