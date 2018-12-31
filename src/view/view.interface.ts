export enum ResourceType {
    VIDEO = 'VIDEO',
    CHANNEL = 'CHANNEL',
}

export interface IView {
    resource: string;
    resourceType: ResourceType;
    user: string;
    amount: number;
    lastViewDate: Date;
}
