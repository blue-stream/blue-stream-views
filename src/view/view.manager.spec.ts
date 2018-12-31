import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { IView, ResourceType } from './view.interface';
import { ViewManager } from './view.manager';
import { ViewModel } from './view.model';
import { ViewRepository } from './view.repository';

const view = {
    resource: 'abc',
    resourceType: ResourceType.VIDEO,
    user: 'user@domain',
};

const views: Partial<IView>[] = [
    {
        resource: '1',
        resourceType: ResourceType.VIDEO,
        user: '1@1',
    },
    {
        resource: '1',
        resourceType: ResourceType.VIDEO,
        user: '2@2',
    },
    {
        resource: 'abc',
        resourceType: ResourceType.CHANNEL,
        user: '1@1',
    },
    {
        resource: 'abc',
        resourceType: ResourceType.VIDEO,
        user: '2@2',
    },
];

describe('View Manager', function () {
    before(async function () {
        mongoose.set('useCreateIndex', true);
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });

    });

    afterEach(async function () {
        await ViewModel.deleteMany({}).exec();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('#addView', function () {
        context('When data is valid', function () {
            it('Should add new view to db', async function () {
                let _view;

                _view = await ViewRepository.getOne(view.resource, view.user);
                expect(_view).to.not.exist;

                await ViewManager.addView(view.resource, view.resourceType, view.user);

                _view = await ViewRepository.getOne(view.resource, view.user);
                expect(_view).to.exist;
                expect(_view).to.have.property('user', view.user);
                expect(_view).to.have.property('resource', view.resource);
                expect(_view).to.have.property('resourceType', view.resourceType);
                expect(_view).to.have.property('lastViewDate');
            });

            it('Should not change view\'s amount if `viewDebounceDuration` did not pass', async function () {

                // Create the view
                await ViewManager.addView(view.resource, view.resourceType, view.user);

                // Try to increase amount
                await ViewManager.addView(view.resource, view.resourceType, view.user);

                const _view = await ViewRepository.getOne(view.resource, view.user);
                expect(_view).to.exist;
                expect(_view).to.have.property('amount', 1);
            });

            it('Should change view\'s amount if `viewDebounceDuration` passed', async function () {

                // Create the view
                await ViewManager.addView(view.resource, view.resourceType, view.user);

                const originalDateNow = Date.now;

                // Mock Date.now() function to return time + `viewDebounceDuration`
                Date.now = () => {
                    return originalDateNow() + config.viewDebounceDuration * 60 * 1000;
                };

                const viewPromises = [];
                for (let i = 0; i < 10; i++) {
                    viewPromises.push(ViewManager.addView(view.resource, view.resourceType, view.user));
                }

                await Promise.all(viewPromises);

                const _view = await ViewRepository.getOne(view.resource, view.user);
                expect(_view).to.exist;
                expect(_view).to.have.property('amount', viewPromises.length + 1);

                Date.now = originalDateNow;
            });
        });
    });

    describe('#getViewsForResource', function () {
        beforeEach(async function () {
            await Promise.all(views.map(v => ViewRepository.create(v.resource!, v.resourceType!, v.user!)));
        });

        it('Should return amount of views for resource', async function () {
            const amount = await ViewManager.getViewsForResource(view.resource);

            expect(amount).to.be.a('number');
            expect(amount).to.equal(views.filter(v => v.resource === view.resource).length);
        });

        it('Should return 0 when no resource found', async function () {
            const amount = await ViewManager.getViewsForResource('test');

            expect(amount).to.be.a('number');
            expect(amount).to.equal(0);
        });

        it('Should return 0 when empty filter provided', async function () {
            const amount = await ViewManager.getViewsForResource([]);

            expect(amount).to.be.a('number');
            expect(amount).to.equal(0);
        });

        it('Should return amount of views for multiple resources', async function () {
            const amount = await ViewManager.getViewsForResource(['1', 'abc']);

            expect(amount).to.be.a('number');
            expect(amount).to.equal(views.filter(v => v.resource === '1' || v.resource === 'abc').length);
        });
    });

    describe('#getViewedResourcesForUserByType', function () {
        beforeEach(async function () {
            await Promise.all(views.map(v => ViewRepository.create(v.resource!, v.resourceType!, v.user!)));
        });

        it('Should return resources by type that the user has viewed', async function () {
            const _views = await ViewManager.getViewedResourcesForUserByType('1@1', ResourceType.VIDEO);
            expect(_views).to.exist;
            expect(_views).to.be.an('array');

            const existingViews = views.filter(v => v.user === '1@1' && v.resourceType === ResourceType.VIDEO);

            expect(_views).to.have.lengthOf(existingViews.length);
            expect(_views).to.have.members(existingViews.map(v => v.resource));
        });

        it('Should return empty array if user don\'nt have any views', async function () {
            const views = await ViewManager.getViewedResourcesForUserByType('13@13', ResourceType.VIDEO);
            expect(views).to.exist;
            expect(views).to.be.an('array');
            expect(views).to.have.lengthOf(0);
        });

        it('Should return empty array when user don\'t have any views for specific resource type', async function () {
            const views = await ViewManager.getViewedResourcesForUserByType('2@2', ResourceType.CHANNEL);
            expect(views).to.exist;
            expect(views).to.be.an('array');
            expect(views).to.have.lengthOf(0);
        });
    });
});
