import { Request, Response, NextFunction } from 'express';
import { ViewValidations } from './view.validations';
import { PropertyInvalidError, IdInvalidError } from '../../utils/errors/userErrors';
import { IView } from '../view.interface';

export class ViewValidator {

    static canCreate(req: Request, res: Response, next: NextFunction) {
        next(ViewValidator.validateProperty(req.body.property));
    }

        static canCreateMany(req: Request, res: Response, next: NextFunction) {
        const propertiesValidations: (Error | undefined)[] = req.body.map((view: IView) => {
            return ViewValidator.validateProperty(view.property);
        });

        next(ViewValidator.getNextValueFromArray(propertiesValidations));
    }

    static canUpdateById(req: Request, res: Response, next: NextFunction) {
        next(
            ViewValidator.validateId(req.params.id) ||
            ViewValidator.validateProperty(req.body.property));
    }

    static canUpdateMany(req: Request, res: Response, next: NextFunction) {
        next(ViewValidator.validateProperty(req.query.property) ||
            ViewValidator.validateProperty(req.body.property));
    }

    static canDeleteById(req: Request, res: Response, next: NextFunction) {
        next(ViewValidator.validateId(req.params.id));
    }

    static canGetById(req: Request, res: Response, next: NextFunction) {
        next(ViewValidator.validateId(req.params.id));
    }

    static canGetOne(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetMany(req: Request, res: Response, next: NextFunction) {
        next();
    }

    static canGetAmount(req: Request, res: Response, next: NextFunction) {
        next();
    }

    private static validateId(id: string) {
        if (!ViewValidations.isIdValid(id)) {
            return new IdInvalidError();
        }

        return undefined;
    }

    private static getNextValueFromArray(validationsArray: (Error | undefined)[]) {
        let nextValue: Error | undefined;

        for (let index = 0; index < validationsArray.length; index++) {
            if (validationsArray[index] !== undefined) {
                nextValue = validationsArray[index];
            }
        }

        return nextValue;
    }

    private static validateProperty(property: string) {
        if (!ViewValidations.isPropertyValid(property)) {
            return new PropertyInvalidError();
        }

        return undefined;
    }
}
