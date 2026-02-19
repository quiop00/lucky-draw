
import { Prize, DrawRecord } from '../types';

const PRIZES_KEY = 'lucky_draw_prizes';

// Biến bộ nhớ tạm (xóa khi reload trang F5)
let sessionHistory: DrawRecord[] = [];
let sessionOpenedBoxes: Record<number, Prize> = {};

const DEFAULT_PRIZES: Prize[] = [
  { 
    id: '1', 
    name: '500.000 VNĐ', 
    description: 'Giải đặc biệt cực khủng', 
    quantity: 1, 
    weight: 1, 
    icon: 'money-bill-1' 
  },
  { 
    id: '2', 
    name: '200.000 VNĐ', 
    description: 'Giải nhất may mắn', 
    quantity: 2, 
    weight: 1, 
    icon: 'money-bill-wave' 
  },
  { 
    id: '3', 
    name: '100.000 VNĐ', 
    description: 'Giải nhì tài lộc', 
    quantity: 3, 
    weight: 1, 
    icon: 'money-check-dollar' 
  }
];

export const getPrizes = (): Prize[] => {
  try {
    const data = localStorage.getItem(PRIZES_KEY);
    return data ? JSON.parse(data) : DEFAULT_PRIZES;
  } catch (e) {
    console.error("Lỗi đọc dữ liệu quà tặng:", e);
    return DEFAULT_PRIZES;
  }
};

export const savePrizes = (prizes: Prize[]) => {
  try {
    localStorage.setItem(PRIZES_KEY, JSON.stringify(prizes));
  } catch (e) {
    console.error("Lỗi lưu dữ liệu quà tặng:", e);
  }
};

export const getHistory = (): DrawRecord[] => {
  return sessionHistory;
};

export const addHistory = (record: DrawRecord) => {
  sessionHistory = [record, ...sessionHistory].slice(0, 100);
};

export const clearHistory = () => {
  sessionHistory = [];
};

export const getOpenedBoxes = (): Record<number, Prize> => {
  return sessionOpenedBoxes;
};

export const saveOpenedBoxes = (openedBoxes: Record<number, Prize>) => {
  sessionOpenedBoxes = openedBoxes;
};

export const clearOpenedBoxes = () => {
  sessionOpenedBoxes = {};
};
