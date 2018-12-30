import { IView } from './view.interface';
import { ViewModel } from './view.model';
import { ServerError } from '../utils/errors/applicationError';

export class ViewRepository {
    static create(view: IView)
        : Promise<IView> {
        return ViewModel.create(view);
    }

    static createMany(views: IView[])
        : Promise<IView[]> {
        return ViewModel.insertMany(views);
    }

    static updateById(id: string, view: Partial<IView>)
        : Promise<IView | null> {
        return ViewModel.findByIdAndUpdate(
            id,
            { $set: view },
            { new: true, runValidators: true },
        ).exec();
    }

    static updateMany(viewFilter: Partial<IView>, view: Partial<IView>)
        : Promise<any> {

        if (Object.keys(view).length === 0) {
            throw new ServerError('Update data is required.');
        }

        return ViewModel.updateMany(
            viewFilter,
            { $set: view },
        ).exec();
    }

    static deleteById(id: string)
        : Promise<IView | null> {
        return ViewModel.findByIdAndRemove(
            id,
        ).exec();
    }

    static getById(id: string)
        : Promise<IView | null> {
        return ViewModel.findById(
            id,
        ).exec();
    }

    static getOne(viewFilter: Partial<IView>)
        : Promise<IView | null> {
        if (Object.keys(viewFilter).length === 0) {
            throw new ServerError('Filter is required.');
        }
        return ViewModel.findOne(
            viewFilter,
        ).exec();
    }

    static getMany(viewFilter: Partial<IView>)
        : Promise<IView[]> {
        return ViewModel.find(
            viewFilter,
        ).exec();
    }

    static getAmount(viewFilter: Partial<IView>)
        : Promise<number> {
        return ViewModel
            .countDocuments(viewFilter)
            .exec();
    }
}
