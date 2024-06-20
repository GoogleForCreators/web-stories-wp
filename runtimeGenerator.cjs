/*
 * Copyright 2021 Google LLC
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

const { stringifyRequest } = require('loader-utils');
const { stringifySymbol, stringify } = require('svg-sprite-loader/lib/utils');

function toPascalCase(string) {
  return `${string}`
    .toLowerCase()
    .replace(new RegExp(/[-_]+/, 'g'), ' ')
    .replace(new RegExp(/[^\w\s]/, 'g'), '')
    .replace(
      new RegExp(/\s+(.)(\w*)/, 'g'),
      ($1, $2, $3) => `${$2.toUpperCase() + $3}`
    )
    .replace(new RegExp(/\w/), (s) => s.toUpperCase());
}

module.exports = function runtimeGenerator({ symbol, config, context }) {
  const { spriteModule, symbolModule } = config;

  const spriteRequest = stringifyRequest({ context }, spriteModule);
  const symbolRequest = stringifyRequest({ context }, symbolModule);
  const displayName = `${toPascalCase(symbol.id)}SpriteSymbolComponent`;

  return `
    import SpriteSymbol from ${symbolRequest};
    import sprite from ${spriteRequest};

    function SpriteSymbolComponent({
      glyph,
      viewBox,
      className,
      title,
      ...restProps
    }) {
      return (
        <svg className={className} viewBox={viewBox} {...restProps}>
          {title && <title>{title}</title>}
          <use xlinkHref={glyph} />
        </svg>
      );
    }
    
    const symbol = new SpriteSymbol(${stringifySymbol(symbol)});
    sprite.add(symbol);

    export default function ${displayName} (props) {
      return <SpriteSymbolComponent glyph="#${symbol.id}" viewBox="${symbol.viewBox}" {...props} />;
    }
  `;
};
