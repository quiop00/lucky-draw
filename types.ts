
export interface Prize {
  id: string;
  name: string;
  description: string;
  quantity: number;
  weight: number; // For probability
  icon: string;
}

export interface DrawRecord {
  timestamp: number;
  prizeId: string;
  prizeName: string;
}
