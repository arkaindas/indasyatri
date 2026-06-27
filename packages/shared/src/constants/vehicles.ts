export const VEHICLE_DATA: Record<string, string[]> = {
  Hatchback: [
    'Maruti WagonR',
    'Maruti Alto',
    'Maruti Swift',
    'Maruti Celerio',
    'Tata Tiago',
    'Hyundai i10 Grand',
    'Hyundai i20',
    'Other',
  ],
  Sedan: [
    'Maruti Swift Dzire',
    'Hyundai Aura',
    'Honda Amaze',
    'Tata Tigor',
    'Maruti Ciaz',
    'Hyundai Verna',
    'Other',
  ],
  SUV: [
    'Mahindra Bolero',
    'Mahindra Scorpio',
    'Tata Nexon',
    'Hyundai Creta',
    'Tata Harrier',
    'Kia Seltos',
    'Maruti Brezza',
    'Mahindra XUV700',
    'Other',
  ],
  'MUV/MPV': [
    'Maruti Ertiga',
    'Toyota Innova',
    'Kia Carens',
    'Maruti XL6',
    'Mahindra Marazzo',
    'Toyota Innova Crysta',
    'Other',
  ],
};

export const VEHICLE_TYPES = Object.keys(VEHICLE_DATA);
