import { WasteClasses } from '@/types';

export const CLASSES_INFO: WasteClasses = {
    'Szkło': {
        color: '#4CAF50',
        icon: '♻️',
        bin: 'Zielony pojemnik',
        tips: 'Opłucz przed wyrzuceniem. Usuń metalowe zakrętki.',
        recyclingTime: '4000 lat rozkładu naturalnego'
    },
    'Papier': {
        color: '#2196F3',
        icon: '📄',
        bin: 'Niebieski pojemnik',
        tips: 'Papier nie może być mokry ani tłusty. Usuń plastikowe okienka.',
        recyclingTime: '2-6 miesięcy rozkładu'
    },
    'Plastik': {
        color: '#FFC107',
        icon: '🥤',
        bin: 'Żółty pojemnik',
        tips: 'Zgnieć butelki. Sprawdź kod recyklingu na opakowaniu.',
        recyclingTime: '450+ lat rozkładu naturalnego'
    },
    'Śmieci Zmieszane': {
        color: '#757575',
        icon: '🗑️',
        bin: 'Czarny pojemnik',
        tips: 'Śmieci, których nie można posegregować lub są zabrudzone.',
        recyclingTime: 'Nie podlega recyklingowi'
    }
};

export const CLASSES = Object.keys(CLASSES_INFO);
