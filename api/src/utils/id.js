function nextId(items) {
  if (!Array.isArray(items) || items.length === 0) return 1;
  return Math.max(...items.map(x => Number(x.id) || 0)) + 1;
}
module.exports = { nextId };
