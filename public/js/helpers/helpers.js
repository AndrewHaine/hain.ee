// Trims a value to a limited number of characters
exports.limit = function(val, limit = 20) {
  if(!val) return false;
  let split = val.split('');
  let limited = split.slice(0, limit);
  return limited.join('') + (split.length > limit ? '...' : '');
};

exports.copyToClipboard = function(value) {

  // Create an element to store the value to copy
  const el = document.createElement('textarea');
  el.value = value;
  document.body.appendChild(el);

  // Focus and copy the contents
  el.focus();
  el.setSelectionRange(0, el.value.length);
  document.execCommand('copy');

  // Clean up
  document.body.removeChild(el);
};
