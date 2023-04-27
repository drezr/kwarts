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
