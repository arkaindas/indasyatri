import type { Ride } from '../types/ride';

export function generateSimpleWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[\s\-\+]/g, '');
  const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
}

export function generateWhatsAppLink(phone: string, ride: Ride): string {
  const message = encodeURIComponent(
    `Hi, I want to book a seat on your ${ride.date} ride from ${ride.routeFrom} to ${ride.routeTo} at ${ride.departureTime}. ` +
    `Vehicle: ${ride.vehicleModel}. Price: ₹${ride.pricePerSeat}/seat. ` +
    `Seen on IndasYatri.`
  );
  const cleanPhone = phone.replace(/[\s\-\+]/g, '');
  const fullPhone = cleanPhone.startsWith('91') ? cleanPhone : `91${cleanPhone}`;
  return `https://wa.me/${fullPhone}?text=${message}`;
}
