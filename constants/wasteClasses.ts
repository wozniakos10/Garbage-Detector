import { WasteClasses } from '@/types';

export const CLASSES_INFO: WasteClasses = {
    'biological': {
        color: '#8BC34A',
        icon: '🍂',
        bin: 'Brązowy pojemnik',
        tips: 'Odpady organiczne: resztki jedzenia, obierki, liście. Unikaj mięsa i kości.',
        recyclingTime: '1-6 miesięcy kompostowania'
    },
    'trash': {
        color: '#757575',
        icon: '🗑️',
        bin: 'Czarny pojemnik',
        tips: 'Śmieci zmieszane, których nie można posegregować lub są zabrudzone.',
        recyclingTime: 'Nie podlega recyklingowi'
    },
    'metal': {
        color: '#9E9E9E',
        icon: '🔩',
        bin: 'Żółty pojemnik',
        tips: 'Puszki, folia aluminiowa, metalowe zakrętki. Opłucz przed wyrzuceniem.',
        recyclingTime: '200-500 lat rozkładu naturalnego'
    },
    'plastic': {
        color: '#FFC107',
        icon: '🥤',
        bin: 'Żółty pojemnik',
        tips: 'Zgnieć butelki. Sprawdź kod recyklingu (1-7) na opakowaniu.',
        recyclingTime: '450+ lat rozkładu naturalnego'
    },
    'battery': {
        color: '#F44336',
        icon: '🔋',
        bin: 'Punkt zbiórki baterii',
        tips: 'NIGDY nie wyrzucaj do zwykłych śmieci! Zanieś do sklepu lub punktu zbiórki.',
        recyclingTime: 'Zawiera toksyczne substancje'
    },
    'glass': {
        color: '#4CAF50',
        icon: '♻️',
        bin: 'Zielony pojemnik',
        tips: 'Opłucz przed wyrzuceniem. Usuń metalowe zakrętki.',
        recyclingTime: '4000 lat rozkładu naturalnego'
    },
    'paper': {
        color: '#2196F3',
        icon: '📄',
        bin: 'Niebieski pojemnik',
        tips: 'Papier nie może być mokry ani tłusty. Usuń plastikowe okienka.',
        recyclingTime: '2-6 miesięcy rozkładu'
    },
    'clothes': {
        color: '#E91E63',
        icon: '👕',
        bin: 'Kontener na ubrania',
        tips: 'Czyste ubrania oddaj do kontenera lub organizacji charytatywnych.',
        recyclingTime: '1-5 lat rozkładu (w zależności od materiału)'
    },
    'cardboard': {
        color: '#795548',
        icon: '📦',
        bin: 'Niebieski pojemnik',
        tips: 'Rozłóż pudła. Usuń taśmy i zszywki. Nie może być mokry ani tłusty.',
        recyclingTime: '2-3 miesiące rozkładu'
    },
    'shoes': {
        color: '#607D8B',
        icon: '👟',
        bin: 'Kontener na buty',
        tips: 'Czyste buty wiąż parami i oddaj do kontenera lub organizacji charytatywnych.',
        recyclingTime: '25-40 lat rozkładu'
    }
};

export const CLASSES = [
    'biological', 'trash', 'metal', 'plastic', 'battery',
    'glass', 'paper', 'clothes', 'cardboard', 'shoes'
];

// Mapper from English class names to Polish display names
export const CLASS_NAME_MAPPER: Record<string, string> = {
    'biological': 'Odpady Organiczne',
    'trash': 'Śmieci Zmieszane',
    'metal': 'Metal',
    'plastic': 'Plastik',
    'battery': 'Baterie',
    'glass': 'Szkło',
    'paper': 'Papier',
    'clothes': 'Ubrania',
    'cardboard': 'Karton',
    'shoes': 'Buty'
};
