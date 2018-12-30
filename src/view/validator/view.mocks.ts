import { Types } from 'mongoose';
import { createRequest, createResponse } from 'node-mocks-http';
import { sign } from 'jsonwebtoken';
import { config } from '../../config';

export const responseMock = createResponse();

export class ValidRequestMocks {
    readonly validProperty: string = '12345';
    readonly validProperty2: string = '23456';
    readonly validProperty3: string = '34567';

    readonly view = {
        property: this.validProperty,
    };

    readonly view2 = {
        property: this.validProperty2,
    };

    readonly view3 = {
        property: this.validProperty3,
    };

    readonly viewFilter = this.view;

    authorizationHeader = `Bearer ${sign('mock-user', config.authentication.secret)}`;

    create = createRequest({
        method: 'POST',
        url: '/api/view/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: this.view,
    });

    
    createMany = createRequest({
        method: 'POST',
        url: '/api/view/many/',
        headers: {
            authorization: this.authorizationHeader,
        },
        body: [
            this.view,
            this.view2,
            this.view3,
        ],
    });

    updateById = createRequest({
        method: 'PUT',
        url: '/api/view/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
            id_REMOVE: '12345',
        },
        body: this.view,
    });

    updateMany = createRequest({
        method: 'PUT',
        url: '/api/view/many',
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.viewFilter,
        body: this.view,
    });

    deleteById = createRequest({
        method: 'DELETE',
        url: '/api/view/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });

    getById = createRequest({
        method: 'GET',
        url: '/api/view/:id',
        headers: {
            authorization: this.authorizationHeader,
        },
        params: {
            id: new Types.ObjectId(),
        },
    });

    getOne = createRequest({
        method: 'GET',
        url: `/api/view/one?viewFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.view,
    });

    getMany = createRequest({
        method: 'GET',
        url: `/api/view/many?viewFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.view,
    });

    getAmount = createRequest({
        method: 'GET',
        url: `/api/view/amount?viewFilter={'property':${this.validProperty}}`,
        headers: {
            authorization: this.authorizationHeader,
        },
        query: this.view,
    });
    }
