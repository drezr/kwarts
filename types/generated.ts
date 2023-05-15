// AUTO GENERATED FILE BY @kalissaac/prisma-typegen
// DO NOT EDIT




export interface User {
    id: number,
    email?: string,
    chosenLanguage: string,
    password?: string,
    token?: string,
    eventLinks: EventUser[],
    availabilities: Availability[],
}

export interface Event {
    id: number,
    name: string,
    title?: string,
    slug?: string,
    logo?: string,
    icon?: string,
    theme?: string,
    backLink?: string,
    hasGodfather: boolean,
    isOpen: boolean,
    userLinks: EventUser[],
    dates: Date[],
}

export interface Date {
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
    fideid?: string,
    godfather?: string,
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
