/**
 * Represents a single Next.js page
 */
export declare class NextPage {
    path: string;
    readonly isStatic: boolean;
    constructor(path: string);
    private static isStatic;
}
/**
 * Represents the build output for a Next.js project
 */
export declare class NextBuild {
    private path;
    private _pages;
    constructor(path: string);
    init(): Promise<void>;
    readonly pages: NextPage[];
}
