import { Request, Response } from 'express';
import { ViewManager } from './view.manager';
import { ViewNotFoundError } from '../utils/errors/userErrors';
import { UpdateWriteOpResult } from 'mongodb';

type UpdateResponse = UpdateWriteOpResult['result'];
export class ViewController {
    static async create(req: Request, res: Response) {
        res.json(await ViewManager.create(req.body));
    }

    static async createMany(req: Request, res: Response) {
        res.json(await ViewManager.createMany(req.body));
    }

    static async updateById(req: Request, res: Response) {
        const updated = await ViewManager.updateById(req.params.id, req.body.view);
        if (!updated) {
            throw new ViewNotFoundError();
        }

        res.json(updated);
    }

    static async updateMany(req: Request, res: Response) {

        const updated: UpdateResponse = await ViewManager.updateMany(req.query, req.body);

        if (updated.n === 0) {
            throw new ViewNotFoundError();
        }

        res.json(updated);
    }

    static async deleteById(req: Request, res: Response) {
        const deleted = await ViewManager.deleteById(req.params.id);
        if (!deleted) {
            throw new ViewNotFoundError();
        }

        res.json(deleted);
    }

    static async getById(req: Request, res: Response) {
        const view = await ViewManager.getById(req.params.id);
        if (!view) {
            throw new ViewNotFoundError();
        }

        res.json(view);
    }

    static async getOne(req: Request, res: Response) {
        const view = await ViewManager.getOne(req.query);
        if (!view) {
            throw new ViewNotFoundError();
        }

        res.json(view);
    }

    static async getMany(req: Request, res: Response) {
        res.json(await ViewManager.getMany(req.query));
    }

    static async getAmount(req: Request, res: Response) {
        res.json(await ViewManager.getAmount(req.query));
    }
}
