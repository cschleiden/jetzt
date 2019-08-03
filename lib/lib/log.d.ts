export declare enum LogLevel {
    Error = 0,
    Default = 1,
    Verbose = 2,
    Debug = 3
}
export declare let currentLogLevel: LogLevel;
export declare function setLogLevel(level: LogLevel): void;
export declare function log(text: string, level?: LogLevel): void;
