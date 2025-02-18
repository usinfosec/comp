export default {
  auth: {
    title: "Portail des Employés",
    description: "Entrez votre email et votre mot de passe à usage unique pour continuer",
    options: "Plus d'options",
    email: {
      otp_sent: "Mot de passe à usage unique envoyé",
      otp_description: "Vérifiez votre email pour le mot de passe à usage unique",
      otp_try_again: "Réessayer",
      placeholder: "Votre email professionnel",
      button: "Obtenir un mot de passe à usage unique",
    },
  },
  not_found: {
    title: "Page Non Trouvée",
    description: "La page que vous recherchez n'existe pas.",
    return: "Retourner à la page d'accueil",
  },
} as const;
