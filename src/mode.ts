export enum ModeFlags {
  Build = 1 << 0,
  Deploy = 1 << 1
}

export type Mode = {
  mode: ModeFlags;
};
