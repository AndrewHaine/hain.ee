// Trims a value to a limited number of characters
exports.limit = function(val, limit = 20) {
  if(!val) return false;
  let split = val.split('');
  let limited = split.slice(0, limit);
  return limited.join('') + (split.length > limit ? '...' : '');
};
