import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { config } from '../config';
import { ServerError } from '../utils/errors/applicationError';
import { IView } from './view.interface';
import { ViewRepository } from './view.repository';

const validId: string = new mongoose.Types.ObjectId().toHexString();
const invalidId: string = 'invalid id';
const view: IView = {
    property: 'prop',
};
const viewArr: IView[] = ['prop', 'prop', 'prop', 'b', 'c', 'd'].map(item => ({ property: item }));
const invalidView: any = {
    property: { invalid: true },
};
const viewFilter: Partial<IView> = { property: 'prop' };
const viewDataToUpdate: Partial<IView> = { property: 'updated' };
const unexistingView: Partial<IView> = { property: 'unexisting' };
const unknownProperty: Object = { unknownProperty: true };

describe('View Repository', function () {
    before(async function () {
        await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
    });

    afterEach(async function () {
        await mongoose.connection.dropDatabase();
    });

    after(async function () {
        await mongoose.connection.close();
    });

    describe('#create()', function () {
        context('When view is valid', function () {
            it('Should create view', async function () {
                const createdView = await ViewRepository.create(view);
                expect(createdView).to.exist;
                expect(createdView).to.have.property('property', 'prop');
                expect(createdView).to.have.property('createdAt');
                expect(createdView).to.have.property('updatedAt');
                expect(createdView).to.have.property('_id').which.satisfies((id: any) => {
                    return mongoose.Types.ObjectId.isValid(id);
                });
            });
        });

        context('When view is invalid', function () {
            it('Should throw validation error when incorrect property type', async function () {
                let hasThrown = false;

                try {
                    await ViewRepository.create(invalidView);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/cast.+failed/i);
                    expect(err).to.have.property('errors');
                    expect(err.errors).to.have.property('property');
                    expect(err.errors.property).to.have.property('name', 'CastError');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should throw validation error when empty view passed', async function () {
                let hasThrown = false;

                try {
                    await ViewRepository.create({} as IView);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown);
                }
            });
        });
    });

    describe('#createMany()', function () {
        context('When data is valid', function () {
            it('Should create many documents', async function () {
                const createdDocuments = await ViewRepository.createMany(viewArr);

                expect(createdDocuments).to.exist;
                expect(createdDocuments).to.be.an('array');
                expect(createdDocuments).to.have.lengthOf(viewArr.length);
            });

            it('Should not create documents when empty array passed', async function () {
                const docs = await ViewRepository.createMany([]);

                expect(docs).to.exist;
                expect(docs).to.be.an('array');
                expect(docs).to.be.empty;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when 1 of the docs invalid', async function () {
                let hasThrown = false;
                const docs: IView[] = [
                    ...viewArr,
                    {} as IView,
                ];

                try {
                    await ViewRepository.createMany(docs);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#updateById()', function () {

        let createdView: IView;

        beforeEach(async function () {
            createdView = await ViewRepository.create(view);
            expect(createdView).have.property('id');
        });

        context('When data is valid', function () {

            it('Should update an existsing view', async function () {
                const updatedDoc = await ViewRepository.updateById(createdView.id!, viewDataToUpdate);
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdView.id);
                for (const prop in viewDataToUpdate) {
                    expect(updatedDoc).to.have.property(prop, viewDataToUpdate[prop as keyof IView]);
                }
            });

            it('Should not update an existing view when empty data provided', async function () {
                const updatedDoc = await ViewRepository.updateById(createdView.id!, {});
                expect(updatedDoc).to.exist;
                expect(updatedDoc).to.have.property('id', createdView.id);

                for (const prop in view) {
                    expect(updatedDoc).to.have.property(prop, createdView[prop as keyof IView]);
                }
            });

            it('Should return null when updated doc does does not exist', async function () {
                const updatedDoc = await ViewRepository.updateById(new mongoose.Types.ObjectId().toHexString(), {});
                expect(updatedDoc).to.not.exist;
            });
        });

        context('When data is not valid', function () {
            it('Should throw error when updated doc is not valid', async function () {
                let hasThrown = false;

                try {
                    await ViewRepository.updateById(createdView.id as string, { property: null } as any);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ValidationError');
                    expect(err).to.have.property('message').that.matches(/path.+required/i);
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#updateMany()', function () {

        beforeEach(async function () {
            await ViewRepository.createMany(viewArr);
        });

        context('When data is valid', function () {

            it('Should update many documents', async function () {
                const updated = await ViewRepository.updateMany(viewFilter, viewDataToUpdate);

                const amountOfRequiredUpdates = viewArr.filter((item: IView) => {
                    let match = true;
                    for (const prop in viewFilter) {
                        match = match && item[prop as keyof IView] === viewFilter[prop as keyof IView];
                    }

                    return match;
                }).length;

                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', amountOfRequiredUpdates);

                const documents = await ViewRepository.getMany(viewDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(amountOfRequiredUpdates);
            });

            it('Should update all documents when no filter passed', async function () {
                const updated = await ViewRepository.updateMany({}, viewDataToUpdate);
                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', viewArr.length);

                const documents = await ViewRepository.getMany(viewDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(viewArr.length);
            });

            it('Should do nothing when criteria does not match any document', async function () {
                const updated = await ViewRepository.updateMany(unexistingView, viewDataToUpdate);
                expect(updated).to.exist;
                expect(updated).to.have.property('nModified', 0);

                const documents = await ViewRepository.getMany(viewDataToUpdate);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });

        });

        context('When data is invalid', function () {

            it('Should throw error when empty data provided', async function () {
                let hasThrown = false;

                try {
                    await ViewRepository.updateMany(viewFilter, {});
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err instanceof ServerError).to.be.true;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should not update documents when invalid data passed', async function () {
                await ViewRepository.updateMany({}, unknownProperty);

                const documents = await ViewRepository.getMany({});
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.satisfy((documents: IView[]) => {
                    documents.forEach((doc: IView) => {
                        for (const prop in unknownProperty) {
                            expect(doc).to.not.have.property(prop);
                        }
                    });

                    return true;
                });
            });
        });
    });

    describe('#deleteById()', function () {

        let document: IView;

        beforeEach(async function () {
            document = await ViewRepository.create(view);
        });

        context('When data is valid', function () {

            it('Should delete document by id', async function () {
                const deleted = await ViewRepository.deleteById(document.id!);
                expect(deleted).to.exist;
                expect(deleted).to.have.property('id', document.id);

                const doc = await ViewRepository.getById(document.id!);
                expect(doc).to.not.exist;
            });

            it('Should return null when document does not exist', async function () {
                const deleted = await ViewRepository.deleteById(new mongoose.Types.ObjectId().toHexString());
                expect(deleted).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when id is not in the correct format', async function () {
                let hasThrown = false;

                try {
                    await ViewRepository.deleteById('invalid id');
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'CastError');
                    expect(err).to.have.property('kind', 'ObjectId');
                    expect(err).to.have.property('path', '_id');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#getById()', function () {

        context('When data is valid', function () {

            let document: IView;
            beforeEach(async function () {
                document = await ViewRepository.create(view);
            });

            it('Should return document by id', async function () {
                const doc = await ViewRepository.getById(document.id!);
                expect(doc).to.exist;
                expect(doc).to.have.property('id', document.id);
                for (const prop in view) {
                    expect(doc).to.have.property(prop, view[prop as keyof IView]);
                }
            });

            it('Should return null when document does not exist', async function () {
                const doc = await ViewRepository.getById(validId);
                expect(doc).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when id is not in correct format', async function () {
                let hasThrown = false;

                try {
                    await ViewRepository.getById(invalidId);
                } catch (err) {
                    hasThrown = true;

                    expect(err).to.exist;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });
        });
    });

    describe('#getOne()', function () {

        context('When data is valid', function () {
            let document: IView;

            beforeEach(async function () {
                document = await ViewRepository.create(view);
            });

            it('Should return document by id', async function () {
                const doc = await ViewRepository.getOne({ _id: document.id } as Partial<IView>);
                expect(doc).to.exist;
                for (const prop in view) {
                    expect(doc).to.have.property(prop, view[prop as keyof IView]);
                }
            });

            it('Should return document by property', async function () {
                const doc = await ViewRepository.getOne(viewFilter);
                expect(doc).to.exist;
                expect(doc).to.have.property('id', document.id);
                for (const prop in view) {
                    expect(doc).to.have.property(prop, view[prop as keyof IView]);
                }
            });

            it('Should return null when document does not exist', async function () {
                const doc = await ViewRepository.getOne(unexistingView);
                expect(doc).to.not.exist;
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when filter does not exist', async function () {
                let hasThrown = false;

                try {
                    await ViewRepository.getOne({});
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err instanceof ServerError).to.be.true;
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should return null when filter is not in the correct format', async function () {
                const doc = await ViewRepository.getOne(unknownProperty);
                expect(doc).to.not.exist;
            });
        });
    });

    describe('#getMany()', function () {

        context('When data is valid', function () {

            beforeEach(async function () {
                await ViewRepository.createMany(viewArr);
            });

            it('Should return all documents when filter is empty', async function () {
                const documents = await ViewRepository.getMany({});
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(viewArr.length);
            });

            it('Should return only matching documents', async function () {
                const documents = await ViewRepository.getMany(viewFilter);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');

                const amountOfRequiredDocuments = viewArr.filter((item: IView) => {
                    let match = true;
                    for (const prop in viewFilter) {
                        match = match && item[prop as keyof IView] === viewFilter[prop as keyof IView];
                    }

                    return match;
                }).length;

                expect(documents).to.have.lengthOf(amountOfRequiredDocuments);
            });

            it('Should return empty array when critiria not matching any document', async function () {
                const documents = await ViewRepository.getMany(unexistingView);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });

        context('When data is invalid', function () {
            it('Should throw error when filter is not an object', async function () {
                let hasThrown = false;

                try {
                    await ViewRepository.getMany(0 as any);
                } catch (err) {
                    hasThrown = true;
                    expect(err).to.exist;
                    expect(err).to.have.property('name', 'ObjectParameterError');
                } finally {
                    expect(hasThrown).to.be.true;
                }
            });

            it('Should return empty array when filter is not in correct format', async function () {
                const documents = await ViewRepository.getMany(unknownProperty);
                expect(documents).to.exist;
                expect(documents).to.be.an('array');
                expect(documents).to.have.lengthOf(0);
            });
        });
    });

    describe('#getAmount()', function () {

        context('When data is valid', function () {

            beforeEach(async function () {
                await ViewRepository.createMany(viewArr);
            });

            it('Should return amount of all documents when no filter provided', async function () {
                const amount = await ViewRepository.getAmount({});
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(viewArr.length);
            });

            it('Should return amount of filtered documents', async function () {
                const amount = await ViewRepository.getAmount(viewFilter);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');

                const amountOfRequiredDocuments = viewArr.filter((item: IView) => {
                    let match = true;
                    for (const prop in viewFilter) {
                        match = match && item[prop as keyof IView] === viewFilter[prop as keyof IView];
                    }

                    return match;
                }).length;

                expect(amount).to.equal(amountOfRequiredDocuments);
            });

            it('Should return 0 when no documents matching filter', async function () {
                const amount = await ViewRepository.getAmount(unexistingView);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(0);
            });
        });

        context('When data is invalid', function () {
            it('Should return 0 when filter is not in the correct format', async function () {
                const amount = await ViewRepository.getAmount(unknownProperty);
                expect(amount).to.exist;
                expect(amount).to.be.a('number');
                expect(amount).to.equal(0);
            });
        });
    });

});
