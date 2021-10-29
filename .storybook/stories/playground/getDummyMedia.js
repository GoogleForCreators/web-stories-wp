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

function createDummyImageData({
  mimeType = 'image/jpeg',
  src,
  width,
  height,
  id,
  title,
}) {
  const mime_type = mimeType;
  return {
    type: 'image',
    mimeType,
    creationDate: '2021-10-29T11:43:38',
    src,
    width,
    height,
    id,
    alt: title,
    sizes: {
      medium: {
        file: `${title}-300x84.jpeg`,
        width: 300,
        height: 84,
        mime_type,
        source_url: src,
      },
      large: {
        file: `${title}-1024x288.jpeg`,
        width: 1024,
        height: 288,
        mime_type,
        source_url: src,
      },
      thumbnail: {
        file: `${title}-150x150.jpeg`,
        width: 150,
        height: 150,
        mime_type,
        source_url: src,
      },
      medium_large: {
        file: `${title}-768x216.jpeg`,
        width: 768,
        height: 216,
        mime_type,
        source_url: src,
      },
      '1536x1536': {
        file: `${title}-1536x432.jpeg`,
        width: 1536,
        height: 432,
        mime_type,
        source_url: src,
      },
      '2048x2048': {
        file: `${title}-2048x576.jpeg`,
        width: 2048,
        height: 576,
        mime_type,
        source_url: src,
      },
      'post-thumbnail': {
        file: `${title}-1568x441.jpeg`,
        width: 1568,
        height: 441,
        mime_type,
        source_url: src,
      },
      'web-stories-poster-portrait': {
        file: `${title}-640x853.jpeg`,
        width: 640,
        height: 853,
        mime_type,
        source_url: src,
      },
      'web-stories-publisher-logo': {
        file: `${title}-96x96.jpeg`,
        width: 96,
        height: 96,
        mime_type,
        source_url: src,
      },
      'web-stories-thumbnail': {
        file: `${title}-150x42.jpeg`,
        width: 150,
        height: 42,
        mime_type,
        source_url: src,
      },
      full: {
        file: title,
        width,
        height,
        mime_type,
        source_url: src,
      },
    },
    local: false,
    isPlaceholder: false,
    isOptimized: false,
    isMuted: false,
    isExternal: false,
  };
}

function createDummyVideoData({
  mimeType = 'video/mp4',
  src,
  mediaDetails,
  id,
  title,
  poster,
}) {
  return {
    type: 'video',
    mimeType,
    creationDate: '2021-10-29T11:56:33',
    src,
    width: mediaDetails.width,
    height: mediaDetails.height,
    poster: poster.src,
    posterId: 57,
    id,
    length: mediaDetails.length,
    lengthFormatted: mediaDetails.lengthFormatted,
    alt: title,
    sizes: {},
    local: false,
    isPlaceholder: false,
    isOptimized: false,
    isMuted: false,
    isExternal: false,
    trimData: {
      original: 0,
    },
  };
}

function getDummyMedia() {
  return [
    createDummyImageData({
      mimeType: 'image/png',
      src: 'https://wp.stories.google/static/main/images/templates/fresh-and-bright/page1_bg-alt.png',
      width: 412,
      height: 732,
      id: 1,
      title: 'Fresh and Bright 1',
    }),
    createDummyVideoData({
      src: 'https://stream.mux.com/OGTmBYTMkV7Ez601cRNpH6BP10102fQu9C00/high.mp4?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InQ5UHZucm9ZY0hQNjhYSmlRQnRHTEVVSkVSSXJ0UXhKIn0.eyJleHAiOjE2MjYxNzgxMTIsImF1ZCI6InYiLCJzdWIiOiJPR1RtQllUTWtWN0V6NjAxY1JOcEg2QlAxMDEwMmZRdTlDMDAifQ.Jvddeah-XyF0AMmfYND-fFaIfgeDYW_cAuIVIXOrk2so_YalyMMAQ11YXHA1h11yKpLM-xa8xiNXazPqA0Suq1tfxHjJjEqiQOzSlPYd4visiPdTjUgT50FkwYdJrN0IldfXoS19yi3GyAd9McVFoSGCZ6qp8m_hgJ39y8FJJbOrvGtrzEvElpz1M8M1Dat3PF-BSLvFcTvCOlec9dipajxHG_2Xg-EE_vOqww6z81kC09evj5gu_A-Vz58Q-ebd08R47ybNejhE3rzMr1dCKgUikjkkQokPPQyrwVEy8zeZ68elax-ZRvDokZ2mTVPGvKIye6m_CQ-WVlG5XRjw7A',
      mediaDetails: {
        filesize: 1867215,
        mime_type: 'video/mp4',
        length: 12,
        length_formatted: '0:12',
        width: 720,
        height: 406,
        fileformat: 'mp4',
        dataformat: 'quicktime',
        audio: {
          dataformat: 'mp4',
          codec: 'ISO/IEC 14496-3 AAC',
          sample_rate: 48000,
          channels: 2,
          bits_per_sample: 16,
          lossless: false,
          channelmode: 'stereo',
        },
        created_timestamp: -2082844800,
        sizes: {},
      },
      id: 13,
      title: 'Story',
      poster: {
        src: 'https://image.mux.com/OGTmBYTMkV7Ez601cRNpH6BP10102fQu9C00/thumbnail.jpg?token=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InQ5UHZucm9ZY0hQNjhYSmlRQnRHTEVVSkVSSXJ0UXhKIn0.eyJ0aW1lIjowLCJleHAiOjMxNzE3MDYwNjg4MSwiYXVkIjoidCIsInN1YiI6Ik9HVG1CWVRNa1Y3RXo2MDFjUk5wSDZCUDEwMTAyZlF1OUMwMCJ9.WxHU2cpFdNqqiWF08KEv1g7barfbE_Nw4JDvVrtrQc9mVKiSZ6pEHpYl14NZeaBOf4Ep9MiomaegCVrD-UANhURlxWuHWFx5h7Msg74-q_ojjuZbLZtFPUdA0NA3_GTq5y0LDAeXijM7oENn_IkuDSY0fbRhRUVh-hYqCzw_OqMx7B1IxoOkkZUCHgkm9VnPdAMQRpmaanCHB8SHVRI_vIJo577DxLd88KBFP3UWK1XTvN5NYr0oPtwc82XMYUW4HrxZZTmxzLSZckxzwB7T5E6zAtXpo-xwd52yB1OUhoihlTqiOPWbntpvt9H4lFVRISLwsT39d1Tw80HF_X02eQ',
        width: 1920,
        height: 1080,
        generated: false,
      },
    }),
  ];
}

export { getDummyMedia };
