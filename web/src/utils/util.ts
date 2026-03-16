type SnakeToCamel<S extends string> =
  S extends `${infer Head}_${infer Tail}`
    ? `${Head}${Capitalize<SnakeToCamel<Tail>>}`
    : S

type CamelToSnake<S extends string> =
  S extends `${infer Head}${infer Tail}`
    ? Tail extends Uncapitalize<Tail>
      ? `${Uncapitalize<Head>}${CamelToSnake<Tail>}`
      : `${Uncapitalize<Head>}_${CamelToSnake<Tail>}`
    : S

type SnakeToCamelObject<T> = {
  [K in keyof T as SnakeToCamel<string & K>]: T[K] extends object
    ? SnakeToCamelObject<T[K]>
    : T[K]
}

type CamelToSnakeObject<T> = {
  [K in keyof T as CamelToSnake<string & K>]: T[K] extends object
    ? CamelToSnakeObject<T[K]>
    : T[K]
}

// ── String converters ─────────────────────────────────────────────────────────

export const snakeToCamel = (str: string): string =>
  str.replace(/_([a-z])/g, (_, char) => char.toUpperCase())

export const camelToSnake = (str: string): string =>
  str.replace(/([A-Z])/g, (char) => `_${char.toLowerCase()}`)

// ── Object converters ─────────────────────────────────────────────────────────

export const keysToCamel = <T extends object>(obj: T): SnakeToCamelObject<T> => {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === 'object' && item !== null ? keysToCamel(item) : item
    ) as unknown as SnakeToCamelObject<T>
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const camelKey = snakeToCamel(key)
    acc[camelKey] = typeof value === 'object' && value !== null ? keysToCamel(value) : value
    return acc
  }, {} as Record<string, unknown>) as SnakeToCamelObject<T>
}

export const keysToSnake = <T extends object>(obj: T): CamelToSnakeObject<T> => {
  if (Array.isArray(obj)) {
    return obj.map((item) =>
      typeof item === 'object' && item !== null ? keysToSnake(item) : item
    ) as unknown as CamelToSnakeObject<T>
  }

  return Object.entries(obj).reduce((acc, [key, value]) => {
    const snakeKey = camelToSnake(key)
    acc[snakeKey] = typeof value === 'object' && value !== null ? keysToSnake(value) : value
    return acc
  }, {} as Record<string, unknown>) as CamelToSnakeObject<T>
}
