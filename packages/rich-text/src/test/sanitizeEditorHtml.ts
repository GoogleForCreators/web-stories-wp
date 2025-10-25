/*
 * Copyright 2024 Google LLC
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

/**
 * Internal dependencies
 */
import { sanitizeEditorHtml } from '../htmlManipulation';

describe('sanitizeEditorHtml', () => {
  it('should preserve text starting with numbers', () => {
    const htmlContent = '1. hello<br />2. world';
    const result = sanitizeEditorHtml(htmlContent);

    expect(result).toContain('1. hello');
    expect(result).toContain('2. world');
  });

  it('should preserve numbered list-like content in paragraphs', () => {
    const htmlContent = '<p>1. first item</p><p>2. second item</p>';
    const result = sanitizeEditorHtml(htmlContent);

    expect(result).toContain('1. first item');
    expect(result).toContain('2. second item');
  });

  it('should sanitize malicious HTML while preserving numbered content', () => {
    const htmlContent = '1. hello<script>alert("xss")</script>';
    const result = sanitizeEditorHtml(htmlContent);

    expect(result).toContain('1. hello');
    expect(result).not.toContain('script');
  });

  it('should preserve text with inline styles', () => {
    const htmlContent = '<span style="color: red;">1. red text</span>';
    const result = sanitizeEditorHtml(htmlContent);

    expect(result).toContain('1. red text');
  });
});
