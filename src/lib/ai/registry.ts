import { PUBLIC_CONCIERGE_PROMPT } from './prompts/public';
import { CUSTOMER_BOOKING_PROMPT } from './prompts/customer';
import { OWNER_BUSINESS_PROMPT } from './prompts/owner/business';
import { OWNER_ANALYTICS_PROMPT } from './prompts/owner/analytics';
import { OWNER_MARKETING_PROMPT } from './prompts/owner/marketing';
import { ADMIN_PLATFORM_PROMPT } from './prompts/admin';
import { AIRole } from './guard';

export type OwnerPersona = 'BUSINESS' | 'ANALYTICS' | 'MARKETING';

export function getSystemPrompt(role: AIRole, ownerPersona?: OwnerPersona): string {
  switch (role) {
    case 'PUBLIC':
      return PUBLIC_CONCIERGE_PROMPT;
    case 'CUSTOMER':
      return CUSTOMER_BOOKING_PROMPT;
    case 'OWNER':
      if (ownerPersona === 'ANALYTICS') return OWNER_ANALYTICS_PROMPT;
      if (ownerPersona === 'MARKETING') return OWNER_MARKETING_PROMPT;
      return OWNER_BUSINESS_PROMPT;
    case 'ADMIN':
      return ADMIN_PLATFORM_PROMPT;
    default:
      return PUBLIC_CONCIERGE_PROMPT;
  }
}
