import { Router } from 'express';
import { ViewValidator } from './validator/view.validator';
import { ViewController } from './view.contoller';
import { Wrapper } from '../utils/wrapper';

const ViewRouter: Router = Router();

ViewRouter.post('/', ViewValidator.canCreate, Wrapper.wrapAsync(ViewController.create));

ViewRouter.post('/many', ViewValidator.canCreateMany, Wrapper.wrapAsync(ViewController.createMany));
ViewRouter.put('/many', ViewValidator.canUpdateMany, Wrapper.wrapAsync(ViewController.updateMany));
ViewRouter.put('/:id', ViewValidator.canUpdateById, Wrapper.wrapAsync(ViewController.updateById));
ViewRouter.delete('/:id', ViewValidator.canDeleteById, Wrapper.wrapAsync(ViewController.deleteById));
ViewRouter.get('/one', ViewValidator.canGetOne, Wrapper.wrapAsync(ViewController.getOne));
ViewRouter.get('/many', ViewValidator.canGetMany, Wrapper.wrapAsync(ViewController.getMany));
ViewRouter.get('/amount', ViewValidator.canGetAmount, Wrapper.wrapAsync(ViewController.getAmount));
ViewRouter.get('/:id', ViewValidator.canGetById, Wrapper.wrapAsync(ViewController.getById));

export { ViewRouter };
