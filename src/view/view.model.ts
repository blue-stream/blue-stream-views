import * as mongoose from 'mongoose';
import { IView, ResourceType } from './view.interface';
import { ViewValidations } from './validator/view.validations';

const viewSchema: mongoose.Schema = new mongoose.Schema(
    {
        resource: {
            type: String,
            required: true,
        },
        resourceType: {
            type: String,
            required: true,
            enum: Object.values(ResourceType),
        },
        user: {
            type: String,
            required: true,
            validate: {
                validator: ViewValidations.isUserValid,
            },
        },
        amount: {
            type: Number,
            default: 1,
        },
    },
    {
        versionKey: false,
        timestamps: {
            createdAt: false,
            updatedAt: 'lastViewDate',
        },
        id: false,
    });

viewSchema.index({ resource: 1, user: 1 }, { unique: true });

export const ViewModel = mongoose.model<IView & mongoose.Document>('View', viewSchema);
