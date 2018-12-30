import * as request from 'supertest';
import { expect } from 'chai';
import * as mongoose from 'mongoose';
import { IView } from './view.interface';
import { Server } from '../server';
import { PropertyInvalidError, IdInvalidError, ViewNotFoundError } from '../utils/errors/userErrors';
import { config } from '../config';
import { ViewManager } from './view.manager';
import { sign } from 'jsonwebtoken';

describe('View Router Module', function () {
    let server: Server;
    const validProppertyString: string = '12345';
    const view: IView = {
        property: validProppertyString,
    };
    const authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;
    const invalidId: string = '1';
    const invalidProppertyString: string = '123456789123456789';
    const invalidView: IView = {
        property: invalidProppertyString,
    };
    
    const view2: IView = {
        property: '45678',
    };
    const view3: IView = {
        property: '6789',
    };

    const unexistingView: IView = {
        property: 'a',
    };

    const views: IView[] =
        [view, view2, view3, view3];

    const invalidViews: IView[] =
        [view, invalidView, view3];

    before(async function () {
                await mongoose.connect(`mongodb://${config.db.host}:${config.db.port}/${config.db.name}`, { useNewUrlParser: true });
        server = Server.bootstrap();
    });

        after(async function () {
        await mongoose.connection.db.dropDatabase();
    });
    describe('#POST /api/view/', function () {
        context('When request is valid', function () {
                        beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return created view', function (done: MochaDone) {
                request(server.app)
                    .post('/api/view/')
                    .send(view)
                                        .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', validProppertyString);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
                        beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });
            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .post('/api/view/')
                    .send(invalidView)
                                        .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });
        describe('#POST /api/view/many/', function () {
        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });

            it('Should return created view', function (done: MochaDone) {
                request(server.app)
                    .post('/api/view/many/')
                    .send(views)
                                        .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[1]).to.have.property('property', views[1].property);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .post('/api/view/many/')
                    .send(invalidViews)
                                        .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#PUT /api/view/many', function () {
        let returnedViews: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedViews = await ViewManager.createMany(views);
            });

            it('Should return updated view', function (done: MochaDone) {
                request(server.app)
                    .put('/api/view/many')
                    .query(view)
                    .send(view2)
                                        .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('ok', 1);
                        expect(res.body).to.have.property('nModified', 1);

                        done();
                    });
            });

            it('Should return 404 error status code', function (done: MochaDone) {
                request(server.app)
                    .put('/api/view/many')
                    .query(unexistingView)
                    .send(view)
                                        .set({ authorization: authorizationHeader })
                    .expect(404)
                    .end((error: Error, res: request.Response) => {
                        expect(res).to.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ViewNotFoundError.name);
                        expect(res.body).to.have.property('message', new ViewNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedViews = await ViewManager.createMany(views);
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .put('/api/view/many')
                    .query(view2)
                    .send(invalidView)
                                        .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#PUT /api/view/:id', function () {
        let returnedView: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedView = await ViewManager.create(view);
            });

            it('Should return updated view', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/view/${returnedView.id}`)
                    .send(view)
                                        .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', view.property);

                        done();
                    });
            });

            it('Should return error status when id is not found', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/view/${new mongoose.Types.ObjectId()}`)
                    .send(view)
                                        .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ViewNotFoundError.name);
                        expect(res.body).to.have.property('message', new ViewNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedView = await ViewManager.create(view);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .put('/api/view/2')
                    .send(view)
                                        .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });

            it('Should return error status when property is invalid', function (done: MochaDone) {
                request(server.app)
                    .put(`/api/view/${returnedView.id}`)
                    .send(invalidView)
                                        .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', PropertyInvalidError.name);
                        expect(res.body).to.have.property('message', new PropertyInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#DELETE /api/view/:id', function () {
        let returnedView: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedView = await ViewManager.create(view);
            });

            it('Should return updated view', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/view/${returnedView.id}`)
                                        .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', view.property);

                        done();
                    });
            });

            it('Should return error status when id not found', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/view/${new mongoose.Types.ObjectId()}`)
                                        .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ViewNotFoundError.name);
                        expect(res.body).to.have.property('message', new ViewNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedView = await ViewManager.create(view);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .delete(`/api/view/${invalidId}`)
                                        .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/view/one', function () {
        let returnedViews: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedViews = await ViewManager.createMany(views);
            });

            it('Should return view', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/view/one?property=${view3.property}`)
                                        .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', views[2].property);

                        done();
                    });
            });

            it('Should return error when view not found', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/view/one?property=${unexistingView.property}`)
                                        .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(res).to.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ViewNotFoundError.name);
                        expect(res.body).to.have.property('message', new ViewNotFoundError().message);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/view/many', function () {
        let returnedViews: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedViews = await ViewManager.createMany(views);
            });

            it('Should return view', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/view/many?property=${view3.property}`)
                                        .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('array');
                        expect(res.body[1]).to.have.property('property', views[2].property);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/view/amount', function () {
        let returnedViews: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedViews = await ViewManager.createMany(views);
            });

            it('Should return view', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/view/amount?property=${view3.property}`)
                                        .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).be.equal(2);

                        done();
                    });
            });
        });
    });

    describe('#GET /api/view/:id', function () {
        let returnedView: any;

        context('When request is valid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedView = await ViewManager.create(view);
            });

            it('Should return view', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/view/${returnedView.id}`)
                                        .set({ authorization: authorizationHeader })
                    .expect(200)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res).to.exist;
                        expect(res.status).to.equal(200);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('property', view.property);

                        done();
                    });
            });

            it('Should return error when view not found', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/view/${new mongoose.Types.ObjectId()}`)
                                        .set({ authorization: authorizationHeader })
                    .expect(404)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(res).to.exist;
                        expect(res.status).to.equal(404);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', ViewNotFoundError.name);
                        expect(res.body).to.have.property('message', new ViewNotFoundError().message);

                        done();
                    });
            });
        });

        context('When request is invalid', function () {
            beforeEach(async function () {
                await mongoose.connection.db.dropDatabase();
                returnedView = await ViewManager.create(view);
            });

            it('Should return error status when id is invalid', function (done: MochaDone) {
                request(server.app)
                    .get(`/api/view/${invalidId}`)
                                        .set({ authorization: authorizationHeader })
                    .expect(400)
                    .expect('Content-Type', /json/)
                    .end((error: Error, res: request.Response) => {
                        expect(error).to.not.exist;
                        expect(res.status).to.equal(400);
                        expect(res).to.have.property('body');
                        expect(res.body).to.be.an('object');
                        expect(res.body).to.have.property('type', IdInvalidError.name);
                        expect(res.body).to.have.property('message', new IdInvalidError().message);

                        done();
                    });
            });
        });
    });
    });
