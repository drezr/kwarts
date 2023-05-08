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
    sortUsersByName: {
      fr: 'Trier par ordre alphabétique',
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
    updateEmail: {
      fr: 'Mettre à jour l\'adresse email',
      nl: '',
      de: '',
      en: '',
    },
    sendPassword: {
      fr: 'Envoyer le mot de passe par email',
      nl: '',
      de: '',
      en: '',
    },
    sendPasswordConfirm: {
      fr: 'Voulez-vous envoyer le mot de passe par email ?',
      nl: '',
      de: '',
      en: '',
    },
    passwordSent: {
      fr: 'Le mot de passe a été envoyé par email.',
      nl: '',
      de: '',
      en: '',
    },
    passwordNotSent: {
      fr: "Le mot de passe n'a pas encore été envoyé.\nCliquez sur l'adresse email pour l'envoyer.",
      nl: '',
      de: '',
      en: '',
    },
    isHiddenTooltip: {
      fr: 'Cet utilisateur est invisible dans la liste.\nCliquez ici pour le rendre visible.',
      nl: '',
      de: '',
      en: '',
    },
    isVisibleTooltip: {
      fr: 'Cet utilisateur est visible dans la liste.\nCliquez ici pour le rendre invisible.',
      nl: '',
      de: '',
      en: '',
    },
    isLockedTooltip: {
      fr: 'Cette date est verrouillée.\nCliquez ici pour la déverrouiller.',
      nl: '',
      de: '',
      en: '',
    },
    isNotLockedTooltip: {
      fr: 'Cette date est déverrouillée.\nCliquez ici pour la verrouiller.',
      nl: '',
      de: '',
      en: '',
    },
  },
  email_text: {
    send_password_title: {
      fr: "Votre mot de passe pour l'évènement",
      nl: '',
      de: '',
      en: '',
    },
    send_password_content: {
      fr: "Voici vos informations de connexion afin de donner vos disponibilités pour l'évènement",
      nl: '',
      de: '',
      en: '',
    },
    send_password_hello: {
      fr: 'Bonjour',
      nl: '',
      de: '',
      en: '',
    },
    send_password_seeyousoon: {
      fr: 'À bientôt',
      nl: '',
      de: '',
      en: '',
    },
    send_password_clickhere: {
      fr: "Cliquez ici pour accèder à l'èvenement",
      nl: '',
      de: '',
      en: '',
    },
  },
}

export const getLocal = (hierarchy: Array<string>) => {
  // const loggedUser: User = useState<User>('loggedUser').value
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
