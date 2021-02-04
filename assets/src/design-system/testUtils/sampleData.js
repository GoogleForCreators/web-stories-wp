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

export const basicDropDownOptions = [
  {
    label: 'label item one',
    value: 'label-item-one',
  },
  {
    label: 'label item two',
    value: 'label-item-two',
  },
  {
    label: 'label item three',
    value: 'label-item-three',
  },
  {
    label: 'label item four (disabled)',
    value: 'label-item-four',
    disabled: true,
  },
  {
    label: 'label item five (value is a number)',
    value: 5,
  },
  {
    label: 'label item six (value is a boolean)',
    value: true,
  },
  {
    label: 'drafts',
    value: 'drafts',
  },
  {
    label: 'cats',
    value: 'cats',
  },
  {
    label: 'dogs',
    value: 'dogs',
  },
  {
    label: 'parakeets',
    value: 'parakeets',
  },
  {
    label: 'lemurs',
    value: 'lemurs',
  },
  {
    label: 'ocelots',
    value: 'ocelots',
  },
];

export const reallyLongOptions = [
  {
    label: 'mad mad mad mad world',
    value: 'tears for fears',
  },
  {
    label: 'bring on the dancing horses',
    value: 'echo',
  },
  {
    label: 'one 2 three four, uno dos tres rumba',
    value: 'pitbull',
  },
];

export const effectChooserOptions = [
  {
    value: 'none',
    label: 'none',
    width: 'full',
  },
  {
    value: 'drop in',
    label: 'drop',
    width: 'full',
  },
  {
    value: 'fly in left-to-right',
    label: 'fly in',
    width: 'half',
  },
  {
    value: 'fly in top-to-bottom',
    label: 'fly in',
    width: 'half',
  },
  {
    value: 'fly in right-to-left',
    label: 'fly in',
    width: 'half',
  },
  {
    value: 'fly in bottom-to-top',
    label: 'fly in',
    width: 'half',
  },
  {
    value: 'pulse',
    label: 'pulse',
    width: 'full',
  },
  {
    value: 'rotate in left-to-right',
    label: 'rotate in',
    width: 'half',
  },
  {
    value: 'rotate in right-to-left',
    label: 'rotate in',
    width: 'half',
  },
  {
    value: 'twirl',
    label: 'twirl',
    width: 'full',
  },
];

export const nestedDropDownOptions = [
  {
    label: 'aliens',
    options: [
      { value: 'alien-1', label: 'ET' },
      { value: 'alien-2', label: 'Stitch' },
      { value: 'alien-3', label: 'Groot' },
      { value: 'alien-4', label: 'The Worm Guys' },
      { value: 'alien-5', label: "Na'vi" },
      { value: 'alien-6', label: 'Arachnids' },
      { value: 'alien-7', label: 'The Predator' },
      { value: 'alien-8', label: 'Xenomorph' },
    ],
  },
  {
    label: 'dragons',
    options: [
      { value: 'dragon-1', label: 'Smaug' },
      { value: 'dragon-2', label: 'Mushu' },
      { value: 'dragon-3', label: 'Toothless' },
      { value: 'dragon-4', label: 'Falkor' },
      { value: 'dragon-5', label: 'Drogon' },
      { value: 'dragon-6', label: 'Kalessin' },
    ],
  },
  {
    label: 'dogs',
    options: [
      { value: 'dog-1', label: 'Snoopy' },
      { value: 'dog-2', label: 'Scooby' },
    ],
  },
];

export const badOptions = [
  { value: 0, label: '0 as a number' },
  { value: '0', label: '0 as a string' },
  { value: false, label: "false as a boolean, shouldn't come through" },
  { value: 'false', label: 'false as a string' },
  { value: true, label: 'true as a boolean' },
  { value: undefined, label: "undefined and shouldn't come through" },
];
