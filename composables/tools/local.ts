const localisation = {
  common: {
    loginTitle: {
      fr: 'Connectez-vous à un évènement',
      nl: '',
      de: '',
      en: '',
    },
    email: {
      fr: 'Adresse email',
      nl: '',
      de: '',
      en: '',
    },
    password: {
      fr: 'Mot de passe',
      nl: '',
      de: '',
      en: '',
    },
    signin: {
      fr: 'Se connecter',
      nl: '',
      de: '',
      en: '',
    },
    signout: {
      fr: 'Déconnexion',
      nl: '',
      de: '',
      en: '',
    },
    loginError: {
      fr: "L'adresse email et le mot de passe que vous avez introduit ne correspondent à aucun évènement.",
      nl: '',
      de: '',
      en: '',
    },
    eventConfig: {
      fr: "Configuration de l'évènement",
      nl: '',
      de: '',
      en: '',
    },
    general: {
      fr: 'Général',
      nl: '',
      de: '',
      en: '',
    },
    dates: {
      fr: 'Dates',
      nl: '',
      de: '',
      en: '',
    },
    date: {
      fr: 'Date',
      nl: '',
      de: '',
      en: '',
    },
    people: {
      fr: 'Personnes',
      nl: '',
      de: '',
      en: '',
    },
    eventName: {
      fr: "Nom de l'évènement",
      nl: '',
      de: '',
      en: '',
    },
    title: {
      fr: 'Titre',
      nl: '',
      de: '',
      en: '',
    },
    alias: {
      fr: 'Alias',
      nl: '',
      de: '',
      en: '',
    },
    areyousure: {
      fr: 'Êtes-vous sûr(e) ?',
      nl: '',
      de: '',
      en: '',
    },
  },
}

export const getLocal = (hierarchy: Array<string>) => {
  const loggedUser: User = useState<User>('loggedUser').value
  const chosenLanguage: string = 'fr'
  let target: any = localisation

  try {
    for (let item of hierarchy) {
      target = target[item]
    }

    return target[chosenLanguage]
  } catch (e) {
    return hierarchy[hierarchy.length - 1]
  }
}
