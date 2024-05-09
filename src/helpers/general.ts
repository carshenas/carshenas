export const generateNumericId = (): number => {
  const timestamp = new Date().getTime().toString()
  return +timestamp + Math.floor(Math.random())
}

export const camelCaseToSnakeCase = (input: string) =>
  input.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '_' : '') + $.toLowerCase())

export const camelCaseObjectToSnakeCase = (object: Record<string, string>) => {
  const snakeCaseObj: Record<string, string> = {}
  for (const item in object) {
    snakeCaseObj[camelCaseToSnakeCase(item)] = object[item]
  }
  return snakeCaseObj
}
