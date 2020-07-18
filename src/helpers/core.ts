/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
/* eslint-disable import/prefer-default-export */

interface DynamicNodeRequire<T> extends NodeRequire {
  default(...args: any): T;
}

export function dynamicRequire<T>(filepath: string): DynamicNodeRequire<T> {
  return require(filepath);
}
