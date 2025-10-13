declare module "@vinejs/vine" {
    interface VineNumber {
        exists(tableOrOptions: string | { table: string; column?: string }, column?: string): this;
        unique(tableOrOptions: string | { table: string; column?: string }, column?: string): this;
    }

    interface VineString {
        exists(tableOrOptions: string | { table: string; column?: string }, column?: string): this;
        unique(tableOrOptions: string | { table: string; column?: string }, column?: string): this;
    }
}

export {};