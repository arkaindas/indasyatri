export function generateCallLink(phone: string): string {
  const cleanPhone = phone.replace(/[\s\-]/g, '');
  const normalized = cleanPhone.startsWith('+') ? cleanPhone : `+91${cleanPhone}`;
  return `tel:${normalized}`;
}
