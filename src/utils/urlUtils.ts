export const getImageUrl = (imagePath: string): string => {
  const base = (process.env.PUBLIC_URL || '').replace(/\/$/, '');

  return `${base}/${imagePath}`;
};
