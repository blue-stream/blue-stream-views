import { expect } from 'chai';
import { ViewValidator } from './view.validator';
import { ValidRequestMocks, responseMock } from './view.mocks';
import { PropertyInvalidError, IdInvalidError } from '../../utils/errors/userErrors';

describe('View Validator Middleware', function () {
    describe('Create Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ViewValidator.canCreate(new ValidRequestMocks().create, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an PropertyInvalidError When property is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.property = undefined;

                ViewValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.property = null;

                ViewValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().create;
                invalidRequestMock.body.property = '122223344214142';

                ViewValidator.canCreate(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });
        });
    });

    
    describe('CreateMany Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ViewValidator.canCreateMany(new ValidRequestMocks().createMany, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an PropertyInvalidError When property is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().createMany;
                invalidRequestMock.body[1].property = undefined;

                ViewValidator.canCreateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().createMany;
                invalidRequestMock.body[1].property = null;

                ViewValidator.canCreateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().createMany;
                invalidRequestMock.body[1].property = '21412412421412414214';

                ViewValidator.canCreateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });
        });
    });

    describe('UpdateById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ViewValidator.canUpdateById(new ValidRequestMocks().updateById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an PropertyInvalidError When property is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.property = undefined;

                ViewValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.property = null;

                ViewValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.body.property = '2142142142141241';

                ViewValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = undefined;

                ViewValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = null;

                ViewValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().updateById;
                invalidRequestMock.params.id = '1244';

                ViewValidator.canUpdateById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('canUpdateMany Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ViewValidator.canUpdateMany(new ValidRequestMocks().updateMany, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an PropertyInvalidError When property is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().updateMany;
                invalidRequestMock.body.property = undefined;

                ViewValidator.canUpdateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is null', function () {
                const invalidRequestMock = new ValidRequestMocks().updateMany;
                invalidRequestMock.body.property = null;

                ViewValidator.canUpdateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });

            it('Should throw an PropertyInvalidError When property is too long', function () {
                const invalidRequestMock = new ValidRequestMocks().updateMany;
                invalidRequestMock.body.property = '21414141412414124';

                ViewValidator.canUpdateMany(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(PropertyInvalidError);
                });
            });
        });
    });

    describe('canDeleteById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ViewValidator.canDeleteById(new ValidRequestMocks().deleteById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = undefined;

                ViewValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = undefined;

                ViewValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().deleteById;
                invalidRequestMock.params.id = '1243';

                ViewValidator.canDeleteById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('canGetById Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ViewValidator.canGetById(new ValidRequestMocks().getById, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });

        context('When invalid arguments are passed', function () {
            it('Should throw an IdInvalidError When id is undefined', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = undefined;

                ViewValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is null', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = null;

                ViewValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });

            it('Should throw an IdInvalidError When id is not a valid ObjectID', function () {
                const invalidRequestMock = new ValidRequestMocks().getById;
                invalidRequestMock.params.id = '1234';

                ViewValidator.canGetById(invalidRequestMock, responseMock, (error: Error) => {
                    expect(error).to.exist;
                    expect(error).to.be.an.instanceof(IdInvalidError);
                });
            });
        });
    });

    describe('canGetOne Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ViewValidator.canGetOne(new ValidRequestMocks().getOne, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });

    describe('canGetMany Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ViewValidator.canGetMany(new ValidRequestMocks().getMany, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });

    describe('canGetAmount Validator', function () {
        context('When valid arguments are passed', function () {
            it('Should not throw an error', function () {
                ViewValidator.canGetAmount(new ValidRequestMocks().getAmount, responseMock, (error: Error) => {
                    expect(error).to.not.exist;
                });
            });
        });
    });
    });
