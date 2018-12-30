import { IView } from './view.interface';
import { ViewRepository } from './view.repository';
export class ViewManager {

        static create(view: IView) {
        return ViewRepository.create(view);
    }

    static createMany(views: IView[]) {
        return ViewRepository.createMany(views);
    }

    static updateById(id: string, view: Partial<IView>) {
        return ViewRepository.updateById(id, view);
    }

    static updateMany(viewFilter: Partial<IView>, view: Partial<IView>) {
        return ViewRepository.updateMany(viewFilter, view);
    }

    static deleteById(id: string) {
        return ViewRepository.deleteById(id);
    }

    static getById(id: string) {
        return ViewRepository.getById(id);
    }

    static getOne(viewFilter: Partial<IView>) {
        return ViewRepository.getOne(viewFilter);
    }

    static getMany(viewFilter: Partial<IView>) {
        return ViewRepository.getMany(viewFilter);
    }

    static getAmount(viewFilter: Partial<IView>) {
        return ViewRepository.getAmount(viewFilter);
    }
    }
