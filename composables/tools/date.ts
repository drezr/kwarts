export default class DateTools {
  formatDatetime(datetime: string | undefined | null) {
    /**
     * Returns datetime with the following format: DD/MM
     *
     * @param {string | null} datetime the date to convert. Expected format 'YYYY-MM-DD'
     */

    if (datetime) {
      const date = new Date(datetime)

      let day = String(date.getDate())
      let month = String(date.getMonth() + 1)
      let year = String(date.getFullYear())

      if (day.length == 1) day = '0' + day
      if (month.length == 1) month = '0' + month

      return `${day}/${month}/${year}`
    }

    return null
  }

  formatDatetimeNoYear(datetime: string | undefined | null) {
    /**
     * Returns datetime with the following format: DD/MM
     *
     * @param {string | null} datetime the date to convert. Expected format 'YYYY-MM-DD'
     */

    if (datetime) {
      const date = new Date(datetime)

      let day = String(date.getDate())
      let month = String(date.getMonth() + 1)

      if (day.length == 1) day = '0' + day
      if (month.length == 1) month = '0' + month

      return `${day}/${month}`
    }

    return null
  }

  formatDatetimeDayNameNoYear(datetime: string | undefined | null) {
    /**
     * Returns day name and datetime with the following format: DAYNAME DD/MM
     *
     * @param {string | null} datetime the date to convert. Expected format 'YYYY-MM-DD'
     */

    if (datetime) {
      const loggedUser: User = useState<User>('loggedUser').value
      const chosenLanguage: string = loggedUser.chosenLanguage

      const date = new Date(datetime)
      const dateNumber = this.formatDatetimeNoYear(datetime)
      const dayName = date.toLocaleString('fr-fr', { weekday: 'long' })

      return `${dayName[0].toUpperCase() + dayName.slice(1)} ${dateNumber}`
    }

    return null
  }

  getWeek(datetime: string | undefined | null) {
    if (datetime) {
      const date = new Date(datetime)
      date.setHours(0, 0, 0, 0)
      date.setDate(date.getDate() + 3 - ((date.getDay() + 6) % 7))
      var week1 = new Date(date.getFullYear(), 0, 4)
      return (
        1 +
        Math.round(
          ((date.getTime() - week1.getTime()) / 86400000 -
            3 +
            ((week1.getDay() + 6) % 7)) /
            7
        )
      )
    }

    return null
  }

  swapFormat(date: string) {
    const dateSplitted = date.split('-')

    return `${dateSplitted[2]}-${dateSplitted[1]}-${dateSplitted[0]}`
  }
}
