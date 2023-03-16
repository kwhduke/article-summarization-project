declare const Configuration: any, OpenAIApi: any;
declare const dotenv: any;
declare const promptLibrary: any;
declare const abstracts: any;
declare const MAX_TOKENS = 1000;
declare enum Category {
    Biology = "Biology",
    Computer_Science = "Computer Science",
    Economics = "Economics"
}
declare const configuration: any;
declare const openai: any;
declare const main: () => Promise<void>;
declare const promptUserAndGetChoice: () => Promise<Category>;
declare const getTextToSummarize: (category: Category) => string;
declare const createSummarization: (textToSummarize: string) => Promise<string>;
declare const handleError: (error: any) => void;
