import glob = require("tiny-glob");
import { join } from "path";

/**
 * Represents a single Next.js page
 */
export class NextPage {
  public readonly isStatic: boolean;

  constructor(public path: string) {
    this.isStatic = NextPage.isStatic(path);
  }

  private static isStatic(path: string): boolean {
    return path.endsWith(".html");
  }
}

/**
 * Represents the build output for a Next.js project
 */
export class NextBuild {
  private _pages: NextPage[] = [];

  constructor(private path: string) {}

  public async init(): Promise<void> {
    // Parse pages
    const files = await glob("serverless/pages/**/*.{js,html}", {
      cwd: this.path
    });
    for (const file of files) {
      this.pages.push(new NextPage(file));
    }
  }

  public get pages() {
    return this._pages;
  }
}
