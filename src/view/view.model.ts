import * as mongoose from 'mongoose';
import { IView } from './view.interface';

const viewSchema: mongoose.Schema = new mongoose.Schema(
    {
        property: { type: String, required: true },
    },
    {
        autoIndex: false,
        timestamps: true,
        id: true,
    });

export const ViewModel = mongoose.model<IView & mongoose.Document>('View', viewSchema);
