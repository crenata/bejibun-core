import readline from "readline";

export const isEmpty = (value: any): boolean => {
    return (
        value === undefined ||
        value === null ||
        value === false ||
        value === 0 ||
        value === 0n ||
        (typeof value === "string" && value.trim() === "") ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === "object" && !Array.isArray(value) && Object.keys(value).length === 0)
    );
};

export const isNotEmpty = (value: any): boolean => {
    return !isEmpty(value);
};

export const defineValue = (value: any, defaultValue: any = null): any => {
    if (isNotEmpty(value)) return value;

    return defaultValue;
};

export const ask = (question: string): Promise<string> => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve, reject) => {
        return rl.question(question, (answer: string) => {
            rl.close();

            resolve(answer.trim());
        });
    });
};