import { NextPage } from "./next";
export declare function handler(pageName: string): string;
export declare function functionJson(page: NextPage): string;
export declare function hostJson(): string;
export declare function proxiesJson(assetsUrl: string, pages: NextPage[]): string;
