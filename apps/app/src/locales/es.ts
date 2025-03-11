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
      complete: "Completar",
      addNew: "Agregar nuevo"
    },
    assignee: {
      label: "Asignado",
      placeholder: "Seleccionar asignado"
    },
    date: {
      pick: "Elegir una fecha",
      due_date: "Fecha de vencimiento"
    },
    status: {
      open: "Abierto",
      pending: "Pendiente",
      closed: "Cerrado",
      archived: "Archivado",
      compliant: "Cumplidor",
      non_compliant: "No cumplidor",
      not_started: "No iniciado",
      in_progress: "En progreso",
      published: "Publicado",
      needs_review: "Necesita revisión",
      draft: "Borrador",
      not_assessed: "No evaluado",
      assessed: "Evaluado",
      active: "Activo",
      inactive: "Inactivo",
      title: "Estado"
    },
    filters: {
      clear: "Limpiar filtros",
      search: "Buscar...",
      status: "Estado",
      department: "Departamento",
      owner: {
        label: "Asignado",
        placeholder: "Filtrar por asignado"
      }
    },
    table: {
      title: "Título",
      status: "Estado",
      assigned_to: "Asignado a",
      due_date: "Fecha de vencimiento",
      last_updated: "Última actualización",
      no_results: "No se encontraron resultados"
    },
    empty_states: {
      no_results: {
        title: "No se encontraron resultados",
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
      description: "Agrega un comentario utilizando el formulario a continuación.",
      add: "Nuevo comentario",
      "new": "Nuevo comentario",
      save: "Guardar comentario",
      success: "Comentario agregado con éxito",
      error: "Error al agregar comentario",
      placeholder: "Escribe tu comentario aquí...",
      empty: {
        title: "No hay comentarios aún",
        description: "Sé el primero en agregar un comentario"
      }
    },
    attachments: {
      title: "Adjuntos",
      description: "Agrega un archivo haciendo clic en 'Agregar adjunto'.",
      upload: "Subir adjunto",
      upload_description: "Sube un adjunto o agrega un enlace a un recurso externo.",
      drop: "Suelta los archivos aquí",
      drop_description: "Suelta archivos aquí o haz clic para elegir archivos de tu dispositivo.",
      drop_files_description: "Los archivos pueden ser de hasta ",
      empty: {
        title: "No hay adjuntos",
        description: "Agrega un archivo haciendo clic en 'Agregar adjunto'."
      },
      toasts: {
        error: "Algo salió mal, por favor intenta de nuevo.",
        error_uploading_files: "No se puede subir más de 1 archivo a la vez",
        error_uploading_files_multiple: "No se pueden subir más de 10 archivos",
        error_no_files_selected: "No se han seleccionado archivos",
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
    },
    notifications: {
      inbox: "Bandeja de entrada",
      archive: "Archivo",
      archive_all: "Archivar todo",
      no_notifications: "No hay nuevas notificaciones"
    },
    edit: "Editar",
    errors: {
      unexpected_error: "Ocurrió un error inesperado"
    },
    description: "Descripción",
    last_updated: "Última actualización",
    frequency: {
      daily: "Diario",
      weekly: "Semanal",
      monthly: "Mensual",
      quarterly: "Trimestral",
      yearly: "Anual"
    },
    upload: {
      fileUpload: {
        uploadingText: "Subiendo...",
        uploadingFile: "Subiendo archivo...",
        dropFileHere: "Suelta el archivo aquí",
        dropFileHereAlt: "Suelta el archivo aquí",
        releaseToUpload: "Suelta para subir",
        addFiles: "Agregar archivos",
        uploadAdditionalEvidence: "Sube un archivo o documento",
        dragDropOrClick: "Arrastra y suelta o haz clic para buscar",
        dragDropOrClickToSelect: "Arrastra y suelta o haz clic para seleccionar archivo",
        maxFileSize: "Tamaño máximo del archivo: {size}MB"
      },
      fileUrl: {
        additionalLinks: "Enlaces adicionales",
        add: "Agregar",
        linksAdded: "{count} enlace{s} añadidos",
        enterUrl: "Ingresa URL",
        addAnotherLink: "Agregar otro enlace",
        saveLinks: "Guardar enlaces",
        urlBadge: "URL",
        copyLink: "Copiar enlace",
        openLink: "Abrir enlace",
        deleteLink: "Eliminar enlace"
      },
      fileCard: {
        preview: "Vista previa",
        filePreview: "Vista previa del archivo: {fileName}",
        previewNotAvailable: "Vista previa no disponible para este tipo de archivo",
        openFile: "Abrir archivo",
        deleteFile: "Eliminar archivo",
        deleteFileConfirmTitle: "Eliminar archivo",
        deleteFileConfirmDescription: "Esta acción no se puede deshacer. El archivo será eliminado permanentemente."
      },
      fileSection: {
        filesUploaded: "{count} archivos subidos"
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
      send: "Enviar comentarios"
    }
  },
  not_found: {
    title: "404 - Página no encontrada",
    description: "La página que buscas no existe.",
    "return": "Volver al panel de control"
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
    risk: "Gestión de Riesgos",
    vendors: "Proveedores",
    integrations: "Integraciones",
    settings: "Configuraciones",
    evidence: "Tareas de Evidencia",
    people: "Personas",
    tests: "Pruebas en la Nube"
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
        label: "Sitio web",
        placeholder: "El sitio web de tu organización"
      },
      subdomain: {
        label: "Subdominio",
        placeholder: "ejemplo"
      },
      fullName: {
        label: "Tu Nombre",
        placeholder: "Tu nombre completo"
      }
    },
    success: "¡Gracias, estás listo!",
    error: "Algo salió mal, por favor intenta de nuevo.",
    unavailable: "No disponible",
    check_availability: "Verificando disponibilidad",
    available: "Disponible"
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
      title: "Panel de Control",
      all: "Todas las Políticas",
      policy_status: "Política por Estado",
      policies_by_assignee: "Políticas por Asignado",
      policies_by_framework: "Políticas por Marco",
      sub_pages: {
        overview: "Resumen",
        edit_policy: "Editar Política"
      }
    },
    table: {
      name: "Nombre de la política",
      statuses: {
        draft: "Borrador",
        published: "Publicado",
        archived: "Archivado"
      },
      filters: {
        owner: {
          label: "Responsable",
          placeholder: "Filtrar por responsable"
        }
      }
    },
    filters: {
      search: "Buscar políticas...",
      all: "Todas las políticas"
    },
    status: {
      draft: "Borrador",
      published: "Publicado",
      needs_review: "Necesita revisión",
      archived: "Archivado"
    },
    policies: "políticas",
    title: "Políticas",
    create_new: "Crear nueva política",
    search_placeholder: "Buscar políticas...",
    status_filter: "Filtrar por estado",
    all_statuses: "Todos los estados",
    no_policies_title: "No hay políticas aún",
    no_policies_description: "Comienza creando tu primera política",
    create_first: "Crear primera política",
    no_description: "No se proporcionó descripción",
    last_updated: "Última actualización: {{date}}",
    save: "Guardar",
    saving: "Guardando...",
    saved_success: "Política guardada con éxito",
    saved_error: "Error al guardar la política",
    overview: {
      title: "Resumen de la Política",
      form: {
        update_policy: "Actualizar Política",
        update_policy_description: "Actualiza el título o la descripción de la política.",
        update_policy_success: "Política actualizada con éxito",
        update_policy_error: "Error al actualizar la política",
        update_policy_title: "Nombre de la Política",
        review_frequency: "Frecuencia de Revisión",
        review_frequency_placeholder: "Selecciona una frecuencia de revisión",
        review_date: "Fecha de revisión",
        review_date_placeholder: "Seleccionar una fecha de revisión",
        required_to_sign: "Requerido que sea firmado por los empleados",
        signature_required: "Requerir la firma de los empleados",
        signature_not_required: "No pedir a los empleados que firmen",
        signature_requirement: "Requisito de firma",
        signature_requirement_placeholder: "Seleccionar requisito de firma"
      }
    }
  },
  evidence_tasks: {
    evidence_tasks: "Tareas de evidencia",
    overview: "Resumen"
  },
  risk: {
    risks: "riesgos",
    overview: "Resumen",
    create: "Crear nuevo riesgo",
    vendor: {
      title: "Gestión de proveedores",
      dashboard: {
        title: "Tablero de proveedores",
        overview: "Resumen del proveedor",
        vendor_status: "Estado del proveedor",
        vendor_category: "Categorías de proveedores",
        vendors_by_assignee: "Proveedores por responsable",
        inherent_risk_description: "Nivel de riesgo inicial antes de aplicar controles",
        residual_risk_description: "Nivel de riesgo restante después de aplicar controles"
      },
      register: {
        title: "Registro de proveedores",
        table: {
          name: "Nombre",
          category: "Categoría",
          status: "Estado",
          owner: "Propietario"
        }
      },
      assessment: {
        title: "Evaluación del proveedor",
        update_success: "Evaluación de riesgo del proveedor actualizada con éxito",
        update_error: "Error al actualizar la evaluación de riesgo del proveedor",
        inherent_risk: "Riesgo inherente",
        residual_risk: "Riesgo residual"
      },
      form: {
        vendor_details: "Detalles del proveedor",
        vendor_name: "Nombre",
        vendor_name_placeholder: "Ingrese el nombre del proveedor",
        vendor_website: "Sitio web",
        vendor_website_placeholder: "Ingrese el sitio web del proveedor",
        vendor_description: "Descripción",
        vendor_description_placeholder: "Ingrese la descripción del proveedor",
        vendor_category: "Categoría",
        vendor_category_placeholder: "Seleccionar categoría",
        vendor_status: "Estado",
        vendor_status_placeholder: "Seleccionar estado",
        create_vendor_success: "Proveedor creado con éxito",
        create_vendor_error: "Error al crear el proveedor",
        update_vendor: "Actualizar proveedor",
        update_vendor_success: "Proveedor actualizado con éxito",
        update_vendor_error: "Error al actualizar el proveedor",
        add_comment: "Agregar comentario"
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
          title: "No hay proveedores aún",
          description: "Comienza creando tu primer proveedor"
        },
        no_results: {
          title: "No se encontraron resultados",
          description: "No hay proveedores que coincidan con tu búsqueda",
          description_with_filters: "Intenta ajustar tus filtros"
        }
      },
      actions: {
        create: "Crear proveedor"
      },
      status: {
        not_assessed: "No evaluado",
        in_progress: "En progreso",
        assessed: "Evaluado"
      },
      category: {
        cloud: "Nube",
        infrastructure: "Infraestructura",
        software_as_a_service: "Software como servicio",
        finance: "Finanzas",
        marketing: "Marketing",
        sales: "Ventas",
        hr: "RRHH",
        other: "Otro"
      },
      risk_level: {
        low: "Riesgo bajo",
        medium: "Riesgo medio",
        high: "Riesgo alto",
        unknown: "Riesgo desconocido"
      }
    },
    dashboard: {
      title: "Tablero",
      overview: "Resumen de riesgos",
      risk_status: "Estado del Riesgo",
      risks_by_department: "Riesgos por Departamento",
      risks_by_assignee: "Riesgos por Asignado",
      inherent_risk_description: "El riesgo inherente se calcula como probabilidad * impacto. Calculado antes de que se apliquen controles.",
      residual_risk_description: "El riesgo residual se calcula como probabilidad * impacto. Este es el nivel de riesgo después de que se aplican controles.",
      risk_assessment_description: "Comparar los niveles de riesgo inherente y residual"
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
      update_inherent_risk_description: "Actualiza el riesgo inherente del riesgo. Este es el nivel de riesgo antes de que se apliquen controles.",
      update_inherent_risk_success: "Riesgo inherente actualizado con éxito",
      update_inherent_risk_error: "Error al actualizar el riesgo inherente",
      update_residual_risk: "Guardar Riesgo Residual",
      update_residual_risk_description: "Actualiza el riesgo residual del riesgo. Este es el nivel de riesgo después de que se aplican controles.",
      update_residual_risk_success: "Riesgo residual actualizado con éxito",
      update_residual_risk_error: "Error al actualizar el riesgo residual",
      update_risk: "Actualizar Riesgo",
      update_risk_description: "Actualiza el título o la descripción del riesgo.",
      update_risk_success: "Riesgo actualizado con éxito",
      update_risk_error: "Error al actualizar el riesgo",
      create_risk_success: "Riesgo creado con éxito",
      create_risk_error: "Error al crear el riesgo",
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
        error: "Error al crear la tarea"
      },
      sheet: {
        title: "Crear Tarea",
        update: "Actualizar Tarea",
        update_description: "Actualiza el título o la descripción de la tarea."
      },
      empty: {
        description_create: "Crea una tarea de mitigación para este riesgo, añade un plan de tratamiento y asígnalo a un miembro del equipo."
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
      org_website_tip: "Por favor, ingresa una URL válida incluyendo https://",
      org_website_error: "Error al actualizar el sitio web de la organización",
      org_website_updated: "Sitio web de la organización actualizado",
      org_delete: "Eliminar organización",
      org_delete_description: "Elimina permanentemente tu organización y todo su contenido de la plataforma Comp AI. Esta acción no es reversible - por favor, continúa con precaución.",
      org_delete_alert_title: "¿Estás absolutamente seguro?",
      org_delete_alert_description: "Esta acción no se puede deshacer. Esto eliminará permanentemente tu organización y eliminará tus datos de nuestros servidores.",
      org_delete_error: "Error al eliminar la organización",
      org_delete_success: "Organización eliminada",
      org_name_updated: "Nombre de la organización actualizado",
      org_name_error: "Error al actualizar el nombre de la organización",
      save_button: "Guardar",
      delete_button: "Eliminar",
      delete_confirm: "ELIMINAR",
      delete_confirm_tip: "Escribe ELIMINAR para confirmar.",
      cancel_button: "Cancelar"
    },
    members: {
      title: "Miembros"
    },
    billing: {
      title: "Facturación"
    },
    api_keys: {
      title: "Claves API",
      description: "Administra las claves API para el acceso programático a los datos de tu organización.",
      list_title: "Claves API",
      list_description: "Las claves API permiten el acceso seguro a los datos de tu organización a través de nuestra API.",
      create: "Nueva clave de API",
      create_title: "Nueva clave de API",
      create_description: "Crea una nueva clave API para el acceso programático a los datos de tu organización.",
      created_title: "Clave API creada",
      created_description: "Tu clave API ha sido creada. Asegúrate de copiarla ahora, ya que no podrás volver a verla.",
      name: "Nombre",
      name_label: "Nombre",
      name_placeholder: "Ingresa un nombre para esta clave API",
      expiration: "Expiración",
      expiration_placeholder: "Selecciona la expiración",
      expires_label: "Expira",
      expires_placeholder: "Selecciona la expiración",
      expires_30days: "30 días",
      expires_90days: "90 días",
      expires_1year: "1 año",
      expires_never: "Nunca",
      thirty_days: "30 días",
      ninety_days: "90 días",
      one_year: "1 año",
      your_key: "Tu clave API",
      api_key: "Clave API",
      save_warning: "Esta clave solo se mostrará una vez. Asegúrate de copiarla ahora.",
      copied: "Clave API copiada al portapapeles",
      close_confirm: "¿Estás seguro de que deseas cerrar? No podrás volver a ver esta clave API.",
      revoke_confirm: "¿Estás seguro de que deseas revocar esta clave API? Esta acción no se puede deshacer.",
      revoke_title: "Revocar clave API",
      revoke: "Revocar",
      created: "Creada",
      expires: "Expira",
      last_used: "Último uso",
      actions: "Acciones",
      never: "Nunca",
      never_used: "Nunca utilizada",
      no_keys: "No se encontraron claves API. Crea una para comenzar.",
      security_note: "Las claves API proporcionan acceso completo a los datos de tu organización. Mantenlas seguras y cámbialas regularmente.",
      fetch_error: "Error al obtener las claves API",
      create_error: "Error al crear la clave API",
      revoked_success: "Clave API revocada con éxito",
      revoked_error: "Error al revocar la clave API",
      done: "Hecho"
    },
    team: {
      tabs: {
        members: "Miembros del equipo",
        invite: "Invitar miembros"
      },
      members: {
        title: "Miembros del equipo",
        empty: {
          no_organization: {
            title: "Sin organización",
            description: "No eres parte de ninguna organización"
          },
          no_members: {
            title: "Sin miembros",
            description: "No hay miembros activos en tu organización"
          }
        },
        role: {
          owner: "Propietario",
          admin: "Administrador",
          member: "Miembro",
          viewer: "Espectador"
        }
      },
      invitations: {
        title: "Invitaciones pendientes",
        description: "Usuarios que han sido invitados pero aún no han aceptado",
        empty: {
          no_organization: {
            title: "Sin organización",
            description: "No eres parte de ninguna organización"
          },
          no_invitations: {
            title: "Sin invitaciones pendientes",
            description: "No hay invitaciones pendientes"
          }
        },
        invitation_sent: "Invitación enviada",
        actions: {
          resend: "Reenviar invitación",
          sending: "Enviando invitación",
          revoke: "Revocar",
          revoke_title: "Revocar invitación",
          revoke_description_prefix: "¿Estás seguro de que deseas revocar la invitación para",
          revoke_description_suffix: "Esta acción no se puede deshacer."
        },
        toast: {
          resend_success_prefix: "Se ha enviado un correo electrónico de invitación a",
          resend_error: "Error al enviar la invitación",
          resend_unexpected: "Ocurrió un error inesperado al enviar la invitación",
          revoke_success_prefix: "Invitación a",
          revoke_success_suffix: "ha sido revocada",
          revoke_error: "Error al revocar la invitación",
          revoke_unexpected: "Ocurrió un error inesperado al revocar la invitación"
        }
      },
      invite: {
        title: "Invitar a un miembro del equipo",
        description: "Enviar una invitación a un nuevo miembro del equipo para unirse a tu organización",
        form: {
          email: {
            label: "Correo electrónico",
            placeholder: "miembro@ejemplo.com",
            error: "Por favor, introduce una dirección de correo electrónico válida"
          },
          role: {
            label: "Rol",
            placeholder: "Seleccionar un rol",
            error: "Por favor, selecciona un rol"
          },
          department: {
            label: "Departamento",
            placeholder: "Seleccionar un departamento",
            error: "Por favor, selecciona un departamento"
          },
          departments: {
            none: "Ninguno",
            it: "TI",
            hr: "RRHH",
            admin: "Administrador",
            gov: "Gobierno",
            itsm: "ITSM",
            qms: "QMS"
          }
        },
        button: {
          send: "Enviar invitación",
          sending: "Enviando invitación...",
          sent: "Invitación enviada"
        },
        toast: {
          error: "Error al enviar la invitación",
          unexpected: "Ocurrió un error inesperado al enviar la invitación"
        }
      },
      member_actions: {
        actions: "Acciones",
        change_role: "Cambiar rol",
        remove_member: "Eliminar miembro",
        remove_confirm: {
          title: "Eliminar miembro del equipo",
          description_prefix: "¿Estás seguro de que deseas eliminar a",
          description_suffix: "Esta acción no se puede deshacer."
        },
        role_dialog: {
          title: "Cambiar rol",
          description_prefix: "Actualizar el rol de",
          role_label: "Rol",
          role_placeholder: "Seleccionar un rol",
          role_descriptions: {
            admin: "Los administradores pueden gestionar miembros del equipo y configuraciones.",
            member: "Los miembros pueden usar todas las funciones pero no pueden gestionar a los miembros del equipo.",
            viewer: "Los espectadores solo pueden ver el contenido sin hacer cambios."
          },
          cancel: "Cancelar",
          update: "Actualizar rol"
        },
        toast: {
          remove_success: "ha sido eliminado de la organización",
          remove_error: "Error al eliminar al miembro",
          remove_unexpected: "Ocurrió un error inesperado al eliminar al miembro",
          update_role_success: "ha tenido su rol actualizado a",
          update_role_error: "Error al actualizar el rol del miembro",
          update_role_unexpected: "Ocurrió un error inesperado al actualizar el rol del miembro"
        }
      }
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
        not_started: "No Comenzado",
        completed: "Completado",
        in_progress: "En Progreso"
      }
    },
    overview: {
      error: "Error al cargar marcos",
      loading: "Cargando marcos...",
      empty: {
        title: "No se han seleccionado marcos",
        description: "Selecciona marcos para comenzar tu viaje de cumplimiento"
      },
      progress: {
        title: "Progreso del Marco",
        empty: {
          title: "Aún no hay marcos",
          description: "Comienza agregando un marco de cumplimiento para rastrear tu progreso",
          action: "Agregar Marco"
        }
      },
      grid: {
        welcome: {
          title: "Bienvenido a Comp AI",
          description: "Comienza seleccionando los marcos de cumplimiento que te gustaría implementar. Te ayudaremos a gestionar y rastrear tu viaje de cumplimiento a través de múltiples estándares.",
          action: "Comenzar"
        },
        title: "Seleccionar Marcos",
        version: "Versión",
        actions: {
          clear: "Borrar",
          confirm: "Confirmar Selección"
        }
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
      vendor_name_placeholder: "Ingresa el nombre del proveedor",
      vendor_website: "Sitio web",
      vendor_website_placeholder: "Ingresa el sitio web del proveedor",
      vendor_description: "Descripción",
      vendor_description_placeholder: "Ingresa la descripción del proveedor",
      vendor_category: "Categoría",
      vendor_category_placeholder: "Seleccionar categoría",
      vendor_status: "Estado",
      vendor_status_placeholder: "Seleccionar estado",
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
        description: "Comienza creando tu primer proveedor"
      },
      no_results: {
        title: "No se encontraron resultados",
        description: "Ningún proveedor coincide con tu búsqueda",
        description_with_filters: "Intenta ajustar tus filtros"
      }
    }
  },
  people: {
    title: "Personas",
    details: {
      taskProgress: "Progreso de la Tarea",
      tasks: "Tareas",
      noTasks: "No hay tareas asignadas aún"
    },
    description: "Gestiona a los miembros de tu equipo y sus roles.",
    filters: {
      search: "Buscar personas...",
      role: "Filtrar por rol"
    },
    actions: {
      invite: "Agregar Empleado",
      clear: "Limpiar filtros"
    },
    table: {
      name: "Nombre",
      email: "Correo Electrónico",
      department: "Departamento",
      externalId: "ID Externo",
      status: "Estado"
    },
    empty: {
      no_employees: {
        title: "No hay empleados aún",
        description: "Comienza invitando a tu primer miembro del equipo."
      },
      no_results: {
        title: "No se encontraron resultados",
        description: "No hay empleados que coincidan con tu búsqueda",
        description_with_filters: "Intenta ajustar tus filtros"
      }
    },
    invite: {
      title: "Agregar Empleado",
      description: "Agrega un empleado a tu organización.",
      email: {
        label: "Dirección de correo electrónico",
        placeholder: "Ingresa la dirección de correo electrónico"
      },
      role: {
        label: "Rol",
        placeholder: "Selecciona un rol"
      },
      name: {
        label: "Nombre",
        placeholder: "Ingresa el nombre"
      },
      department: {
        label: "Departamento",
        placeholder: "Selecciona un departamento"
      },
      submit: "Agregar Empleado",
      success: "Empleado agregado con éxito",
      error: "Error al agregar empleado"
    }
  },
  errors: {
    unexpected: "Algo salió mal, por favor intenta de nuevo"
  },
  sub_pages: {
    risk: {
      overview: "Gestión de Riesgos",
      register: "Registro de Riesgos",
      risk_overview: "Resumen de Riesgos",
      risk_comments: "Comentarios sobre Riesgos",
      tasks: {
        task_overview: "Resumen de Tareas"
      }
    },
    policies: {
      all: "Todas las Políticas",
      editor: "Editor de Políticas",
      policy_details: "Detalles de la Política"
    },
    people: {
      all: "Personas",
      employee_details: "Detalles del Empleado"
    },
    settings: {
      members: "Miembros del Equipo"
    },
    frameworks: {
      overview: "Marcos"
    },
    evidence: {
      title: "Evidencia",
      list: "Lista de Evidencia",
      overview: "Resumen de Evidencia"
    },
    tests: {
      overview: "Pruebas en la Nube",
      test_details: "Detalles de la Prueba"
    }
  },
  editor: {
    ai: {
      thinking: "La IA está pensando",
      thinking_spinner: "La IA está pensando",
      edit_or_generate: "Editar o generar...",
      tell_ai_what_to_do_next: "Dile a la IA qué hacer a continuación",
      request_limit_reached: "Ha alcanzado su límite de solicitudes para el día."
    },
    ai_selector: {
      improve: "Mejorar la redacción",
      fix: "Corregir la gramática",
      shorter: "Hacer más corto",
      longer: "Hacer más largo",
      "continue": "Continuar escribiendo",
      replace: "Reemplazar selección",
      insert: "Insertar abajo",
      discard: "Descartar"
    }
  },
  evidence: {
    title: "Evidencia",
    list: "Toda la Evidencia",
    overview: "Resumen de Evidencia",
    edit: "Evidencia Cargada",
    dashboard: {
      layout: "Tablero",
      layout_back_button: "Atrás",
      title: "Tablero de Evidencia",
      by_department: "Por Departamento",
      by_assignee: "Por Asignado",
      by_framework: "Por Marco"
    },
    items: "elementos",
    status: {
      up_to_date: "Actualizado",
      needs_review: "Necesita Revisión",
      draft: "Borrador",
      empty: "Vacío"
    },
    departments: {
      none: "Sin Categorizar",
      admin: "Administración",
      gov: "Gobernanza",
      hr: "Recursos Humanos",
      it: "Tecnologías de la Información",
      itsm: "Gestión de Servicios de TI",
      qms: "Gestión de Calidad"
    },
    details: {
      review_section: "Revisar Información",
      content: "Contenido de Evidencia"
    }
  },
  upload: {
    fileSection: {
      filesUploaded: "{count} archivo(s) subido(s)",
      upload: "{count} archivo(s) subido(s)"
    },
    fileUpload: {
      uploadingText: "Subiendo...",
      dropFileHere: "Suelta el archivo aquí",
      releaseToUpload: "Suelta para subir",
      addFiles: "Agregar Archivos",
      uploadAdditionalEvidence: "Subir un archivo",
      dragDropOrClick: "Arrastra y suelta o haz clic para subir",
      dropFileHereAlt: "Suelta el archivo aquí",
      dragDropOrClickToSelect: "Arrastra y suelta un archivo aquí, o haz clic para seleccionar",
      maxFileSize: "Tamaño máximo de archivo: {size}MB",
      uploadingFile: "Subiendo archivo..."
    },
    fileCard: {
      preview: "Vista previa",
      previewNotAvailable: "Vista previa no disponible. Haz clic en el botón de descarga para ver el archivo.",
      filePreview: "Vista previa del archivo: {fileName}",
      openFile: "Abrir archivo",
      deleteFile: "Eliminar archivo",
      deleteFileConfirmTitle: "Eliminar Archivo",
      deleteFileConfirmDescription: "¿Estás seguro de que deseas eliminar este archivo? Esta acción no se puede deshacer."
    },
    fileUrl: {
      additionalLinks: "Enlaces Adicionales",
      add: "Agregar",
      linksAdded: "{count} enlace{s} añadido{s}",
      enterUrl: "Ingresa la URL",
      addAnotherLink: "Agregar Otro Enlace",
      saveLinks: "Guardar Enlaces",
      urlBadge: "URL",
      copyLink: "Copiar enlace",
      openLink: "Abrir enlace",
      deleteLink: "Eliminar enlace"
    }
  },
  tests: {
    name: "Pruebas en la Nube",
    title: "Pruebas en la Nube",
    actions: {
      create: "Agregar Prueba en la Nube",
      clear: "Limpiar filtros",
      refresh: "Actualizar",
      refresh_success: "Pruebas actualizadas con éxito",
      refresh_error: "Error al actualizar las pruebas"
    },
    empty: {
      no_tests: {
        title: "No hay pruebas en la nube aún",
        description: "Comienza creando tu primera prueba en la nube."
      },
      no_results: {
        title: "No se encontraron resultados",
        description: "No hay pruebas que coincidan con tu búsqueda",
        description_with_filters: "Intenta ajustar tus filtros"
      }
    },
    filters: {
      search: "Buscar pruebas...",
      role: "Filtrar por proveedor"
    },
    register: {
      title: "Agregar Prueba en la Nube",
      description: "Configura una nueva prueba de cumplimiento en la nube.",
      submit: "Crear Prueba",
      success: "Prueba creada con éxito",
      invalid_json: "Configuración JSON inválida proporcionada",
      title_field: {
        label: "Título de la Prueba",
        placeholder: "Ingresa el título de la prueba"
      },
      description_field: {
        label: "Descripción",
        placeholder: "Ingresa la descripción de la prueba"
      },
      provider: {
        label: "Proveedor de Nube",
        placeholder: "Selecciona el proveedor de nube"
      },
      config: {
        label: "Configuración de la Prueba",
        placeholder: "Ingresa la configuración JSON para la prueba"
      },
      auth_config: {
        label: "Configuración de Autenticación",
        placeholder: "Ingresa la configuración JSON de autenticación"
      }
    },
    table: {
      title: "Título",
      provider: "Proveedor",
      severity: "Severidad",
      result: "Resultado",
      createdAt: "Creado En",
      assignedUser: "Usuario Asignado",
      assignedUserEmpty: "No Asignado",
      no_results: "No se encontraron resultados",
      status: "Estado"
    },
    dashboard: {
      overview: "Resumen",
      all: "Todas las pruebas",
      tests_by_assignee: "Pruebas por Asignado",
      passed: "Aprobado",
      failed: "Fallido",
      severity_distribution: "Distribución de la Severidad de las Pruebas"
    },
    severity: {
      low: "Bajo",
      medium: "Medio",
      high: "Alto",
      critical: "Crítico"
    }
  },
  vendors: {
    title: "Proveedores",
    register: {
      title: "Registro de proveedores"
    },
    dashboard: {
      title: "Resumen de proveedores"
    }
  },
  dashboard: {
    risk_status: "Estado de riesgo",
    risks_by_department: "Riesgos por departamento",
    vendor_status: "Estado del proveedor",
    vendors_by_category: "Proveedores por categoría"
  },
  team: {
    tabs: {
      members: "Miembros del equipo",
      invite: "Invitar miembros"
    },
    members: {
      title: "Miembros del equipo",
      empty: {
        no_organization: {
          title: "Sin organización",
          description: "No eres parte de ninguna organización"
        },
        no_members: {
          title: "Sin miembros",
          description: "No hay miembros activos en tu organización"
        }
      },
      role: {
        owner: "Propietario",
        admin: "Administrador",
        member: "Miembro",
        viewer: "Espectador"
      }
    },
    invitations: {
      title: "Invitaciones pendientes",
      description: "Usuarios que han sido invitados pero aún no han aceptado",
      empty: {
        no_organization: {
          title: "Sin organización",
          description: "No eres parte de ninguna organización"
        },
        no_invitations: {
          title: "Sin invitaciones pendientes",
          description: "No hay invitaciones pendientes"
        }
      },
      invitation_sent: "Invitación enviada",
      actions: {
        resend: "Reenviar invitación",
        sending: "Enviando invitación",
        revoke: "Revocar",
        revoke_title: "Revocar invitación",
        revoke_description_prefix: "¿Estás seguro de que deseas revocar la invitación para",
        revoke_description_suffix: "Esta acción no se puede deshacer."
      },
      toast: {
        resend_success_prefix: "Se ha enviado un correo electrónico de invitación a",
        resend_error: "Error al enviar la invitación",
        resend_unexpected: "Ocurrió un error inesperado al enviar la invitación",
        revoke_success_prefix: "Invitación a",
        revoke_success_suffix: "ha sido revocada",
        revoke_error: "Error al revocar la invitación",
        revoke_unexpected: "Ocurrió un error inesperado al revocar la invitación"
      }
    },
    invite: {
      title: "Invitar a un miembro del equipo",
      description: "Enviar una invitación a un nuevo miembro del equipo para unirse a tu organización",
      form: {
        email: {
          label: "Correo electrónico",
          placeholder: "miembro@ejemplo.com",
          error: "Por favor, introduce una dirección de correo electrónico válida"
        },
        role: {
          label: "Rol",
          placeholder: "Selecciona un rol",
          error: "Por favor, selecciona un rol"
        },
        department: {
          label: "Departamento",
          placeholder: "Selecciona un departamento",
          error: "Por favor, selecciona un departamento"
        },
        departments: {
          none: "Ninguno",
          it: "TI",
          hr: "RRHH",
          admin: "Administrador",
          gov: "Gobierno",
          itsm: "ITSM",
          qms: "QMS"
        }
      },
      button: {
        send: "Enviar invitación",
        sending: "Enviando invitación...",
        sent: "Invitación enviada"
      },
      toast: {
        error: "Error al enviar la invitación",
        unexpected: "Ocurrió un error inesperado al enviar la invitación"
      }
    },
    member_actions: {
      actions: "Acciones",
      change_role: "Cambiar rol",
      remove_member: "Eliminar miembro",
      remove_confirm: {
        title: "Eliminar miembro del equipo",
        description_prefix: "¿Estás seguro de que deseas eliminar a",
        description_suffix: "Esta acción no se puede deshacer."
      },
      role_dialog: {
        title: "Cambiar rol",
        description_prefix: "Actualizar el rol de",
        role_label: "Rol",
        role_placeholder: "Selecciona un rol",
        role_descriptions: {
          admin: "Los administradores pueden gestionar a los miembros del equipo y la configuración.",
          member: "Los miembros pueden usar todas las funciones pero no pueden gestionar a los miembros del equipo.",
          viewer: "Los espectadores solo pueden ver el contenido sin realizar cambios."
        },
        cancel: "Cancelar",
        update: "Actualizar rol"
      },
      toast: {
        remove_success: "ha sido eliminado de la organización",
        remove_error: "Error al eliminar al miembro",
        remove_unexpected: "Ocurrió un error inesperado al eliminar al miembro",
        update_role_success: "ha tenido su rol actualizado a",
        update_role_error: "Error al actualizar el rol del miembro",
        update_role_unexpected: "Ocurrió un error inesperado al actualizar el rol del miembro"
      }
    }
  }
} as const;
