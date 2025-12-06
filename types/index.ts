export interface WasteClass {
    color: string;
    icon: string;
    bin: string;
    tips: string;
    recyclingTime: string;
}

export interface Prediction {
    label: string;
    confidence: number;
    timestamp: string;
}

export interface HistoryItem extends Prediction {
    photo: string;
    id: number;
}

export type WasteClasses = {
    [key: string]: WasteClass;
};
