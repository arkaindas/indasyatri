import en from './en.json';
import bn from './bn.json';

type Lang = 'en' | 'bn';

const translations: Record<Lang, Record<string, unknown>> = { en, bn };

function getNestedValue(obj: Record<string, unknown>, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (typeof current !== 'object' || current === null) return path;
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

export function t(lang: Lang, key: string): string {
  return getNestedValue(translations[lang] as Record<string, unknown>, key);
}

export function getLang(stored: string | null): Lang {
  if (stored === 'bn') return 'bn';
  return 'en';
}

export { en, bn };
export type { Lang };
