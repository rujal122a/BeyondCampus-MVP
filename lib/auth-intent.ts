import type { ProfileRole } from "@/lib/types";

export type AuthIntent = "student" | "property_owner" | "mess_owner";

type AuthIntentConfig = {
  signupLabel: string;
  loginLabel: string;
  onboardingPath: string;
  verifyEmailCopy: string;
};

const AUTH_INTENT_CONFIG: Record<AuthIntent, AuthIntentConfig> = {
  student: {
    signupLabel: "student account",
    loginLabel: "student account",
    onboardingPath: "/onboarding/student",
    verifyEmailCopy: "continue into your student onboarding flow",
  },
  property_owner: {
    signupLabel: "flat owner account",
    loginLabel: "flat owner account",
    onboardingPath: "/onboarding/owner",
    verifyEmailCopy: "continue into your flat owner onboarding flow",
  },
  mess_owner: {
    signupLabel: "mess owner account",
    loginLabel: "mess owner account",
    onboardingPath: "/onboarding/mess-owner",
    verifyEmailCopy: "continue into your mess owner onboarding flow",
  },
};

export function parseAuthIntent(value: string | null): AuthIntent | null {
  if (!value) {
    return null;
  }

  return value in AUTH_INTENT_CONFIG ? (value as AuthIntent) : null;
}

export function getAuthIntentConfig(intent: AuthIntent | null): AuthIntentConfig | null {
  if (!intent) {
    return null;
  }

  return AUTH_INTENT_CONFIG[intent];
}

export function getOnboardingPathForIntent(intent: AuthIntent | null): string {
  return getAuthIntentConfig(intent)?.onboardingPath ?? "/onboarding";
}

export function getProfileRoleLabel(role: ProfileRole | null): string {
  switch (role) {
    case "seeker":
      return "Student";
    case "property_owner":
      return "Flat owner";
    case "mess_owner":
      return "Mess owner";
    default:
      return "No role selected yet";
  }
}
