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
import { createElement, Fragment, Component } from 'react';
/**
 * Internal dependencies
 */
import createInterpolateElement from '../create-interpolate-element';

describe('createInterpolateElement', () => {
  it('throws an error when there is no conversion map', () => {
    const testString = 'This is a string';
    expect(() => createInterpolateElement(testString, {})).toThrow(TypeError);
  });
  it('returns same string when there are no tokens in the string', () => {
    const testString = 'This is a string';
    const expectedElement = <>{testString}</>;
    expect(
      createInterpolateElement(testString, { someValue: <em /> })
    ).toStrictEqual(expectedElement);
  });
  it('throws an error when there is an invalid conversion map', () => {
    const testString = 'This is a <someValue/> string';
    expect(() =>
      createInterpolateElement(testString, ['someValue', { value: 10 }])
    ).toThrow(TypeError);
  });
  it('throws an error when there is an invalid entry in the conversion map', () => {
    const testString = 'This is a <item /> string and <somethingElse/>';
    expect(() =>
      createInterpolateElement(testString, {
        someValue: <em />,
        somethingElse: 10,
      })
    ).toThrow(TypeError);
  });
  it(
    'returns same string when there is an non matching token in the ' +
      'string',
    () => {
      const testString = 'This is a <non_parsed/> string';
      const expectedElement = <>{testString}</>;
      expect(
        createInterpolateElement(testString, {
          someValue: <strong />,
        })
      ).toStrictEqual(expectedElement);
    }
  );
  it('returns same string when there is spaces in the token', () => {
    const testString = 'This is a <spaced token/>string';
    const expectedElement = <>{testString}</>;
    expect(
      createInterpolateElement(testString, { 'spaced token': <em /> })
    ).toStrictEqual(expectedElement);
  });
  it('returns expected react element for non nested components', () => {
    const testString = 'This is a string with <a>a link</a>.';
    const expectedElement = createElement(
      Fragment,
      null,
      'This is a string with ',
      createElement(
        'a',
        { href: 'https://github.com', className: 'some_class' },
        'a link'
      ),
      '.'
    );
    const component = createInterpolateElement(testString, {
      // eslint-disable-next-line jsx-a11y/anchor-has-content
      a: <a href={'https://github.com'} className={'some_class'} />,
    });
    expect(JSON.stringify(component)).toStrictEqual(
      JSON.stringify(expectedElement)
    );
  });
  it('returns expected react element for nested components', () => {
    const testString = 'This is a <a>string that is <em>linked</em></a>.';
    const expectedElement = createElement(
      Fragment,
      {},
      'This is a ',
      createElement(
        'a',
        null,
        'string that is ',
        createElement('em', null, 'linked')
      ),
      '.'
    );
    expect(
      JSON.stringify(
        createInterpolateElement(testString, {
          a: createElement('a'),
          em: <em />,
        })
      )
    ).toStrictEqual(JSON.stringify(expectedElement));
  });
  it(
    'returns expected output for a custom component with children ' +
      'replacement',
    () => {
      const TestComponent = (props) => {
        // eslint-disable-next-line react/prop-types
        return <div {...props}>{props.children}</div>;
      };
      const testString =
        'This is a string with a <TestComponent>Custom Component</TestComponent>';
      const expectedElement = createElement(
        Fragment,
        null,
        'This is a string with a ',
        createElement(TestComponent, null, 'Custom Component')
      );
      expect(
        JSON.stringify(
          createInterpolateElement(testString, {
            TestComponent: <TestComponent />,
          })
        )
      ).toStrictEqual(JSON.stringify(expectedElement));
    }
  );
  it('returns expected output for self closing custom component', () => {
    const TestComponent = (props) => {
      return <div {...props} />;
    };
    const testString =
      'This is a string with a self closing custom component: <TestComponent/>';
    const expectedElement = createElement(
      Fragment,
      null,
      'This is a string with a self closing custom component: ',
      createElement(TestComponent)
    );
    expect(
      JSON.stringify(
        createInterpolateElement(testString, {
          TestComponent: <TestComponent />,
        })
      )
    ).toStrictEqual(JSON.stringify(expectedElement));
  });
  it('throws an error with an invalid element in the conversion map', () => {
    const test = () =>
      createInterpolateElement('This is a <invalid /> string', {
        invalid: 10,
      });
    expect(test).toThrow(TypeError);
  });
  it('returns expected output for complex replacement', () => {
    class TestComponent extends Component {
      render(props) {
        return <div {...props} />;
      }
    }
    const testString =
      'This is a complex string with ' +
      'a <a1>nested <em1>emphasized string</em1> link</a1> and value: <TestComponent/>';
    const expectedElement = createElement(
      Fragment,
      null,
      'This is a complex string with a ',
      createElement(
        'a',
        null,
        'nested ',
        createElement('em', null, 'emphasized string'),
        ' link'
      ),
      ' and value: ',
      createElement(TestComponent)
    );
    expect(
      JSON.stringify(
        createInterpolateElement(testString, {
          TestComponent: <TestComponent />,
          em1: <em />,
          a1: createElement('a'),
        })
      )
    ).toStrictEqual(JSON.stringify(expectedElement));
  });
  it('handles parsing emojii correctly', () => {
    const testString = '👳‍♀️<icon>🚨🤷‍♂️⛈️fully</icon> here';
    const expectedElement = createElement(
      Fragment,
      null,
      '👳‍♀️',
      createElement('strong', null, '🚨🤷‍♂️⛈️fully'),
      ' here'
    );
    expect(
      JSON.stringify(
        createInterpolateElement(testString, {
          icon: <strong />,
        })
      )
    ).toStrictEqual(JSON.stringify(expectedElement));
  });
});
