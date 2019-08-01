/**
 * Represents a single Next.js page
 *
 */
export declare class NextPage {
    private readonly path;
    private readonly sourcePath;
    private readonly buildOutputPath;
    /**
     *
     * @param path Relative (to .next/serverless/pages) path to page, e.g., `contact/about.tsx`
     * @param sourcePath Absolute path to `.next/serverless/pages` directory
     * @param buildOutputPath Absolute path to place modified pages in
     */
    constructor(path: string, sourcePath: string, buildOutputPath: string);
    /**
     * Indicates whether the page was statically pre-rendered
     */
    readonly isStatic: boolean;
    /**
     * Indicates whether the page uses dynamic routing
     */
    readonly isDynamicallyRouted: boolean;
    /**
     * Indicates whether the page is a special page, e.g., the error page
     */
    readonly isSpecial: boolean;
    readonly route: string;
    /**
     * Name of the page
     *
     * For example, for "pages/foo/contact.{ts,js,html}"" this will be "contact"
     */
    readonly pageName: string;
    readonly pageFileName: string;
    readonly pageSourcePath: string;
    readonly identifier: string;
    /**
     * Absolute path to the target folder
     */
    readonly targetFolder: string;
    readonly targetPath: string;
    readonly targetPageName: string;
    readonly targetPageFileName: string;
    toString(): string;
}
/**
 * Represents the build output for a Next.js project
 */
export declare class NextBuild {
    private sourcePath;
    private _pages;
    constructor(sourcePath: string);
    init(buildOutputPath: string): Promise<void>;
    readonly pages: NextPage[];
}
