export interface FundPrice { date: string; nav: number }
export interface Fund { id: string; name: string; currency: string; prices: FundPrice[] }
export interface FundDataFile { updatedAt: string | null; sourceStatus: "configured" | "not-configured" | "error"; funds: Fund[] }