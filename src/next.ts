import glob = require("tiny-glob");
import { basename, sep, join, dirname } from "path";
import { log, LogLevel } from "./log";

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
    return /\[(.+)\]\.js/.test(basename(this.path));
  }

  /**
   * Indicates whether the page is a special page, e.g., the error page
   */
  get isSpecial(): boolean {
    return this.pageFileName.startsWith("_");
  }

  /**
   * Name of the page
   *
   * For example, for "pages/foo/contact.{ts,js}"" this will be "contact"
   */
  get pageName(): string {
    return basename(this.path, ".js");
  }

  get pageFileName(): string {
    return basename(this.path);
  }

  get pageSourcePath(): string {
    return join(this.sourcePath, this.path);
  }

  get targetFolder(): string {
    const targetFolder = `func_${this.pageName}`;
    return join(this.buildOutputPath, dirname(this.path), targetFolder);
  }

  get targetPageName(): string {
    return basename(this.targetPath, ".js");
  }

  get targetPageFileName(): string {
    return basename(this.targetPath);
  }

  get targetPath(): string {
    return join(this.targetFolder, `__${this.pageFileName}`);
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

  constructor(private path: string) {}

  public async init(buildOutputPath: string): Promise<void> {
    // Parse pages
    const sourcePath = join(this.path, ".next", "serverless");

    const files = await glob("pages/**/*.{js,html}", {
      cwd: sourcePath
    });
    for (const file of files) {
      log(`Discovered file ${file}`, LogLevel.Debug);
      this.pages.push(
        new NextPage(file, sourcePath, join(this.path, buildOutputPath))
      );
    }
  }

  public get pages() {
    return this._pages;
  }
}
