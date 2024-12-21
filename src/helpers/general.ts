import { isArray, camelCase, isObject, transform, snakeCase } from "lodash";

const isPersian = (str: string): boolean => /[\u0600-\u06FF]/.test(str);

export const generateNumericId = (): number => {
  const timestamp = new Date().getTime().toString();
  return +timestamp + Math.floor(Math.random());
};

export const camelize = (obj: any): any =>
  transform(obj, (acc, value, key, target) => {
    const camelKey =
      isArray(target) || isPersian(key.toString())
        ? key
        : camelCase(key.toString());

    acc[camelKey] = isObject(value) ? camelize(value) : (value as any);
  });
export const decamelize = (obj: any): any =>
  transform(obj, (acc, value, key, target) => {
    const snakeKey = isArray(target) ? key : snakeCase(key.toString());

    acc[snakeKey] = isObject(value) ? decamelize(value) : (value as any);
  });
