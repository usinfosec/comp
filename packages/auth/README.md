# @comp/auth

An authentication package built on top of Better Auth.

## Installation

```bash
npm install @comp/auth
```

## Usage

### Default Usage

The package exports a pre-configured `auth` instance that follows these rules for the secret:

- First tries `process.env.BETTER_AUTH_SECRET`
- Then tries `process.env.AUTH_SECRET`
- In development, falls back to a default secret
- In production, throws an error if no secret is provided

```typescript
import { auth } from "@comp/auth";

// Use auth as normal
const session = await auth.session.get();
```

### Custom Configuration

You can also create your own instance with custom configuration:

```typescript
import { createAuth } from "@comp/auth";

// Create a custom auth instance with your own secret
const myAuth = createAuth({
  secret: "your-custom-secret", 
  // Optional: Custom Google OAuth credentials
  googleAuth: {
    clientId: "google-client-id",
    clientSecret: "google-client-secret"
  }
});

// Use your custom instance
const session = await myAuth.session.get();
```

## Security

In production environments, always provide a strong secret. You can generate a good secret using:

```bash
openssl rand -base64 32
```

Never hardcode secrets in your code. Use environment variables instead:

```
# .env file
BETTER_AUTH_SECRET=your-generated-secret
``` 