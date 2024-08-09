import jalaali from 'jalaali-js'

export const useJalaliDate = () => {
  const convertToJalali = (dateString: string): string => {
    const date = new Date(dateString)
    const jalaaliDate = jalaali.toJalaali(date.getFullYear(), date.getMonth() + 1, date.getDate())
    return `${jalaaliDate.jy}/${jalaaliDate.jm}/${jalaaliDate.jd}`
  }

  return { convertToJalali }
}
