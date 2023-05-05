interface User {
  id: number,
  email: string,
  chosenLanguage: string,
  password?: string,
  token?: string,
  eventLinks: EventUser[],
  availabilities: Availability[],
  ownedEvents: Event[],
}

interface Event {
  id: number,
  name: string,
  owner: User,
  ownerId: number,
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
  isPasswordSent: boolean,
  isHidden: boolean,
  token?: string,
  event: Event,
  eventId: number,
  user: User,
  userId: number,
}
