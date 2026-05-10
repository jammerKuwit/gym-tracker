const SLUG_TO_LABEL = {
  push: 'Push',
  pull: 'Pull',
  legs: 'Legs',
};

export function categoryFromSlug(slug) {
  if (!slug || typeof slug !== 'string') return null;
  return SLUG_TO_LABEL[slug.toLowerCase()] ?? null;
}

export function slugFromCategory(category) {
  return category.toLowerCase();
}
