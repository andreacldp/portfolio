// Placeholders like "[LINK]" render as inert links so nothing breaks.
export const isPlaceholder = (v) => !v || v.startsWith('[');
export const href = (v) => (isPlaceholder(v) ? '#' : v);
export const external = (v) =>
  isPlaceholder(v) || !/^https?:/.test(v) ? {} : { target: '_blank', rel: 'noreferrer' };
