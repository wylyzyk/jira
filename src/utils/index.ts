// const isFalsly = (value: unknown) => (value === 0 ? true : !!value);

const isVoid = (value: unknown) =>
  value === undefined || value === null || value === "";

export const cleanObject = (obj?: { [key: string]: unknown }) => {
  if (!obj) {
    return;
  }

  const result = { ...obj };
  Object.keys(result).forEach((key) => {
    const value = result[key];

    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

export const resetRouter = () =>
  (window.location.href = window.location.origin);

export const subset = <
  T extends { [key in string]: unknown },
  K extends keyof T
>(
  obj: T,
  keys: K[]
) => {
  const filteredEntries = Object.entries(obj).filter(([key]) =>
    keys.includes(key as K)
  );
  return Object.fromEntries(filteredEntries) as Pick<T, K>;
};
