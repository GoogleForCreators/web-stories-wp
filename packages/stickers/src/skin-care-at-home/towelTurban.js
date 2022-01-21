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
 * External dependencies
 */
import { _x } from '@googleforcreators/i18n';
import PropTypes from 'prop-types';

const title = _x('Towel Turban', 'sticker name', 'web-stories');

function TowelTurban({ style }) {
  return (
    <svg
      style={style}
      viewBox="0 0 23 38"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <title>{title}</title>
      <path
        d="M22.7514 14.3029C22.7352 15.1669 22.6778 16.028 22.5836 16.8861C22.3731 18.8261 21.9639 20.7219 21.3531 22.575C21.303 22.7281 21.2265 22.8768 21.2088 23.0328C21.1912 23.1888 21.2338 23.3507 21.2471 23.5112C21.2986 24.1544 21.2795 24.7976 21.225 25.4394C21.1264 26.5772 20.9277 27.7002 20.6348 28.8042C20.2432 30.2805 19.7031 31.6965 18.9494 33.0285C18.371 34.053 17.6777 34.9891 16.8225 35.8016C15.9629 36.62 14.9856 37.2441 13.8552 37.615C13.312 37.7931 12.7542 37.9035 12.1831 37.9477C11.2543 38.0198 10.3432 37.9256 9.45417 37.6489C8.63726 37.3942 7.89394 36.9939 7.21097 36.4802C6.50445 35.9488 5.90687 35.3115 5.36962 34.6123C4.77939 33.844 4.29954 33.0094 3.8874 32.1336C3.29864 30.8854 2.87179 29.5828 2.5671 28.2389C2.38606 27.4397 2.2477 26.6331 2.16822 25.8177C2.11523 25.2789 2.08579 24.7388 2.06371 24.1986C2.04899 23.8321 2.10787 23.4685 2.17263 23.1094C2.44052 21.6257 3.06167 20.2995 4.00516 19.1278C5.22831 17.6103 6.74291 16.4637 8.51656 15.6586C9.35555 15.2773 10.2269 14.9785 11.0909 14.665C11.5708 14.4913 12.0506 14.3132 12.5275 14.1278C13.1133 13.8996 13.6785 13.6229 14.2173 13.2976C15.0504 12.7927 15.7863 12.179 16.3721 11.393C16.9668 10.5937 17.3583 9.70616 17.5629 8.73322C17.7542 7.81917 17.7542 6.90217 17.5703 5.98959C17.4039 5.16827 17.1316 4.38227 16.693 3.6625C16.2588 2.95157 15.6965 2.36722 14.9856 1.93007C14.4322 1.58858 13.8301 1.36927 13.1928 1.25005C12.1698 1.0587 11.1557 1.12199 10.1504 1.36633C9.04644 1.63421 8.02053 2.0802 7.07115 2.70576C5.92159 3.46233 4.9722 4.42642 4.14352 5.51564C3.19855 6.7594 2.48762 8.12974 1.96068 9.59871C1.52941 10.7998 1.24386 12.0362 1.06723 13.3006C0.867054 14.7416 0.853803 16.1855 0.96714 17.6324C1.08784 19.1838 1.37339 20.7028 1.84734 22.185C1.87825 22.2821 1.90622 22.3808 1.9283 22.4808C1.96951 22.6678 1.85617 22.865 1.67366 22.9401C1.39988 23.0519 1.17174 22.9018 1.08931 22.7075C1.06134 22.6398 1.03485 22.5721 1.01277 22.5015C0.634488 21.3151 0.365133 20.1037 0.192919 18.8703C-0.00284436 17.4602 -0.0411152 16.0442 0.0398397 14.6253C0.10166 13.5287 0.270928 12.4469 0.521152 11.3753C0.861163 9.91517 1.36603 8.51685 2.05782 7.18772C2.8188 5.72612 3.75935 4.39257 4.94718 3.24301C5.71699 2.49822 6.5545 1.83881 7.47886 1.29715C8.22512 0.859991 9.00817 0.505262 9.84569 0.272701C10.7583 0.0195327 11.6841 -0.0570076 12.6247 0.0416103C13.1207 0.093127 13.5991 0.230015 14.0686 0.396341C14.3306 0.489071 14.5896 0.587689 14.8472 0.690722C16.1484 1.21031 17.3348 1.91829 18.3828 2.85001C19.3866 3.74198 20.1991 4.78704 20.8408 5.96751C21.4517 7.09205 21.8947 8.27988 22.195 9.52217C22.4423 10.5466 22.6057 11.5858 22.666 12.6397C22.6969 13.1931 22.7234 13.748 22.7514 14.3029ZM11.6326 15.4039C11.534 15.4334 11.4618 15.451 11.3941 15.476C10.5596 15.7896 9.73235 16.1207 8.9331 16.5167C7.9484 17.0054 7.0108 17.5676 6.14973 18.255C5.3917 18.8614 4.72492 19.5518 4.18032 20.3584C3.59155 21.2327 3.21033 22.1894 3.0337 23.2271C2.97777 23.5583 2.92625 23.8909 2.94244 24.2295C2.99543 25.3996 3.11465 26.561 3.35457 27.7091C3.63129 29.0308 4.02429 30.3129 4.57773 31.5434C5.04138 32.5752 5.61101 33.5408 6.33372 34.4136C6.76499 34.9347 7.24777 35.3983 7.79532 35.7957C8.66228 36.4257 9.62049 36.8246 10.6876 36.9718C11.8004 37.1249 12.8719 36.985 13.9155 36.5861C15.018 36.1652 15.932 35.4748 16.7254 34.6153C17.323 33.9676 17.8175 33.2449 18.2473 32.4766C18.8788 31.3476 19.3454 30.1524 19.6928 28.9101C20.1049 27.4397 20.3566 25.9457 20.3963 24.4164C20.4081 23.9321 20.3698 23.4523 20.2859 22.9769C20.1373 22.1335 19.862 21.3357 19.4219 20.5998C18.9774 19.855 18.4299 19.1911 17.7807 18.6127C17.1228 18.0269 16.406 17.5249 15.6406 17.0907C14.3762 16.3754 13.0338 15.844 11.6326 15.4039ZM20.7805 21.2606C20.8541 21.2003 20.8703 21.1134 20.8924 21.0281C21.2603 19.6577 21.5385 18.2712 21.699 16.8596C21.8256 15.7395 21.8888 14.6179 21.8462 13.4919C21.8005 12.3217 21.6798 11.1619 21.4222 10.0167C21.1455 8.78474 20.7319 7.6028 20.1299 6.49004C19.5559 5.42732 18.8287 4.48236 17.9412 3.66103C17.8455 3.57272 17.7395 3.49471 17.6365 3.41375C17.6277 3.40639 17.5982 3.40639 17.5982 3.40934C17.5894 3.43583 17.5761 3.4638 17.5791 3.48882C17.582 3.51679 17.6012 3.54181 17.6159 3.56683C18.162 4.55154 18.474 5.60689 18.5726 6.72996C18.6286 7.35994 18.6065 7.98697 18.5049 8.60812C18.2562 10.1242 17.5791 11.4268 16.512 12.5278C15.6376 13.4316 14.6103 14.116 13.4828 14.6591C13.39 14.7033 13.2958 14.7416 13.2061 14.7901C13.1707 14.8093 13.1486 14.852 13.1104 14.8961C13.1825 14.9329 13.2443 14.9726 13.312 14.9977C14.0774 15.2862 14.8237 15.6188 15.5479 16.0015C16.4148 16.4593 17.2406 16.9818 17.9942 17.6118C19.1423 18.5729 20.0666 19.7048 20.6539 21.0943C20.6716 21.1341 20.6907 21.1738 20.7157 21.2091C20.729 21.2341 20.7569 21.2444 20.7805 21.2606Z"
        fill="#380E63"
      />
      <path
        d="M11.5899 2.4836C12.239 2.4836 12.8764 2.56455 13.4916 2.76179C14.4175 3.05911 15.1946 3.58753 15.8099 4.34703C15.8467 4.39266 15.882 4.43976 15.9114 4.48981C16.0704 4.75475 15.9438 5.09918 15.6509 5.21251C15.5464 5.25226 15.4463 5.24048 15.361 5.17424C15.2918 5.12125 15.2358 5.05355 15.174 4.99025C15.0209 4.83276 14.8767 4.66791 14.7163 4.51925C14.1319 3.97906 13.4342 3.66407 12.6585 3.51099C12.1375 3.40943 11.6135 3.40207 11.088 3.44917C10.957 3.46094 10.8275 3.48155 10.695 3.48744C10.5022 3.49627 10.3594 3.40796 10.2608 3.24457C10.2137 3.16803 10.1946 3.08413 10.1887 2.99435C10.1754 2.79711 10.2755 2.64845 10.461 2.5984C10.5449 2.57633 10.6317 2.56013 10.7185 2.55278C11.0085 2.52922 11.2985 2.50715 11.5899 2.4836Z"
        fill="#380E63"
      />
      <path
        d="M11.3279 34.318C10.6346 34.3107 10.0032 34.1075 9.42621 33.7322C9.20689 33.5894 8.99199 33.4319 8.79328 33.2612C8.19421 32.746 7.65992 32.1632 7.09029 31.6171C6.90189 31.436 6.92396 31.1475 7.05496 30.9753C7.13002 30.8767 7.22423 30.8164 7.35081 30.8119C7.39497 30.8105 7.43913 30.809 7.48181 30.8134C7.81152 30.8443 8.11915 30.759 8.42089 30.6383C8.7609 30.5028 9.08325 30.3306 9.38499 30.1216C9.60136 29.9715 9.81626 29.8199 10.0312 29.6697C10.0915 29.6285 10.1474 29.58 10.2093 29.5432C10.3756 29.4445 10.5449 29.449 10.7038 29.5564C10.801 29.6212 10.8878 29.7007 10.9791 29.7728C11.0821 29.8537 11.1851 29.9362 11.2896 30.0156C11.3323 30.0495 11.4074 30.0466 11.453 30.0127C11.5119 29.9685 11.5693 29.9229 11.6267 29.8788C11.743 29.7904 11.8578 29.6992 11.9756 29.6138C12.1831 29.4622 12.3847 29.4004 12.6556 29.6065C12.7719 29.6948 12.8896 29.7816 13.0103 29.864C13.2399 30.0201 13.4695 30.1776 13.7021 30.3262C13.9111 30.4602 14.1378 30.5617 14.3703 30.653C14.6603 30.7663 14.9547 30.8355 15.2682 30.8164C15.3124 30.8134 15.355 30.8119 15.3992 30.8119C15.5832 30.8119 15.7039 30.9135 15.7687 31.0725C15.8526 31.2785 15.8305 31.4714 15.6612 31.6347C15.1681 32.1131 14.6794 32.5959 14.1819 33.0699C13.8316 33.404 13.4401 33.6851 13.0088 33.9088C12.4863 34.1841 11.9211 34.3121 11.3279 34.318ZM11.1734 33.3701C11.9991 33.379 12.5687 33.1729 13.0854 32.8152C13.5314 32.5061 13.9199 32.1308 14.2879 31.7334C14.3438 31.673 14.3247 31.5891 14.2423 31.5611C13.8655 31.4301 13.5358 31.2167 13.2134 30.9871C13.0118 30.8429 12.8101 30.6986 12.6041 30.5602C12.4053 30.4263 12.3317 30.4322 12.136 30.5897C12.0447 30.6633 11.9623 30.7457 11.8755 30.8237C11.7989 30.8914 11.7268 30.9636 11.6473 31.0283C11.5487 31.1078 11.4368 31.1166 11.3161 31.0784C11.2028 31.043 11.0998 30.99 11.0114 30.912C10.8569 30.7752 10.6729 30.6839 10.4992 30.5779C10.3697 30.4999 10.249 30.5205 10.1298 30.5956C10.0812 30.6265 10.0341 30.6633 9.98994 30.7001C9.74119 30.9017 9.49539 31.1093 9.21425 31.2697C9.19806 31.2785 9.18923 31.3212 9.19512 31.3448C9.201 31.3683 9.22602 31.3978 9.2481 31.4051C9.37321 31.4449 9.49833 31.4846 9.62638 31.5111C10.2181 31.6347 10.8157 31.6318 11.4133 31.5582C11.8048 31.5096 12.1934 31.4493 12.5776 31.3551C12.6615 31.3345 12.7498 31.3227 12.8366 31.3198C12.9603 31.3168 13.0633 31.3698 13.1398 31.4669C13.2134 31.5612 13.2576 31.6671 13.2635 31.7878C13.2738 31.9924 13.1604 32.1661 12.9647 32.2176C12.7674 32.2691 12.5673 32.3118 12.3671 32.3516C11.7503 32.4767 11.1277 32.5444 10.4978 32.5488C10.1754 32.5503 9.85747 32.4958 9.53954 32.459C9.49685 32.4531 9.45417 32.4428 9.41001 32.4355C9.34672 32.4252 9.29962 32.4472 9.30992 32.4796C9.31875 32.5061 9.32023 32.54 9.33936 32.5576C9.91193 33.0831 10.589 33.3495 11.1734 33.3701Z"
        fill="#380E63"
      />
      <path
        d="M8.1412 25.8384C8.1515 25.7736 8.16475 25.703 8.17506 25.6308C8.18095 25.594 8.13678 25.5396 8.10293 25.5411C8.0308 25.544 7.95721 25.5484 7.88509 25.5528C7.79089 25.5587 7.71729 25.6029 7.67166 25.6838C7.56568 25.8767 7.44499 26.0592 7.29485 26.2196C7.22567 26.2947 7.15355 26.3668 7.07407 26.4301C6.93423 26.5434 6.73406 26.5493 6.58098 26.4551C6.42054 26.3565 6.33664 26.1431 6.39699 25.9576C6.42349 25.8766 6.47206 25.8016 6.51622 25.7265C6.54565 25.6765 6.5854 25.6338 6.61925 25.5867C6.63986 25.5573 6.61778 25.4851 6.58393 25.4748C6.50003 25.4483 6.4176 25.4159 6.33223 25.4012C6.29543 25.3939 6.24097 25.4086 6.213 25.4336C6.13794 25.5028 6.07611 25.5837 6.00546 25.6573C5.86416 25.806 5.71697 25.9473 5.54329 26.0577C5.3328 26.1916 5.09141 26.0768 4.99426 25.9458C4.86032 25.7663 4.86768 25.4998 5.01487 25.3394C5.05461 25.2967 5.09877 25.2585 5.14145 25.2187C5.22388 25.1407 5.35782 25.0892 5.35635 24.9611C5.35488 24.8522 5.22977 24.811 5.16059 24.7374C5.00162 24.5667 4.99132 24.3665 5.13557 24.184C5.27392 24.0103 5.51532 23.9087 5.75818 24.0662C5.83178 24.1133 5.90096 24.1678 5.97455 24.2163C6.80765 24.7506 7.99107 24.8655 8.96105 24.0956C9.05231 24.0235 9.13915 23.9455 9.23483 23.8763C9.36435 23.7836 9.51155 23.7865 9.64402 23.8749C9.89424 24.0412 9.95018 24.3709 9.75736 24.6005C9.67346 24.7006 9.57631 24.7904 9.47622 24.8758C9.38202 24.9567 9.33198 25.0509 9.31579 25.1746C9.27457 25.516 9.13915 25.8207 8.94192 26.0989C8.9007 26.1578 8.85066 26.2137 8.79473 26.2594C8.68286 26.3521 8.5548 26.3624 8.42528 26.3006C8.25012 26.2167 8.1412 26.0415 8.1412 25.8384Z"
        fill="#380E63"
      />
      <path
        d="M17.9956 24.9612C18.0589 25.1202 18.1943 25.1894 18.2988 25.288C18.4387 25.4204 18.4887 25.5765 18.4505 25.7634C18.4225 25.9003 18.3445 26.0019 18.2223 26.0681C18.0987 26.1358 17.9691 26.1446 17.847 26.0696C17.7484 26.0092 17.6512 25.94 17.5673 25.8606C17.4407 25.7399 17.3244 25.6089 17.2067 25.4793C17.1419 25.4087 17.0698 25.3733 16.9741 25.4087C16.9064 25.4337 16.8372 25.4572 16.7695 25.4837C16.7372 25.4955 16.7224 25.5676 16.746 25.5985C16.7975 25.6692 16.8593 25.734 16.902 25.809C16.9373 25.8709 16.9624 25.9415 16.9741 26.0122C17.0036 26.1961 16.9182 26.3831 16.7695 26.4611C16.5988 26.5494 16.431 26.5317 16.2764 26.4169C16.219 26.3742 16.1616 26.3257 16.116 26.2697C15.9983 26.1225 15.8717 25.9783 15.776 25.8149C15.6082 25.5279 15.5935 25.5588 15.2903 25.5353C15.2755 25.5338 15.2594 25.5367 15.2476 25.5441C15.2255 25.5603 15.1887 25.5809 15.1902 25.5985C15.1946 25.6854 15.2167 25.7722 15.2167 25.8576C15.2196 26.0136 15.1504 26.1373 15.0312 26.2359C14.8546 26.3801 14.6309 26.3625 14.4881 26.1858C14.2732 25.9209 14.1363 25.6177 14.0627 25.2836C14.0509 25.2262 14.0465 25.1688 14.0362 25.1099C14.023 25.0363 13.9876 24.973 13.9332 24.9215C13.8272 24.8214 13.7153 24.7257 13.6182 24.6183C13.3856 24.3592 13.4533 24.0133 13.7624 23.8485C13.8758 23.7881 13.9891 23.7866 14.0951 23.8543C14.1922 23.9176 14.2805 23.9956 14.3703 24.0678C14.6691 24.3106 15.0033 24.4858 15.3786 24.5726C16.0807 24.7345 16.7386 24.6035 17.3524 24.2356C17.4393 24.184 17.5187 24.1163 17.6041 24.0604C17.8426 23.9059 18.0825 24.003 18.2223 24.184C18.3533 24.3533 18.3518 24.5417 18.2179 24.7051C18.1811 24.7493 18.134 24.7861 18.0957 24.8302C18.0619 24.8773 18.028 24.9229 17.9956 24.9612Z"
        fill="#380E63"
      />
      <path
        d="M15.726 20.7102C16.4251 20.7132 17.0875 20.878 17.7131 21.1842C18.2591 21.4521 18.7228 21.8259 19.0819 22.322C19.1158 22.3691 19.1496 22.4176 19.1805 22.4662C19.2644 22.6002 19.2821 22.7429 19.21 22.8828C19.1202 23.0535 18.9656 23.133 18.7787 23.1315C18.6757 23.13 18.5785 23.0874 18.5049 23.0108C18.4446 22.9475 18.3872 22.8813 18.3327 22.8121C18.0104 22.3956 17.5865 22.1144 17.1066 21.9201C16.4575 21.6567 15.7819 21.5728 15.0872 21.6817C14.7825 21.7303 14.4911 21.8215 14.2187 21.9717C14.0127 22.085 13.8257 22.2248 13.6727 22.4059C13.6064 22.4839 13.5417 22.5634 13.4651 22.6311C13.262 22.8121 12.9249 22.7635 12.7733 22.5325C12.6968 22.4147 12.685 22.2837 12.7483 22.1571C12.7866 22.0791 12.8396 22.007 12.8926 21.9393C13.2443 21.4889 13.7036 21.1871 14.2261 20.9752C14.7059 20.7809 15.2093 20.7043 15.726 20.7102Z"
        fill="#380E63"
      />
      <path
        d="M10.2107 22.7398C10.1033 22.7457 10.0061 22.7178 9.92517 22.6486C9.86924 22.6015 9.81773 22.55 9.7721 22.4926C9.40412 22.0363 8.91544 21.789 8.3517 21.6948C7.40821 21.5373 6.51918 21.7007 5.70227 22.21C5.4388 22.3733 5.20918 22.5735 5.02078 22.8223C4.97662 22.8811 4.93394 22.94 4.88389 22.993C4.65133 23.2462 4.2863 23.1152 4.17002 22.9076C4.10084 22.784 4.08759 22.653 4.1553 22.5294C4.22448 22.4013 4.3069 22.2791 4.39816 22.1658C4.67782 21.8228 5.01048 21.5388 5.39612 21.3209C6.40437 20.7528 7.47592 20.5658 8.61076 20.8102C9.34671 20.9691 9.97081 21.3327 10.4565 21.9156C10.5125 21.9833 10.5655 22.0539 10.6096 22.129C10.7082 22.2968 10.6552 22.5205 10.4933 22.6368C10.4109 22.7016 10.3167 22.7398 10.2107 22.7398Z"
        fill="#380E63"
      />
    </svg>
  );
}

TowelTurban.propTypes = {
  style: PropTypes.object,
};

export default {
  aspectRatio: 23 / 38,
  svg: TowelTurban,
  title,
};
