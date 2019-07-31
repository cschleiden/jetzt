export declare enum LogLevel {
    Default = 0,
    Verbose = 1,
    Debug = 2
}
export declare let CurrentLogLevel: LogLevel;
export declare function log(text: string, level?: LogLevel): void;
