export function isValidPhone(phone: string): boolean {
  const clean = phone.replace(/[\s\-\+]/g, '');
  return /^[6-9]\d{9}$/.test(clean) || /^91[6-9]\d{9}$/.test(clean);
}

export function isValidVehicleNumber(number: string): boolean {
  return /^[A-Z]{2}\s?\d{2}\s?[A-Z]{1,2}\s?\d{1,4}$/.test(number.toUpperCase());
}

export function isValidPrice(price: number): boolean {
  return price > 0 && price <= 10000;
}

export function isValidSeats(seats: number): boolean {
  return seats >= 1 && seats <= 7;
}

export function isDateInFuture(dateStr: string): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const date = new Date(dateStr + 'T00:00:00');
  return date >= today;
}
