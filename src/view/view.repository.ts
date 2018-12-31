import { IView, ResourceType } from './view.interface';
import { ViewModel } from './view.model';

export class ViewRepository {

    static create(resource: string, resourceType: ResourceType, user: string): Promise<IView> {
        return ViewModel.create({ resource, resourceType, user });
    }

    static increaseViewAmount(resource: string, user: string): Promise<void> {

        return ViewModel.updateOne(
            { resource, user },
            { $inc: { amount: 1 } },
            { runValidators: true },
        ).exec();
    }

    static getOne(resource: string, user: string): Promise<IView | null> {
        return ViewModel.findOne({
            resource,
            user,
        }).exec();
    }

    static getMany(viewFilter: Partial<IView>): Promise<IView[]> {
        return ViewModel.find(viewFilter).exec();
    }

    static getAmount(viewFilter: { [key in keyof IView]?: any }): Promise<number> {
        return ViewModel
            .countDocuments(viewFilter)
            .exec();
    }
}
