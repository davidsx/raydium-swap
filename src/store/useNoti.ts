import create from 'zustand';

export type Noti = {
    type: 'success' | 'error';
    message: string;
    timestamp: number;
    key: string;
};

export type NotiStore = {
    notis: Noti[];
    sendSuccessNoti: (key: string, message: string) => void;
    sendErrorNoti: (error: Error) => void;
    clearLatestNoti: () => void;
};

const useNoti = create<NotiStore>((set, get) => ({
    notis: [],
    sendSuccessNoti: (key, message) => {
        const now = Date.now();
        const noti: Noti = { key, message, type: 'success', timestamp: now };
        set((s) => ({ notis: [...s.notis, noti] }));
        setTimeout(() => set((s) => ({ notis: s.notis.filter(({ timestamp }) => timestamp !== now) })), 5000);
    },
    sendErrorNoti: (error) => {
        const now = Date.now();
        const noti: Noti = { key: error.name, message: error.message, type: 'error', timestamp: now };
        set((s) => ({ notis: [...s.notis, noti] }));
        setTimeout(() => set((s) => ({ notis: s.notis.filter(({ timestamp }) => timestamp !== now) })), 5000);
    },
    clearLatestNoti: () => {
        set((s) => ({ notis: s.notis.length > 0 ? s.notis.slice(0, s.notis.length - 1) : [] }));
    },
}));

export default useNoti;
export const NOTI_TEST = [
    {
        type: 'success',
        message: 'test for success',
        timestamp: Date.now(),
    },
    {
        type: 'error',
        message: 'test for error',
        timestamp: Date.now(),
    },
];
