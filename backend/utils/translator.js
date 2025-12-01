'use strict';

function mockTranslate(text, targetLang) {
  if (!text) return '';
  const reversed = text.split(' ').reverse().join(' ');
  return `${reversed} [${targetLang}]`;
}

module.exports = {
  mockTranslate,
};
