/// <reference types="node" />
interface ExecError extends Error {
    stdout?: string;
    stderr?: string;
}
export declare function enableDryRun(): void;
export declare function execAsync(cmd: string): Promise<{
    stdout: string;
    stderr: string;
} | undefined>;
export declare function fail(msg: string, error?: ExecError): void;
export {};
