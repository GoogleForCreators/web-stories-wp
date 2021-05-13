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
/**
 * Internal dependencies
 */
import {
  effectValueExceptions,
  getDirectionalEffect,
} from '../dropdownConstants';

const getDisabledBackgroundEffects = (
  backgroundEffectOptions,
  disabledTypeOptionsMap
) => {
  const disabledDirectionalEffects = Object.entries(disabledTypeOptionsMap)
    // rn we don't ever disable the exceptions, but do dynamic props instead.
    .filter(([effect]) => effectValueExceptions.indexOf(effect) === -1)
    .map(([effect, val]) => [effect, val.options])
    .reduce(
      (directionalEffects, [effect, directions]) => [
        ...directionalEffects,
        ...(directions || []).map((dir) => getDirectionalEffect(effect, dir)),
      ],
      []
    );
  return Object.keys(backgroundEffectOptions).filter((directionalEffect) =>
    disabledDirectionalEffects.includes(directionalEffect)
  );
};

export default getDisabledBackgroundEffects;
