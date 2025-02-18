export default {
  auth: {
    title: "Ansattportal",
    description: "Skriv inn e-post og engangspassord for å fortsette",
    options: "Flere alternativer",
    email: {
      otp_sent: "Engangspassord sendt",
      otp_description: "Sjekk e-posten din for engangspassordet",
      otp_try_again: "Prøv igjen",
      placeholder: "Din jobbmail",
      button: "Få engangspassord",
    },
  },
  not_found: {
    title: "Ikke Funnet",
    description: "Siden du leter etter eksisterer ikke.",
    return: "Gå tilbake til forsiden",
  },
} as const;
