export const generateNumericId = (): number => {
  const timestamp = new Date().getTime().toString()
  return +timestamp + Math.floor(Math.random())
}

export const camelCaseToSnakeCase = (input: string) =>
  input.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '_' : '') + $.toLowerCase())

export const JSONToSnakeCase = (input: any) => {
  const strToObj = JSON.stringify(input)

  for (const obj of strToObj) console.log(obj)
}
