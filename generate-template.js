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
import fs from 'fs';

function getUrlDir(url) {
  return (url || '').split('/').slice(0, -1).join('/');
}

function convert(template) {
  const TEMPLATE_RAW_DIR = `${process.cwd()}/assets/src/dashboard/templates/raw`;
  const TEMPLATE_DATA_DIR = `${process.cwd()}/assets/src/dashboard/templates/data`;
  const TEMPLATE_IMAGE_DIR = '${imageBaseUrl}/images/templates';

  /**
   * Retrieve raw json
   */
  const inputFile = `${TEMPLATE_RAW_DIR}/${template}.json`;
  if (!fs.existsSync(inputFile)) {
    console.log(`Error:  ${inputFile} not found.`);
    return;
  }
  const templateData = JSON.parse(fs.readFileSync(inputFile).toString());

  /**
   * convert `sizes` property from elements
   */
  (templateData.pages || []).forEach((page, pageIndex) => {
    (page.elements || []).forEach((elem, elemIndex) => {
      if (!(elem.resource && elem.resource.sizes)) {
        return;
      }
      templateData.pages[pageIndex].elements[elemIndex].resource.sizes = [];
    });
  });

  /**
   * Get root url for wp resource
   */
  let rootImgUrl;
  (templateData.pages || []).find((page) => {
    (page.elements || []).find((elem) => {
      if (elem.resource) {
        rootImgUrl = getUrlDir(elem.resource.src);
      }
      return rootImgUrl;
    });
    return rootImgUrl;
  });

  /**
   * Replace rootImgUrl with ${imageBaseUrl}/images/templates/<template_name>
   */
  const rootUrlRegex = new RegExp(rootImgUrl, 'g');
  const templateDataString = JSON.stringify(templateData, null, 2);
  const formattedTemplateData = templateDataString
    .replace(rootUrlRegex, TEMPLATE_IMAGE_DIR + '/' + template)
    .replace(/"(\$\{imageBaseUrl\}.*)"/g, '`$1`');

  fs.writeFileSync(
    `${TEMPLATE_DATA_DIR}/${template}.js`,
    `
 export default function (imageBaseUrl) {
   return ${formattedTemplateData};
 }
  `
  );
}

/**
 * Get first argument of process and convert json to js
 */
if (process.argv[2]) {
  console.log(`generating template: ${process.argv[2]}`);
  convert(process.argv[2]);
} else {
  console.log(
    'must supply TEMPLATE in: TEMPLATE=<template> npm run generate-template'
  );
}
