// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT




export interface User {
    id: number,
    email: string,
    chosenLanguage: string,
    eventLinks: EventUser[],
    availabilities: Availability[],
    ownedEvents: Event[],
}

export interface Event {
    id: number,
    name: string,
    owner: User,
    ownerId: number,
    userLinks: EventUser[],
    dates: Date[],
}

export interface Date {
    id: number,
    date: Date,
    comment?: string,
    isLocked: boolean,
    event: Event,
    eventId: number,
    availabilities: Availability[],
}

export interface Availability {
    id: number,
    isAvailable: boolean,
    date: Date,
    dateId: number,
    user: User,
    userId: number,
}

export interface EventUser {
    id: number,
    position: number,
    alias: string,
    password: string,
    event: Event,
    eventId: number,
    user: User,
    userId: number,
}