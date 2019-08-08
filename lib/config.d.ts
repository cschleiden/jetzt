export declare function getJetztConfig(path: string): Promise<JetztConfig>;
export declare class JetztConfig {
    readonly sourcePath: string;
    private readonly config;
    static parse(sourcePath: string, content: string): JetztConfig;
    static write(sourcePath: string, config: Config): Promise<void>;
    constructor(sourcePath: string, config: Config);
    readonly buildOutputPath: string;
    readonly buildPagesOutputPath: string;
    readonly buildAssetsOutputPath: string;
    /**
     * Name of the function app
     */
    readonly name: string;
    readonly subscriptionId: string;
    readonly location: string;
    readonly resourceGroup: string;
    readonly storageAccount: string;
    readonly assetsContainerName: string;
    readonly storageUrl: string;
    private checkConfig;
}
export interface StorageConfig {
    account: string;
}
export interface FunctionConfig {
    /**
     * Name of the function app
     */
    name: string;
    /**
     * Id of subscription
     */
    subscriptionId: string;
    /**
     * Name of the resource group to use/create
     */
    resourceGroup: string;
    /**
     * Location for all created resources
     */
    location: string;
}
export interface Config {
    storage: StorageConfig;
    functionApp: FunctionConfig;
}
