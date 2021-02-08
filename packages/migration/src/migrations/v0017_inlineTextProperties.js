/*
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function inlineTextProperties({ pages, ...rest }) {
  return {
    pages: pages.map(reducePage),
    ...rest,
  };
}

function reducePage({ elements, ...rest }) {
  return {
    elements: elements.map(updateElement),
    ...rest,
  };
}

function updateElement(element) {
  if (element.type === 'text') {
    return updateTextContent(element);
  }

  return element;
}

function updateTextContent({
  bold,
  fontWeight,
  fontStyle,
  textDecoration,
  letterSpacing,
  color,
  content,
  ...rest
}) {
  // We use an array to chain all the converters more nicely
  const convertedContent = [content]
    .map((c) => convertInlineBold(c, bold, fontWeight))
    .map((c) => convertInlineItalic(c, fontStyle))
    .map((c) => convertInlineUnderline(c, textDecoration))
    .map((c) => addInlineColor(c, color))
    .map((c) => addInlineLetterSpacing(c, letterSpacing))
    .pop();

  return { ...rest, content: convertedContent };
}

function convertInlineBold(content, isBold, fontWeight) {
  // Do we have a specific global weight to apply for entire text field?
  const globalWeight =
    typeof fontWeight === 'number' && fontWeight !== 400
      ? fontWeight
      : isBold === true
      ? 700
      : null;

  if (globalWeight) {
    // In that case, strip any inline bold from the text and wrap everything in a span with correct style
    const stripped = stripTag(content, 'strong');
    const fancyBold = `font-weight: ${globalWeight}`;
    return wrapWithSpan(stripped, fancyBold);
  }

  const justBold = 'font-weight: 700';
  return replaceTagWithSpan(content, 'strong', justBold);
}

function convertInlineItalic(content, fontStyle) {
  // Do we have a specific font style to apply for entire text field?
  const globalFontStyle = fontStyle === 'italic' ? fontStyle : null;
  const italicStyle = 'font-style: italic';

  if (globalFontStyle) {
    // In that case, strip any inline em from the text and wrap everything in a span with correct style
    const stripped = stripTag(content, 'em');
    return wrapWithSpan(stripped, italicStyle);
  }

  return replaceTagWithSpan(content, 'em', italicStyle);
}

function convertInlineUnderline(content, textDecoration) {
  // Do we have a specific text decoration to apply for entire text field?
  const globalDecoration =
    textDecoration === 'underline' ? textDecoration : null;
  const underlineStyle = 'text-decoration: underline';

  if (globalDecoration) {
    // In that case, strip any inline underline from the text and wrap everything in a span with correct style
    const stripped = stripTag(content, 'u');
    return wrapWithSpan(stripped, underlineStyle);
  }

  return replaceTagWithSpan(content, 'u', underlineStyle);
}

function addInlineColor(content, color) {
  // If we don't have a color (should never happen, but if), just return
  if (!color) {
    return content;
  }

  const {
    color: { r, g, b, a = 1 },
  } = color;
  return wrapWithSpan(content, `color: rgba(${r}, ${g}, ${b}, ${a})`);
}

function addInlineLetterSpacing(content, letterSpacing) {
  // If we don't have letterSpacing, just return
  if (!letterSpacing) {
    return content;
  }

  return wrapWithSpan(content, `letter-spacing: ${letterSpacing / 100}em`);
}

function stripTag(html, tag) {
  // This is a very naive strip. Can only remove non-self-closing tags with attributes, which is sufficient here
  return html.replace(new RegExp(`</?${tag}>`, 'gi'), '');
}

function replaceTagWithSpan(html, tag, style) {
  // Again, very naive
  return html
    .replace(new RegExp(`<${tag}>`, 'gi'), `<span style="${style}">`)
    .replace(new RegExp(`</${tag}>`, 'gi'), '</span>');
}

function wrapWithSpan(html, style) {
  return `<span style="${style}">${html}</span>`;
}

export default inlineTextProperties;
