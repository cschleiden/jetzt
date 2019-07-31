export interface StorageConfig {
    account: string;
    container: string;
    url: string;
}
export interface FunctionConfig {
}
export interface JetztConfig {
    storage: StorageConfig;
    functionApp: FunctionConfig;
}
export declare function checkConfig(config: JetztConfig): void;
