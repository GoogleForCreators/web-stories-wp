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

/**
 * External dependencies
 */
import { renderToStaticMarkup } from '@googleforcreators/react';

/**
 * Internal dependencies
 */
import TranslateWithMarkup from '../translateWithMarkup';

describe('TranslateWithMarkup component', () => {
  it('returns same string when not passing mapping', () => {
    const result = renderToStaticMarkup(
      <TranslateWithMarkup>
        {
          'This is a <b>bold</b> move!<br/>Look at all these <em>line breaks</em>!'
        }
      </TranslateWithMarkup>
    );

    expect(result).toBe(
      'This is a <b>bold</b> move!<br/>Look at all these <em>line breaks</em>!'
    );
  });

  it('returns same string when it contains no tokens', () => {
    const result = renderToStaticMarkup(
      <TranslateWithMarkup mapping={{ foo: <strong /> }}>
        {'This is a string'}
      </TranslateWithMarkup>
    );

    expect(result).toBe('This is a string');
  });

  it('returns same string when it contains a non-matching token', () => {
    const result = renderToStaticMarkup(
      <TranslateWithMarkup mapping={{ foo: <strong /> }}>
        {'This is a <span></span> string'}
      </TranslateWithMarkup>
    );

    expect(result).toBe('This is a <span></span> string');
  });

  it('returns expected React element for component', () => {
    const result = renderToStaticMarkup(
      <TranslateWithMarkup mapping={{ a: <a href="https://example.com" /> }}>
        {'This is a <a>link</a>!'}
      </TranslateWithMarkup>
    );

    expect(result).toBe('This is a <a href="https://example.com">link</a>!');
  });

  it('returns expected React element for custom component', () => {
    const string = 'This is a <a>link</a>!';

    const Link = (props) => {
      return <a {...props}>{props.children}</a>;
    };

    const result = renderToStaticMarkup(
      <TranslateWithMarkup mapping={{ a: <Link href="https://example.com" /> }}>
        {string}
      </TranslateWithMarkup>
    );

    expect(result).toBe('This is a <a href="https://example.com">link</a>!');
  });

  it('returns expected React element for multiple components', () => {
    const Link = (props) => {
      return <a {...props}>{props.children}</a>;
    };

    const result = renderToStaticMarkup(
      <TranslateWithMarkup
        mapping={{
          a: <Link href="https://example.com" target="_blank" />,
          a2: <Link href="https://example.org" target="_blank" />,
        }}
      >
        {'Read the<br/><a>Get Started story</a>, or <a2>this blog post</a2>!'}
      </TranslateWithMarkup>
    );

    expect(result).toBe(
      'Read the<br/><a href="https://example.com" target="_blank">Get Started story</a>, or <a href="https://example.org" target="_blank">this blog post</a>!'
    );
  });

  it('does not preserve HTML attributes', () => {
    const result = renderToStaticMarkup(
      <TranslateWithMarkup mapping={{ a: <a href="https://example.com" /> }}>
        {'This is a <a href="https://example.org" target="_blank" >link</a>!'}
      </TranslateWithMarkup>
    );

    expect(result).toBe('This is a <a href="https://example.com">link</a>!');
  });

  it('converts mapping keys to lowercase', () => {
    const result = renderToStaticMarkup(
      <TranslateWithMarkup
        mapping={{ CustomLink: <a href="https://example.com" /> }}
      >
        {'This is a <CustomLink>link</CustomLink>!'}
      </TranslateWithMarkup>
    );

    expect(result).toBe('This is a <a href="https://example.com">link</a>!');
  });

  it('throws error when accidentally using void elements', () => {
    const component = (
      <TranslateWithMarkup mapping={{ link: <a href="https://example.com" /> }}>
        {'This is a <link>link</link>!'}
      </TranslateWithMarkup>
    );

    expect(() => renderToStaticMarkup(component)).toThrow(
      'Found disallowed void elements in TranslateWithMarkup map: link'
    );
  });
});
