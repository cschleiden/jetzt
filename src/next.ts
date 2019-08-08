import glob = require("tiny-glob");
import { basename, sep, join, dirname, extname } from "path";
import { log, LogLevel } from "./lib/log";

/**
 * Represents a single Next.js page
 *
 */
export class NextPage {
  /**
   *
   * @param path Relative (to .next/serverless/pages) path to page, e.g., `contact/about.tsx`
   * @param sourcePath Absolute path to `.next/serverless/pages` directory
   * @param buildOutputPath Absolute path to place modified pages in
   */
  constructor(
    private readonly path: string,
    private readonly sourcePath: string,
    private readonly buildOutputPath: string
  ) {}

  /**
   * Indicates whether the page was statically pre-rendered
   */
  get isStatic(): boolean {
    return this.path.endsWith(".html");
  }

  /**
   * Indicates whether the page uses dynamic routing
   */
  get isDynamicallyRouted(): boolean {
    return /\[(.+)\]/.test(this.route);
  }

  /**
   * Indicates whether the page is a special page, e.g., the error page
   */
  get isSpecial(): boolean {
    return this.pageFileName.startsWith("_");
  }

  get route(): string {
    return this.path
      .split(sep)
      .slice(1) // Skip `pages`
      .map(x => {
        if (this.isStatic) {
          // Work-around for function routing. Should find a better way here.
          if (x === "index.html") {
            return "";
          }
        }

        return basename(x, extname(x));
      })
      .join("/");
  }

  /**
   * Name of the page
   *
   * For example, for "pages/foo/contact.{ts,js,html}"" this will be "contact". For dynamic pages,
   * [foo] will be replaced with _foo_
   */
  get pageName(): string {
    return basename(this.path, extname(this.path)).replace(
      /\[(.+?)\]/g,
      "_$1_"
    );
  }

  get pageFileName(): string {
    return basename(this.path);
  }

  get pageSourcePath(): string {
    return join(this.sourcePath, this.path);
  }

  get identifier(): string {
    // Azure functions don't support sub-folders, so encode folder structure in file name.
    // Skip the first entry (/pages)
    const folder = dirname(this.path)
      .split(sep)
      .slice(1)
      .map(x => x.replace(/\[(.+?)\]/g, "_$1_"))
      .join("_");

    return `func_${folder}_${this.pageName}`;
  }

  /**
   * Absolute path to the target folder
   */
  get targetFolder(): string {
    return join(this.buildOutputPath, this.identifier);
  }

  get targetPath(): string {
    return join(this.targetFolder, `__${this.pageFileName}`);
  }

  get targetPageName(): string {
    return basename(this.targetPath, extname(this.targetPath));
  }

  get targetPageFileName(): string {
    if (this.isStatic) {
      return `${this.identifier}.html`;
    }

    return basename(this.targetPath);
  }

  toString(): string {
    return `${this.pageName} - ${this.isStatic}`;
  }
}

/**
 * Represents the build output for a Next.js project
 */
export class NextBuild {
  private _pages: NextPage[] = [];

  constructor(private sourcePath: string) {}

  public async init(buildOutputPath: string): Promise<void> {
    // Parse pages
    const sourcePath = join(this.sourcePath, ".next", "serverless");

    const files = await glob("pages/**/*.{js,html}", {
      cwd: sourcePath
    });
    for (const file of files) {
      log(`Discovered file ${file}`, LogLevel.Debug);
      this.pages.push(new NextPage(file, sourcePath, buildOutputPath));
    }
  }

  public get pages() {
    return this._pages;
  }
}
