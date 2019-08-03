import { JetztConfig } from "./config";
export declare function deploy(config: JetztConfig, buildOutputPath: string): Promise<void>;
export declare function checkForAzCLI(): Promise<void>;
export declare function createResourceGroup(config: JetztConfig): Promise<void>;
export declare function createStorage(config: JetztConfig): Promise<void>;
export declare function createFunctionApp(config: JetztConfig): Promise<void>;
export declare function upload(config: JetztConfig, buildOutputPath: string): Promise<void>;
