import { ResourceType } from './view.interface';
import { ViewRepository } from './view.repository';
import { config } from '../config';
export class ViewManager {

    static async addView(resource: string, resourceType: ResourceType, user: string): Promise<void> {
        const view = await ViewRepository.getOne(resource, user);

        if (view) {
            const now = Date.now();
            const diff = Math.abs(now - view.lastViewDate.getTime());
            const minutesDiff = Math.floor((diff / 1000) / 60);

            if (minutesDiff >= config.viewDebounceDuration) {
                await ViewRepository.increaseViewAmount(resource, user);
            }
        } else {
            await ViewRepository.create(resource, resourceType, user);
        }
    }

    static getViewsForResource(resource: string | string[]): Promise<number> {
        const resources = typeof resource === 'string' ? [resource] : resource;
        return ViewRepository.getAmount({ resource: { $in: resources } });

    }

    static async getViewedResourcesForUserByType(user: string, resourceType: ResourceType): Promise<string[]> {
        const views = await ViewRepository.getMany({ user, resourceType });

        if (views) {
            return views.map(view => view.resource);
        }

        return [];
    }
}
