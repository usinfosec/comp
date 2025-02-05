export default {
  languages: {
    es: "Spansk",
    fr: "Fransk",
    no: "Norsk",
    pt: "Portugisisk",
    en: "Engelsk"
  },
  language: {
    title: "Språk",
    description: "Endre språket som brukes i brukergrensesnittet.",
    placeholder: "Velg språk"
  },
  common: {
    actions: {
      save: "Lagre",
      edit: "Rediger",
      "delete": "Slett",
      cancel: "Avbryt",
      clear: "Tøm",
      create: "Opprett",
      send: "Send",
      "return": "Tilbake",
      success: "Suksess",
      error: "Feil",
      next: "Neste",
      complete: "Fullfør"
    },
    assignee: {
      label: "Tildelt",
      placeholder: "Velg tildelt"
    },
    date: {
      pick: "Velg en dato",
      due_date: "Forfallsdato"
    },
    status: {
      open: "Åpen",
      pending: "Venter",
      closed: "Lukket",
      archived: "Arkivert",
      compliant: "Samsvarende",
      non_compliant: "Ikke samsvarende",
      not_started: "Ikke startet",
      in_progress: "Pågår",
      published: "Publisert",
      needs_review: "Trenger gjennomgang",
      draft: "Utkast",
      not_assessed: "Ikke vurdert",
      assessed: "Vurdert",
      active: "Aktiv",
      inactive: "Inaktiv"
    },
    filters: {
      clear: "Tøm filtre",
      search: "Søk...",
      status: "Status",
      department: "Avdeling",
      owner: {
        label: "Tildelt",
        placeholder: "Filtrer etter tildelt"
      }
    },
    table: {
      title: "Tittel",
      status: "Status",
      assigned_to: "Tildelt Til",
      due_date: "Forfallsdato",
      last_updated: "Sist oppdatert",
      no_results: "Ingen resultater funnet"
    },
    empty_states: {
      no_results: {
        title: "Ingen resultater",
        title_tasks: "Ingen oppgaver funnet",
        title_risks: "Ingen risikoer funnet",
        description: "Prøv et annet søk, eller juster filtrene",
        description_filters: "Prøv et annet søk, eller juster filtrene",
        description_no_tasks: "Opprett en oppgave for å komme i gang",
        description_no_risks: "Opprett en risiko for å komme i gang"
      },
      no_items: {
        title: "Ingen elementer funnet",
        description: "Prøv å justere søket eller filtrene"
      }
    },
    pagination: {
      of: "av",
      items_per_page: "Elementer per side",
      rows_per_page: "Rader per side",
      page_x_of_y: "Side {{current}} av {{total}}",
      go_to_first_page: "Gå til første side",
      go_to_previous_page: "Gå til forrige side",
      go_to_next_page: "Gå til neste side",
      go_to_last_page: "Gå til siste side"
    },
    comments: {
      title: "Kommentarer",
      description: "Legg til en kommentar ved å bruke skjemaet nedenfor.",
      add: "Legg til kommentar",
      "new": "Ny kommentar",
      save: "Lagre kommentar",
      success: "Kommentar lagt til",
      error: "Kunne ikke legge til kommentar",
      placeholder: "Skriv din kommentar her...",
      empty: {
        title: "Ingen kommentarer ennå",
        description: "Vær den første til å legge til en kommentar"
      }
    },
    attachments: {
      title: "Vedlegg",
      description: "Legg til en fil ved å klikke på 'Legg til vedlegg'.",
      upload: "Last opp et vedlegg",
      upload_description: "Last opp et vedlegg eller legg til en lenke til en ekstern ressurs.",
      drop: "Slipp filene her",
      drop_description: "Slipp filer her eller klikk for å velge filer fra enheten din.",
      drop_files_description: "Filer kan være opptil ",
      empty: {
        title: "Ingen vedlegg",
        description: "Legg til en fil ved å klikke på 'Legg til vedlegg'."
      },
      toasts: {
        error: "Noe gikk galt, vennligst prøv igjen.",
        error_uploading_files: "Kan ikke laste opp mer enn 1 fil om gangen",
        error_uploading_files_multiple: "Kan ikke laste opp mer enn 10 filer",
        error_no_files_selected: "Ingen filer valgt",
        error_file_rejected: "Fil {file} ble avvist",
        error_failed_to_upload_files: "Kunne ikke laste opp filer",
        error_failed_to_upload_files_multiple: "Kunne ikke laste opp filer",
        error_failed_to_upload_files_single: "Kunne ikke laste opp fil",
        success_uploading_files: "Filer lastet opp",
        success_uploading_files_multiple: "Filer lastet opp",
        success_uploading_files_single: "Fil lastet opp",
        success_uploading_files_target: "Filer lastet opp",
        uploading_files: "Laster opp {target}...",
        remove_file: "Fjern fil"
      }
    }
  },
  header: {
    discord: {
      button: "Bli med oss på Discord"
    },
    feedback: {
      button: "Tilbakemelding",
      title: "Takk for tilbakemeldingen!",
      description: "Vi kommer tilbake til deg så snart som mulig",
      placeholder: "Ideer for å forbedre denne siden eller problemer du opplever.",
      success: "Takk for tilbakemeldingen!",
      error: "Feil ved sending av tilbakemelding - prøv igjen?",
      send: "Send tilbakemelding"
    }
  },
  not_found: {
    title: "404 - Side ikke funnet",
    description: "Siden du leter etter eksisterer ikke.",
    "return": "Gå tilbake til dashbordet"
  },
  theme: {
    options: {
      light: "Lys",
      dark: "Mørk",
      system: "System"
    }
  },
  sidebar: {
    overview: "Oversikt",
    policies: "Retningslinjer",
    risk: "Risiko",
    vendors: "Leverandører",
    integrations: "Integrasjoner",
    settings: "Innstillinger",
    evidence: "Bevisoppgaver"
  },
  auth: {
    title: "Automatiser SOC 2, ISO 27001 og GDPR-overholdelse med AI.",
    description: "Opprett en gratis konto eller logg inn med en eksisterende konto for å fortsette.",
    options: "Flere alternativer",
    google: "Fortsett med Google",
    email: {
      description: "Skriv inn e-postadressen din for å fortsette.",
      placeholder: "Skriv inn e-postadresse",
      button: "Fortsett med e-post",
      magic_link_sent: "Magisk lenke sendt",
      magic_link_description: "Sjekk innboksen din for en magisk lenke.",
      magic_link_try_again: "Prøv igjen.",
      success: "E-post sendt - sjekk innboksen din!",
      error: "Feil ved sending av e-post - prøv igjen?"
    },
    terms: "Ved å klikke på fortsett, bekrefter du at du har lest og godtar vilkårene for bruk og personvernerklæringen."
  },
  onboarding: {
    title: "Opprett en organisasjon",
    setup: "Oppsett",
    description: "Fortell oss litt om organisasjonen din.",
    fields: {
      name: {
        label: "Organisasjonsnavn",
        placeholder: "Ditt organisasjonsnavn"
      },
      website: {
        label: "Nettsted",
        placeholder: "Ditt organisasjonsnettsted"
      }
    },
    success: "Takk, du er klar!",
    error: "Noe gikk galt, vennligst prøv igjen."
  },
  overview: {
    title: "Oversikt",
    framework_chart: {
      title: "Rammeverkets fremdrift"
    },
    requirement_chart: {
      title: "Overholdelsesstatus"
    }
  },
  policies: {
    dashboard: {
      title: "Dashbord",
      all: "Alle retningslinjer",
      policy_status: "Retningslinjestatus",
      policies_by_assignee: "Retningslinjer etter tildelt",
      policies_by_framework: "Retningslinjer etter rammeverk"
    },
    table: {
      name: "Retningslinjenavn",
      statuses: {
        draft: "Utkast",
        published: "Publisert"
      },
      filters: {
        owner: {
          label: "Tildelt",
          placeholder: "Filtrer etter tildelt"
        }
      }
    },
    filters: {
      search: "Søk etter retningslinjer...",
      all: "Alle retningslinjer"
    },
    status: {
      draft: "Utkast",
      published: "Publisert",
      needs_review: "Trenger gjennomgang"
    },
    policies: "retningslinjer"
  },
  evidence_tasks: {
    evidence_tasks: "Bevisoppgaver",
    overview: "Oversikt"
  },
  risk: {
    risks: "risikoer",
    overview: "Oversikt",
    create: "Opprett ny risiko",
    vendor: {
      title: "Leverandørstyring",
      dashboard: {
        title: "Leverandørdashbord",
        overview: "Leverandøroversikt",
        vendor_status: "Leverandørstatus",
        vendor_category: "Leverandørkategorier",
        vendors_by_assignee: "Leverandører etter tildelt",
        inherent_risk_description: "Innledende risikonivå før noen kontroller er anvendt",
        residual_risk_description: "Gjenstående risikonivå etter at kontroller er anvendt"
      },
      register: {
        title: "Leverandørregister",
        table: {
          name: "Navn",
          category: "Kategori",
          status: "Status",
          owner: "Eier"
        }
      },
      assessment: {
        title: "Leverandørvurdering",
        update_success: "Leverandørens risikovurdering oppdatert vellykket",
        update_error: "Kunne ikke oppdatere leverandørens risikovurdering",
        inherent_risk: "Inherent risiko",
        residual_risk: "Gjenstående risiko"
      },
      form: {
        vendor_details: "Leverandørdetaljer",
        vendor_name: "Navn",
        vendor_name_placeholder: "Skriv inn leverandørnavn",
        vendor_website: "Nettsted",
        vendor_website_placeholder: "Skriv inn leverandørens nettsted",
        vendor_description: "Beskrivelse",
        vendor_description_placeholder: "Skriv inn leverandørbeskrivelse",
        vendor_category: "Kategori",
        vendor_category_placeholder: "Velg kategori",
        vendor_status: "Status",
        vendor_status_placeholder: "Velg status",
        create_vendor_success: "Leverandør opprettet vellykket",
        create_vendor_error: "Kunne ikke opprette leverandør",
        update_vendor: "Oppdater leverandør",
        update_vendor_success: "Leverandør oppdatert",
        update_vendor_error: "Kunne ikke oppdatere leverandør",
        add_comment: "Legg til kommentar"
      },
      table: {
        name: "Navn",
        category: "Kategori",
        status: "Status",
        owner: "Eier"
      },
      filters: {
        search_placeholder: "Søk etter leverandører...",
        status_placeholder: "Filtrer etter status",
        category_placeholder: "Filtrer etter kategori",
        owner_placeholder: "Filtrer etter eier"
      },
      empty_states: {
        no_vendors: {
          title: "Ingen leverandører ennå",
          description: "Kom i gang med å opprette din første leverandør"
        },
        no_results: {
          title: "Ingen resultater funnet",
          description: "Ingen leverandører samsvarer med søket ditt",
          description_with_filters: "Prøv å justere filtrene dine"
        }
      },
      actions: {
        create: "Opprett leverandør"
      },
      status: {
        not_assessed: "Ikke vurdert",
        in_progress: "Under behandling",
        assessed: "Vurdert"
      },
      category: {
        cloud: "Sky",
        infrastructure: "Infrastruktur",
        software_as_a_service: "Programvare som en tjeneste",
        finance: "Finans",
        marketing: "Markedsføring",
        sales: "Salg",
        hr: "HR",
        other: "Annet"
      },
      risk_level: {
        low: "Lav risiko",
        medium: "Moderat risiko",
        high: "Høy risiko",
        unknown: "Ukjent risiko"
      }
    },
    dashboard: {
      title: "Dashbord",
      overview: "Risikooversikt",
      risk_status: "Risiko status",
      risks_by_department: "Risikoer etter avdeling",
      risks_by_assignee: "Risikoer etter ansvarlig",
      inherent_risk_description: "Inherent risiko beregnes som sannsynlighet * påvirkning. Beregnet før noen kontroller er anvendt.",
      residual_risk_description: "Rest risiko beregnes som sannsynlighet * påvirkning. Dette er risikonivået etter at kontroller er anvendt.",
      risk_assessment_description: "Sammenlign inherent og rest risikonivåer"
    },
    register: {
      title: "Risiko register",
      table: {
        risk: "Risiko"
      },
      empty: {
        no_risks: {
          title: "Opprett en risiko for å komme i gang",
          description: "Følg med på og vurder risikoer, opprett og tildel tiltak for teamet ditt, og administrer risiko registeret ditt i ett enkelt grensesnitt."
        },
        create_risk: "Opprett en risiko"
      }
    },
    metrics: {
      probability: "Sannsynlighet",
      impact: "Påvirkning",
      inherentRisk: "Inherent risiko",
      residualRisk: "Rest risiko"
    },
    form: {
      update_inherent_risk: "Lagre inherent risiko",
      update_inherent_risk_description: "Oppdater den inherente risikoen for risikoen. Dette er risikonivået før noen kontroller er anvendt.",
      update_inherent_risk_success: "Inherent risiko oppdatert",
      update_inherent_risk_error: "Kunne ikke oppdatere inherent risiko",
      update_residual_risk: "Lagre rest risiko",
      update_residual_risk_description: "Oppdater rest risikoen for risikoen. Dette er risikonivået etter at kontroller er anvendt.",
      update_residual_risk_success: "Rest risiko oppdatert",
      update_residual_risk_error: "Kunne ikke oppdatere rest risiko",
      update_risk: "Oppdater risiko",
      update_risk_description: "Oppdater risikotittelen eller beskrivelsen.",
      update_risk_success: "Risiko oppdatert",
      update_risk_error: "Kunne ikke oppdatere risiko",
      create_risk_success: "Risiko opprettet",
      create_risk_error: "Kunne ikke opprette risiko",
      risk_details: "Risiko detaljer",
      risk_title: "Risiko tittel",
      risk_title_description: "Skriv inn et navn for risikoen",
      risk_description: "Beskrivelse",
      risk_description_description: "Skriv inn en beskrivelse for risikoen",
      risk_category: "Kategori",
      risk_category_placeholder: "Velg en kategori",
      risk_department: "Avdeling",
      risk_department_placeholder: "Velg en avdeling",
      risk_status: "Risiko status",
      risk_status_placeholder: "Velg en risikostatus"
    },
    tasks: {
      title: "Oppgaver",
      attachments: "Vedlegg",
      overview: "Oppgaveoversikt",
      form: {
        title: "Oppgave detaljer",
        task_title: "Oppgave tittel",
        status: "Oppgave status",
        status_placeholder: "Velg en oppgavestatus",
        task_title_description: "Skriv inn et navn for oppgaven",
        description: "Beskrivelse",
        description_description: "Skriv inn en beskrivelse for oppgaven",
        due_date: "Forfallsdato",
        due_date_description: "Velg forfallsdato for oppgaven",
        success: "Oppgave opprettet",
        error: "Kunne ikke opprette oppgave"
      },
      sheet: {
        title: "Opprett oppgave",
        update: "Oppdater oppgave",
        update_description: "Oppdater oppgavetittelen eller beskrivelsen."
      },
      empty: {
        description_create: "Opprett en tiltakoppgave for denne risikoen, legg til en behandlingsplan, og tildel den til et teammedlem."
      }
    }
  },
  settings: {
    general: {
      title: "Generelt",
      org_name: "Organisasjonsnavn",
      org_name_description: "Dette er organisasjonens synlige navn. Du bør bruke det juridiske navnet på organisasjonen din.",
      org_name_tip: "Vennligst bruk maks 32 tegn.",
      org_website: "Organisasjonens nettsted",
      org_website_description: "Dette er organisasjonens offisielle nettadresse. Sørg for å inkludere den fullstendige nettadressen med https://.",
      org_website_tip: "Vennligst skriv inn en gyldig nettadresse inkludert https://",
      org_website_error: "Feil ved oppdatering av organisasjonens nettsted",
      org_website_updated: "Organisasjonsnettsted oppdatert",
      org_delete: "Slett organisasjon",
      org_delete_description: "Fjern organisasjonen din og alt innholdet permanent fra Comp AI-plattformen. Denne handlingen kan ikke angres - vennligst fortsett med forsiktighet.",
      org_delete_alert_title: "Er du helt sikker?",
      org_delete_alert_description: "Denne handlingen kan ikke angres. Dette vil permanent slette organisasjonen din og fjerne dataene dine fra våre servere.",
      org_delete_error: "Feil ved sletting av organisasjon",
      org_delete_success: "Organisasjon slettet",
      org_name_updated: "Organisasjonsnavn oppdatert",
      org_name_error: "Feil ved oppdatering av organisasjonsnavn",
      save_button: "Lagre",
      delete_button: "Slett",
      delete_confirm: "SLETT",
      delete_confirm_tip: "Skriv SLETT for å bekrefte.",
      cancel_button: "Avbryt"
    },
    members: {
      title: "Medlemmer"
    },
    billing: {
      title: "Fakturering"
    }
  },
  user_menu: {
    theme: "Tema",
    language: "Språk",
    sign_out: "Logg ut",
    account: "Konto",
    support: "Støtte",
    settings: "Innstillinger",
    teams: "Team"
  },
  frameworks: {
    title: "Rammer",
    controls: {
      title: "Kontroller",
      description: "Gjennomgå og administrer samsvarskontroller",
      table: {
        status: "Status",
        control: "Kontroll",
        artifacts: "Artefakter",
        actions: "Handlinger"
      },
      statuses: {
        not_started: "Ikke startet",
        compliant: "Samsvarende",
        non_compliant: "Ikke samsvarende"
      }
    }
  },
  vendor: {
    title: "Dashbord",
    register_title: "Leverandøradministrasjon",
    dashboard: {
      title: "Dashbord",
      overview: "Leverandøroversikt",
      vendor_status: "Leverandørstatus",
      vendor_category: "Leverandørkategorier",
      vendors_by_assignee: "Leverandører etter tildelt",
      inherent_risk_description: "Innledende risikonivå før noen kontroller er anvendt",
      residual_risk_description: "Gjenstående risikonivå etter at kontroller er anvendt"
    },
    register: {
      title: "Leverandørregister",
      table: {
        name: "Navn",
        category: "Kategori",
        status: "Status",
        owner: "Eier"
      }
    },
    category: {
      cloud: "Sky",
      infrastructure: "Infrastruktur",
      software_as_a_service: "SaaS",
      finance: "Finans",
      marketing: "Markedsføring",
      sales: "Salg",
      hr: "HR",
      other: "Annet"
    },
    vendors: "leverandører",
    form: {
      vendor_details: "Leverandørdetaljer",
      vendor_name: "Navn",
      vendor_name_placeholder: "Skriv inn leverandørnavn",
      vendor_website: "Nettsted",
      vendor_website_placeholder: "Skriv inn leverandørnettsted",
      vendor_description: "Beskrivelse",
      vendor_description_placeholder: "Skriv inn leverandørbeskrivelse",
      vendor_category: "Kategori",
      vendor_category_placeholder: "Velg kategori",
      vendor_status: "Status",
      vendor_status_placeholder: "Velg status",
      create_vendor_success: "Leverandør opprettet",
      create_vendor_error: "Feil ved oppretting av leverandør",
      update_vendor_success: "Leverandør oppdatert",
      update_vendor_error: "Feil ved oppdatering av leverandør",
      contacts: "Leverandørkontakter",
      contact_name: "Kontaktpersonnavn",
      contact_email: "Kontaktpersonens e-post",
      contact_role: "Kontaktpersonens rolle",
      add_contact: "Legg til kontakt",
      new_contact: "Ny kontakt",
      min_one_contact_required: "En leverandør må ha minst én kontakt"
    },
    empty_states: {
      no_vendors: {
        title: "Ingen leverandører ennå",
        description: "Kom i gang med å opprette din første leverandør"
      },
      no_results: {
        title: "Ingen resultater funnet",
        description: "Ingen leverandører samsvarer med søket ditt",
        description_with_filters: "Prøv å justere filtrene dine"
      }
    }
  }
} as const;
