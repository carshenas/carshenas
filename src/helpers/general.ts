export const generateNumericId = (): number => {
  const timestamp = new Date().getTime().toString()
  return +timestamp + Math.floor(Math.random())
}
