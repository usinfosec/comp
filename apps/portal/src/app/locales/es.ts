export default {
  auth: {
    title: "Portal del Empleado",
    description: "Ingresa tu correo electrónico y contraseña de un solo uso para continuar",
    options: "Más opciones",
    email: {
      otp_sent: "Contraseña de un solo uso enviada",
      otp_description: "Revisa tu correo electrónico para ver la contraseña de un solo uso",
      otp_try_again: "Intentar de nuevo",
      placeholder: "Tu correo electrónico del trabajo",
      button: "Obtener contraseña de un solo uso",
    },
  },
  not_found: {
    title: "No Encontrado",
    description: "La página que buscas no existe.",
    return: "Volver a la página principal",
  },
} as const;
