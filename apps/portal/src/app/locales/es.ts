export default {
  auth: {
    title: "Portal del Empleado",
    description: "Ingresa tu correo electrónico para recibir una contraseña de un solo uso.",
    options: "Más opciones",
    email: {
      otp_sent: "Contraseña de un solo uso enviada",
      otp_description: "Revisa tu correo electrónico para ver la contraseña de un solo uso",
      otp_try_again: "Intentar de nuevo",
      placeholder: "Tu correo electrónico del trabajo",
      button: "Continuar",
    },
  },
  powered_by: {
    title: "Comp AI - Plataforma de Cumplimiento OSS",
    description:
      "Obtén el cumplimiento de SOC 2, ISO 27001 y GDPR en semanas, no meses. Código abierto, registro instantáneo, prueba gratuita.",
    learn_more: "Comienza la Prueba Gratuita y Obtén Cumplimiento",
    learn_more_link: "https://trycomp.ai",
  },
  user_menu: {
    sign_out: "Cerrar Sesión",
  },
  not_found: {
    title: "No Encontrado",
    description: "La página que estás buscando no existe.",
    return: "Volver a la página principal",
  },
  sidebar: {
    dashboard: "Vista General del Portal del Empleado",
  },
} as const;
