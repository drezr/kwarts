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
    homepage?: string,
    backlinkText?: string,
    godfatherInfoLink?: string,
    isListingOpen: boolean,
    showIsMotorized: boolean,
    showIsReserve: boolean,
    showFideid: boolean,
    registerShowDates: boolean,
    isFree: boolean,
    sendMailOnRegister: boolean,
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
    phone?: string,
    godfather?: string,
    note?: string,
    elo?: string,
    club?: string,
    nationality?: string,
    hasPaid: boolean,
    paymentNote?: string,
    isMotorized?: boolean,
    isReserve?: boolean,
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
