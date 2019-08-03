export declare class JetztConfig {
    private readonly config;
    static parse(content: string): JetztConfig;
    private constructor();
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
