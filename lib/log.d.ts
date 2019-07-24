export declare enum Level {
    Default = 0,
    Verbose = 1
}
export declare let LogLevel: Level;
export declare function log(text: string, level?: Level): void;
