export default {
  auth: {
    title: "Employee Portal",
    description: "Enter your email and one time password to continue",
    options: "More options",
    email: {
      otp_sent: "One time password sent",
      otp_description: "Check your email for the one time password",
      otp_try_again: "Try again",
      placeholder: "Your work email",
      button: "Get one time password",
    },
  },
  not_found: {
    title: "Not Found",
    description: "The page you are looking for does not exist.",
    return: "Return to the home page",
  },
} as const;
