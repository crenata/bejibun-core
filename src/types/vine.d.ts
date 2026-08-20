import BaseModel from "@/bases/BaseModel";

export type ExtendOptions = {
    table: typeof BaseModel;
    column?: string;
    withTrashed?: boolean;
    nullable?: boolean;
};

declare module "@vinejs/vine" {
    interface VineNumber {
        exists(
            tableOrOptions: typeof BaseModel | ExtendOptions,
            column?: string,
            withTrashed?: boolean,
            nullable?: boolean
        ): this;
        unique(
            tableOrOptions: typeof BaseModel | ExtendOptions,
            column?: string,
            withTrashed?: boolean,
            nullable?: boolean
        ): this;
    }

    interface VineString {
        exists(
            tableOrOptions: typeof BaseModel | ExtendOptions,
            column?: string,
            withTrashed?: boolean,
            nullable?: boolean
        ): this;
        unique(
            tableOrOptions: typeof BaseModel | ExtendOptions,
            column?: string,
            withTrashed?: boolean,
            nullable?: boolean
        ): this;
    }
}

export {};
