/**
 * Get a personalized greeting based on time of day
 */
export function getGreeting(name?: string | null): string {
  const hour = new Date().getHours();
  
  let timeGreeting: string;
  if (hour < 12) {
    timeGreeting = 'Bom dia';
  } else if (hour < 18) {
    timeGreeting = 'Boa tarde';
  } else {
    timeGreeting = 'Boa noite';
  }
  
  if (name) {
    return `${timeGreeting}, ${name}!`;
  }
  
  return `${timeGreeting}!`;
}

/**
 * Get first name from full name
 */
export function getFirstName(fullName?: string | null): string | null {
  if (!fullName) return null;
  return fullName.split(' ')[0];
}
