export default {
  language: {
    title: "Idiomas",
    description: "Cambia el idioma utilizado en la interfaz de usuario.",
    placeholder: "Seleccionar idioma"
  },
  languages: {
    en: "Inglés",
    no: "Noruego",
    es: "Español",
    fr: "Francés",
    pt: "Portugués"
  },
  common: {
    actions: {
      save: "Guardar",
      edit: "Editar",
      "delete": "Eliminar",
      cancel: "Cancelar",
      clear: "Limpiar",
      create: "Crear",
      send: "Enviar",
      "return": "Regresar",
      success: "Éxito",
      error: "Error",
      next: "Siguiente",
      complete: "Completar"
    },
    assignee: {
      label: "Asignado a",
      placeholder: "Seleccionar asignado"
    },
    date: {
      pick: "Seleccionar una fecha",
      due_date: "Fecha de vencimiento"
    },
    status: {
      open: "Abierto",
      pending: "Pendiente",
      closed: "Cerrado",
      archived: "Archivado",
      compliant: "Cumplido",
      non_compliant: "No Cumplido",
      not_started: "No Iniciado",
      in_progress: "En Progreso",
      published: "Publicado",
      needs_review: "Necesita Revisión",
      draft: "Borrador",
      not_assessed: "No Evaluado",
      assessed: "Evaluado",
      active: "Activo",
      inactive: "Inactivo"
    },
    filters: {
      clear: "Limpiar filtros",
      search: "Buscar...",
      status: "Estado",
      department: "Departamento",
      owner: {
        label: "Asignado a",
        placeholder: "Filtrar por asignado"
      }
    },
    table: {
      title: "Título",
      status: "Estado",
      assigned_to: "Asignado a",
      due_date: "Fecha de vencimiento",
      last_updated: "Última Actualización",
      no_results: "No se encontraron resultados"
    },
    empty_states: {
      no_results: {
        title: "Sin resultados",
        title_tasks: "No se encontraron tareas",
        title_risks: "No se encontraron riesgos",
        description: "Intenta otra búsqueda o ajusta los filtros",
        description_filters: "Intenta otra búsqueda o ajusta los filtros",
        description_no_tasks: "Crea una tarea para comenzar",
        description_no_risks: "Crea un riesgo para comenzar"
      },
      no_items: {
        title: "No se encontraron elementos",
        description: "Intenta ajustar tu búsqueda o filtros"
      }
    },
    pagination: {
      of: "de",
      items_per_page: "Elementos por página",
      rows_per_page: "Filas por página",
      page_x_of_y: "Página {{current}} de {{total}}",
      go_to_first_page: "Ir a la primera página",
      go_to_previous_page: "Ir a la página anterior",
      go_to_next_page: "Ir a la siguiente página",
      go_to_last_page: "Ir a la última página"
    },
    comments: {
      title: "Comentarios",
      description: "Agrega un comentario usando el formulario a continuación.",
      add: "Agregar Comentario",
      "new": "Nuevo Comentario",
      save: "Guardar Comentario",
      success: "Comentario agregado con éxito",
      error: "Error al agregar el comentario",
      placeholder: "Escribe tu comentario aquí...",
      empty: {
        title: "Sin comentarios aún",
        description: "Sé el primero en agregar un comentario"
      }
    },
    attachments: {
      title: "Adjuntos",
      description: "Agrega un archivo haciendo clic en 'Agregar Adjunto'.",
      upload: "Subir un adjunto",
      upload_description: "Sube un adjunto o agrega un enlace a un recurso externo.",
      drop: "Suelta los archivos aquí",
      drop_description: "Suelta archivos aquí o haz clic para elegir archivos de tu dispositivo.",
      drop_files_description: "Los archivos pueden ser de hasta ",
      empty: {
        title: "Sin adjuntos",
        description: "Agrega un archivo haciendo clic en 'Agregar Adjunto'."
      },
      toasts: {
        error: "Algo salió mal, por favor intenta de nuevo.",
        error_uploading_files: "No se puede subir más de 1 archivo a la vez",
        error_uploading_files_multiple: "No se pueden subir más de 10 archivos",
        error_no_files_selected: "No se seleccionaron archivos",
        error_file_rejected: "El archivo {file} fue rechazado",
        error_failed_to_upload_files: "Error al subir archivos",
        error_failed_to_upload_files_multiple: "Error al subir archivos",
        error_failed_to_upload_files_single: "Error al subir el archivo",
        success_uploading_files: "Archivos subidos con éxito",
        success_uploading_files_multiple: "Archivos subidos con éxito",
        success_uploading_files_single: "Archivo subido con éxito",
        success_uploading_files_target: "Archivos subidos",
        uploading_files: "Subiendo {target}...",
        remove_file: "Eliminar archivo"
      }
    }
  },
  header: {
    discord: {
      button: "Únete a nosotros en Discord"
    },
    feedback: {
      button: "Comentarios",
      title: "¡Gracias por tus comentarios!",
      description: "Volveremos contigo lo antes posible",
      placeholder: "Ideas para mejorar esta página o problemas que estás experimentando.",
      success: "¡Gracias por tus comentarios!",
      error: "Error al enviar comentarios - ¿intentar de nuevo?",
      send: "Enviar Comentarios"
    }
  },
  not_found: {
    title: "404 - Página no encontrada",
    description: "La página que buscas no existe.",
    "return": "Regresar al panel"
  },
  theme: {
    options: {
      light: "Claro",
      dark: "Oscuro",
      system: "Sistema"
    }
  },
  sidebar: {
    overview: "Resumen",
    policies: "Políticas",
    risk: "Riesgo",
    vendors: "Proveedores",
    integrations: "Integraciones",
    settings: "Configuraciones",
    evidence: "Tareas de Evidencia"
  },
  auth: {
    title: "Automatiza el cumplimiento de SOC 2, ISO 27001 y GDPR con IA.",
    description: "Crea una cuenta gratuita o inicia sesión con una cuenta existente para continuar.",
    options: "Más opciones",
    google: "Continuar con Google",
    email: {
      description: "Ingresa tu dirección de correo electrónico para continuar.",
      placeholder: "Ingresa la dirección de correo electrónico",
      button: "Continuar con correo electrónico",
      magic_link_sent: "Enlace mágico enviado",
      magic_link_description: "Revisa tu bandeja de entrada para un enlace mágico.",
      magic_link_try_again: "Intenta de nuevo.",
      success: "Correo enviado - ¡revisa tu bandeja de entrada!",
      error: "Error al enviar el correo - ¿intentar de nuevo?"
    },
    terms: "Al hacer clic en continuar, reconoces que has leído y aceptas los Términos de Servicio y la Política de Privacidad."
  },
  onboarding: {
    title: "Crear una organización",
    setup: "Configuración",
    description: "Cuéntanos un poco sobre tu organización.",
    fields: {
      name: {
        label: "Nombre de la Organización",
        placeholder: "El nombre de tu organización"
      },
      website: {
        label: "Sitio Web",
        placeholder: "El sitio web de tu organización"
      }
    },
    success: "¡Gracias, estás listo!",
    error: "Algo salió mal, por favor intenta de nuevo."
  },
  overview: {
    title: "Resumen",
    framework_chart: {
      title: "Progreso del Marco"
    },
    requirement_chart: {
      title: "Estado de Cumplimiento"
    }
  },
  policies: {
    dashboard: {
      title: "Panel",
      all: "Todas las Políticas",
      policy_status: "Estado de la Política",
      policies_by_assignee: "Políticas por Asignado",
      policies_by_framework: "Políticas por Marco"
    },
    table: {
      name: "Nombre de la Política",
      statuses: {
        draft: "Borrador",
        published: "Publicado"
      },
      filters: {
        owner: {
          label: "Asignado",
          placeholder: "Filtrar por asignado"
        }
      }
    },
    filters: {
      search: "Buscar políticas...",
      all: "Todas las Políticas"
    },
    status: {
      draft: "Borrador",
      published: "Publicado",
      needs_review: "Necesita Revisión"
    },
    policies: "políticas"
  },
  evidence_tasks: {
    evidence_tasks: "Tareas de Evidencia",
    overview: "Resumen"
  },
  risk: {
    risks: "riesgos",
    overview: "Resumen",
    create: "Crear Nuevo Riesgo",
    vendor: {
      title: "Gestión de Proveedores",
      dashboard: {
        title: "Panel de Proveedores",
        overview: "Resumen de Proveedores",
        vendor_status: "Estado del Proveedor",
        vendor_category: "Categorías de Proveedores",
        vendors_by_assignee: "Proveedores por Asignado",
        inherent_risk_description: "Nivel de riesgo inicial antes de aplicar controles",
        residual_risk_description: "Nivel de riesgo restante después de aplicar controles"
      },
      register: {
        title: "Registro de Proveedores",
        table: {
          name: "Nombre",
          category: "Categoría",
          status: "Estado",
          owner: "Propietario"
        }
      },
      assessment: {
        title: "Evaluación de Proveedores",
        update_success: "Evaluación de riesgo del proveedor actualizada con éxito",
        update_error: "Error al actualizar la evaluación de riesgo del proveedor",
        inherent_risk: "Riesgo Inherente",
        residual_risk: "Riesgo Residual"
      },
      form: {
        vendor_details: "Detalles del Proveedor",
        vendor_name: "Nombre",
        vendor_name_placeholder: "Ingresa el nombre del proveedor",
        vendor_website: "Sitio Web",
        vendor_website_placeholder: "Ingresa el sitio web del proveedor",
        vendor_description: "Descripción",
        vendor_description_placeholder: "Ingresa la descripción del proveedor",
        vendor_category: "Categoría",
        vendor_category_placeholder: "Selecciona categoría",
        vendor_status: "Estado",
        vendor_status_placeholder: "Selecciona estado",
        create_vendor_success: "Proveedor creado con éxito",
        create_vendor_error: "Error al crear proveedor",
        update_vendor: "Actualizar Proveedor",
        update_vendor_success: "Proveedor actualizado con éxito",
        update_vendor_error: "Error al actualizar proveedor",
        add_comment: "Agregar Comentario"
      },
      table: {
        name: "Nombre",
        category: "Categoría",
        status: "Estado",
        owner: "Propietario"
      },
      filters: {
        search_placeholder: "Buscar proveedores...",
        status_placeholder: "Filtrar por estado",
        category_placeholder: "Filtrar por categoría",
        owner_placeholder: "Filtrar por propietario"
      },
      empty_states: {
        no_vendors: {
          title: "Sin proveedores aún",
          description: "Comienza creando tu primer proveedor"
        },
        no_results: {
          title: "No se encontraron resultados",
          description: "No hay proveedores que coincidan con tu búsqueda",
          description_with_filters: "Intenta ajustar tus filtros"
        }
      },
      actions: {
        create: "Crear Proveedor"
      },
      status: {
        not_assessed: "No Evaluado",
        in_progress: "En Progreso",
        assessed: "Evaluado"
      },
      category: {
        cloud: "Nube",
        infrastructure: "Infraestructura",
        software_as_a_service: "Software como Servicio",
        finance: "Finanzas",
        marketing: "Marketing",
        sales: "Ventas",
        hr: "RRHH",
        other: "Otro"
      },
      risk_level: {
        low: "Bajo Riesgo",
        medium: "Riesgo Medio",
        high: "Alto Riesgo",
        unknown: "Riesgo Desconocido"
      }
    },
    dashboard: {
      title: "Tablero",
      overview: "Resumen de Riesgos",
      risk_status: "Estado de Riesgo",
      risks_by_department: "Riesgos por Departamento",
      risks_by_assignee: "Riesgos por Asignado",
      inherent_risk_description: "El riesgo inherente se calcula como probabilidad * impacto. Calculado antes de aplicar cualquier control.",
      residual_risk_description: "El riesgo residual se calcula como probabilidad * impacto. Este es el nivel de riesgo después de aplicar controles.",
      risk_assessment_description: "Compara los niveles de riesgo inherente y residual"
    },
    register: {
      title: "Registro de Riesgos",
      table: {
        risk: "Riesgo"
      },
      empty: {
        no_risks: {
          title: "Crea un riesgo para comenzar",
          description: "Rastrea y puntúa riesgos, crea y asigna tareas de mitigación para tu equipo, y gestiona tu registro de riesgos todo en una interfaz simple."
        },
        create_risk: "Crear un riesgo"
      }
    },
    metrics: {
      probability: "Probabilidad",
      impact: "Impacto",
      inherentRisk: "Riesgo Inherente",
      residualRisk: "Riesgo Residual"
    },
    form: {
      update_inherent_risk: "Guardar Riesgo Inherente",
      update_inherent_risk_description: "Actualiza el riesgo inherente del riesgo. Este es el nivel de riesgo antes de aplicar cualquier control.",
      update_inherent_risk_success: "Riesgo inherente actualizado con éxito",
      update_inherent_risk_error: "Error al actualizar el riesgo inherente",
      update_residual_risk: "Guardar Riesgo Residual",
      update_residual_risk_description: "Actualiza el riesgo residual del riesgo. Este es el nivel de riesgo después de aplicar controles.",
      update_residual_risk_success: "Riesgo residual actualizado con éxito",
      update_residual_risk_error: "Error al actualizar el riesgo residual",
      update_risk: "Actualizar Riesgo",
      update_risk_description: "Actualiza el título o la descripción del riesgo.",
      update_risk_success: "Riesgo actualizado con éxito",
      update_risk_error: "Error al actualizar el riesgo",
      create_risk_success: "Riesgo creado con éxito",
      create_risk_error: "Error al crear riesgo",
      risk_details: "Detalles del Riesgo",
      risk_title: "Título del Riesgo",
      risk_title_description: "Ingresa un nombre para el riesgo",
      risk_description: "Descripción",
      risk_description_description: "Ingresa una descripción para el riesgo",
      risk_category: "Categoría",
      risk_category_placeholder: "Selecciona una categoría",
      risk_department: "Departamento",
      risk_department_placeholder: "Selecciona un departamento",
      risk_status: "Estado del Riesgo",
      risk_status_placeholder: "Selecciona un estado de riesgo"
    },
    tasks: {
      title: "Tareas",
      attachments: "Adjuntos",
      overview: "Resumen de Tareas",
      form: {
        title: "Detalles de la Tarea",
        task_title: "Título de la Tarea",
        status: "Estado de la Tarea",
        status_placeholder: "Selecciona un estado de tarea",
        task_title_description: "Ingresa un nombre para la tarea",
        description: "Descripción",
        description_description: "Ingresa una descripción para la tarea",
        due_date: "Fecha de Vencimiento",
        due_date_description: "Selecciona la fecha de vencimiento para la tarea",
        success: "Tarea creada con éxito",
        error: "Error al crear tarea"
      },
      sheet: {
        title: "Crear Tarea",
        update: "Actualizar Tarea",
        update_description: "Actualiza el título o la descripción de la tarea."
      },
      empty: {
        description_create: "Crea una tarea de mitigación para este riesgo, añade un plan de tratamiento y asígnala a un miembro del equipo."
      }
    }
  },
  settings: {
    general: {
      title: "General",
      org_name: "Nombre de la organización",
      org_name_description: "Este es el nombre visible de tu organización. Debes usar el nombre legal de tu organización.",
      org_name_tip: "Por favor, usa un máximo de 32 caracteres.",
      org_website: "Sitio Web de la Organización",
      org_website_description: "Esta es la URL del sitio web oficial de tu organización. Asegúrate de incluir la URL completa con https://.",
      org_website_tip: "Por favor, ingresa una URL válida que incluya https://",
      org_website_error: "Error al actualizar el sitio web de la organización",
      org_website_updated: "Sitio web de la organización actualizado",
      org_delete: "Eliminar organización",
      org_delete_description: "Elimina permanentemente tu organización y todo su contenido de la plataforma Comp AI. Esta acción no es reversible; por favor, procede con precaución.",
      org_delete_alert_title: "¿Está absolutamente seguro?",
      org_delete_alert_description: "Esta acción no se puede deshacer. Esto eliminará permanentemente su organización y eliminará sus datos de nuestros servidores.",
      org_delete_error: "Error al eliminar la organización",
      org_delete_success: "Organización eliminada",
      org_name_updated: "Nombre de la organización actualizado",
      org_name_error: "Error al actualizar el nombre de la organización",
      save_button: "Guardar",
      delete_button: "Eliminar",
      delete_confirm: "ELIMINAR",
      delete_confirm_tip: "Escriba ELIMINAR para confirmar.",
      cancel_button: "Cancelar"
    },
    members: {
      title: "Miembros"
    },
    billing: {
      title: "Facturación"
    }
  },
  user_menu: {
    theme: "Tema",
    language: "Idioma",
    sign_out: "Cerrar sesión",
    account: "Cuenta",
    support: "Soporte",
    settings: "Configuraciones",
    teams: "Equipos"
  },
  frameworks: {
    title: "Marcos",
    controls: {
      title: "Controles",
      description: "Revisar y gestionar controles de cumplimiento",
      table: {
        status: "Estado",
        control: "Control",
        artifacts: "Artefactos",
        actions: "Acciones"
      },
      statuses: {
        not_started: "No iniciado",
        compliant: "Cumplimiento",
        non_compliant: "No cumplimiento"
      }
    }
  },
  vendor: {
    title: "Tablero",
    register_title: "Gestión de Proveedores",
    dashboard: {
      title: "Tablero",
      overview: "Resumen del Proveedor",
      vendor_status: "Estado del Proveedor",
      vendor_category: "Categorías de Proveedores",
      vendors_by_assignee: "Proveedores por Asignado",
      inherent_risk_description: "Nivel de riesgo inicial antes de que se apliquen controles",
      residual_risk_description: "Nivel de riesgo restante después de que se apliquen controles"
    },
    register: {
      title: "Registro de Proveedores",
      table: {
        name: "Nombre",
        category: "Categoría",
        status: "Estado",
        owner: "Propietario"
      }
    },
    category: {
      cloud: "Nube",
      infrastructure: "Infraestructura",
      software_as_a_service: "SaaS",
      finance: "Finanzas",
      marketing: "Marketing",
      sales: "Ventas",
      hr: "RRHH",
      other: "Otro"
    },
    vendors: "proveedores",
    form: {
      vendor_details: "Detalles del Proveedor",
      vendor_name: "Nombre",
      vendor_name_placeholder: "Ingrese el nombre del proveedor",
      vendor_website: "Sitio web",
      vendor_website_placeholder: "Ingrese el sitio web del proveedor",
      vendor_description: "Descripción",
      vendor_description_placeholder: "Ingrese la descripción del proveedor",
      vendor_category: "Categoría",
      vendor_category_placeholder: "Seleccione la categoría",
      vendor_status: "Estado",
      vendor_status_placeholder: "Seleccione el estado",
      create_vendor_success: "Proveedor creado con éxito",
      create_vendor_error: "Error al crear el proveedor",
      update_vendor_success: "Proveedor actualizado con éxito",
      update_vendor_error: "Error al actualizar el proveedor",
      contacts: "Contactos del Proveedor",
      contact_name: "Nombre del Contacto",
      contact_email: "Correo Electrónico del Contacto",
      contact_role: "Rol del Contacto",
      add_contact: "Agregar Contacto",
      new_contact: "Nuevo Contacto",
      min_one_contact_required: "Un proveedor debe tener al menos un contacto"
    },
    empty_states: {
      no_vendors: {
        title: "Aún no hay proveedores",
        description: "Comience creando su primer proveedor"
      },
      no_results: {
        title: "No se encontraron resultados",
        description: "No hay proveedores que coincidan con su búsqueda",
        description_with_filters: "Intente ajustar sus filtros"
      }
    }
  }
} as const;
