interface User {
  id: number,
  email?: string,
  chosenLanguage: string,
  password?: string,
  token?: string,
  eventLinks: EventUser[],
  availabilities: Availability[],
}

interface Event {
  id: number,
  name: string,
  title?: string,
  slug?: string,
  logo?: string,
  icon?: string,
  theme?: string,
  backLink?: string,
  backLinkText?: string,
  godfatherInfoLink?: string,
  hasGodfather: boolean,
  isOpen: boolean,
  userLinks: EventUser[],
  dates: Date[],
}

interface Date {
  id: number,
  date: Date,
  title?: string,
  comment?: string,
  isLocked: boolean,
  position: number,
  event: Event,
  eventId: number,
  availabilities: Availability[],
}

interface Availability {
  id: number,
  isAvailable: boolean,
  isMotorized?: boolean,
  isReserve?: boolean,
  date: Date,
  dateId: number,
  user: User,
  userId: number,
}

interface EventUser {
  id: number,
  position: number,
  alias: string,
  password: string,
  fideid?: string,
  godfather?: string,
  note?: string,
  hasPaid: boolean,
  paymentNote?: string,
  isValidated: boolean,
  isPasswordSent: boolean,
  isHidden: boolean,
  isAdmin: boolean,
  isOwner: boolean,
  token?: string,
  event: Event,
  eventId: number,
  user: User,
  userId: number,
}
