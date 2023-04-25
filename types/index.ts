interface Event {
  id: number,
  name: string,
  owner: User,
  ownerId: number,
  userLinks: EventUser[],
  dates: Date[],
}

interface User {
  id: number,
  alias: string,
  email: string,
  chosenLanguage: string,
  eventLinks: EventUser[],
  availabilities: Availability[],
  ownedEvents: Event[],
}

interface Date {
  id: number,
  date: Date,
  comment?: string,
  isLocked: boolean,
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
  password: string,
  event: Event,
  eventId: number,
  user: User,
  userId: number,
}
