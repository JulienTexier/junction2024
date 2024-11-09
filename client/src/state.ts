export type Card = {
  icon: string;
  title: {
    en: string;
    fi: string;
  };
};

export const cards: Card[] = [
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="248" height="319" fill="none"><path fill="currentColor" d="M61.98 91.667c0 5.3 5.063 10.333 10.333 10.333h103.333c5.301 0 10.333-5.063 10.333-10.333h20.667a31 31 0 0 1-31 31h-41.333l.01 21.307A82.669 82.669 0 0 1 206.646 226v62a10.333 10.333 0 0 1-10.333 10.333H51.646A10.332 10.332 0 0 1 41.313 288v-62a82.669 82.669 0 0 1 72.333-82.026v-21.307H72.313c-17.154 0-31-13.847-31-31h20.666ZM123.978 164c-33.459 0-62 28.52-62 62v51.667h124V226c0-33.459-28.54-62-62-62Zm0 20.667a41.119 41.119 0 0 1 20.998 5.724l-28.314 28.303a10.335 10.335 0 0 0 6.34 17.581 10.332 10.332 0 0 0 7.3-2.112l.982-.857 28.313-28.303a41.335 41.335 0 0 1-29.964 61.944 41.335 41.335 0 0 1-45.591-51.541 41.33 41.33 0 0 1 39.936-30.739Z"/><path fill="currentColor" d="M172.688 48.688c0 2.124-.771 4-2.313 5.624L165.688 59c-1.584 1.583-3.48 2.375-5.688 2.375-2.25 0-4.125-.792-5.625-2.375L136 40.687v44c0 2.167-.781 3.928-2.344 5.282C132.094 91.323 130.208 92 128 92h-8c-2.208 0-4.094-.677-5.656-2.031-1.563-1.354-2.344-3.115-2.344-5.281v-44L93.625 59c-1.5 1.583-3.375 2.375-5.625 2.375s-4.125-.792-5.625-2.375l-4.688-4.688c-1.583-1.583-2.374-3.458-2.374-5.624 0-2.209.791-4.105 2.374-5.688l40.688-40.688C119.833.772 121.708 0 124 0c2.25 0 4.146.77 5.688 2.313L170.375 43c1.542 1.625 2.313 3.52 2.313 5.688Z"/></svg>`,
    title: {
      en: "Over weight",
      fi: "Ylipainoinen",
    },
  },
  {
    icon: `<svg xmlns="http://www.w3.org/2000/svg" width="166" height="299" fill="none"><path fill="currentColor" d="M20.98 91.667c0 5.3 5.063 10.333 10.333 10.333h103.333c5.301 0 10.333-5.063 10.333-10.333h20.667a31 31 0 0 1-31 31H93.313l.01 21.307A82.666 82.666 0 0 1 165.646 226v62a10.334 10.334 0 0 1-10.333 10.333H10.646A10.332 10.332 0 0 1 .313 288v-62a82.668 82.668 0 0 1 72.333-82.026v-21.307H31.313c-17.154 0-31-13.847-31-31h20.666Zm62 72.333c-33.46 0-62 28.52-62 62v51.667h123.999V226c0-33.459-28.54-62-62-62Zm0 20.667a41.118 41.118 0 0 1 20.997 5.724l-28.314 28.303a10.335 10.335 0 0 0 6.34 17.581 10.333 10.333 0 0 0 7.3-2.112l.982-.857 28.313-28.303a41.328 41.328 0 0 1-6.17 50.017 41.336 41.336 0 0 1-67.56-13.061 41.332 41.332 0 0 1 38.111-57.292Z"/><path fill="currentColor" d="M34.313 43.313c0-2.126.77-4 2.312-5.626L41.313 33c1.583-1.583 3.479-2.375 5.687-2.375 2.25 0 4.125.792 5.625 2.375L71 51.313v-44c0-2.167.781-3.928 2.344-5.282C74.906.677 76.792 0 79 0h8c2.208 0 4.094.677 5.656 2.031C94.22 3.385 95 5.146 95 7.312v44L113.375 33c1.5-1.583 3.375-2.375 5.625-2.375s4.125.792 5.625 2.375l4.688 4.688c1.583 1.583 2.375 3.458 2.375 5.624 0 2.209-.792 4.105-2.375 5.688L88.625 89.688C87.167 91.228 85.292 92 83 92c-2.25 0-4.146-.77-5.687-2.313L36.625 49c-1.542-1.625-2.312-3.52-2.312-5.688Z"/></svg>`,

    title: {
      en: "Under weight",
      fi: "Alipainoinen",
    },
  },
  {
    icon: `<svg width="348" height="289" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="7.5" y="221.5" width="333" height="60" rx="30" stroke="currentColor" stroke-width="15"/><circle cx="305" cy="252" r="10" fill="currentColor"/><circle cx="93" cy="253" r="10" fill="currentColor"/><circle cx="146" cy="253" r="10" fill="currentColor"/><circle cx="199" cy="253" r="10" fill="currentColor"/><circle cx="252" cy="253" r="10" fill="currentColor"/><circle cx="40" cy="252" r="10" fill="currentColor"/><path d="M258.333 178.833 94 14.417 83.333 25l24 23.917L93.5 72.75a4.108 4.108 0 0 0 1 5.333l17.583 13.584c-.333 2.833-.583 5.583-.583 8.333s.25 5.417.583 8.083L94.5 121.917a4.108 4.108 0 0 0-1 5.333l16.667 28.833c1 1.834 3.25 2.5 5.083 1.834L136 149.5c4.333 3.333 8.833 6.167 14.083 8.25l3.084 22.083c.333 2 2.083 3.5 4.166 3.5h33.334c2.083 0 3.833-1.5 4.166-3.5l3.084-22.083c4.25-1.75 8-4 11.583-6.583l38.25 38.25 10.583-10.584ZM174 129.167c-16.083 0-29.167-13.084-29.167-29.167 0-4.167 1-7.667 2.417-11.083l37.833 37.833c-3.416 1.5-6.916 2.417-11.083 2.417Zm-2.167-58.084-26.5-26.5c1.584-.833 3.084-1.666 4.75-2.333l3.084-22.083c.333-2 2.083-3.5 4.166-3.5h33.334c2.083 0 3.833 1.5 4.166 3.5l3.084 22.083c5.25 2.083 9.75 4.917 14.083 8.167l20.75-8.334c1.833-.75 4.083 0 5.083 1.834L254.5 72.75c1 1.833.583 4.083-1 5.333l-17.583 13.584c.333 2.833.583 5.583.583 8.333s-.25 5.417-.583 8.083l17.583 13.834c1.583 1.25 2 3.5 1 5.333l-9.667 16.833-41.916-41.916c.25-.667.25-1.417.25-2.167 0-16.083-13.084-29.167-29.167-29.167-.75 0-1.417 0-2.167.25Z" fill="currentColor"/></svg>`,
    title: {
      en: "Equipment broken",
      fi: "Laiteongelma",
    },
  },
  {
    icon: `<svg width="265" height="265" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m229.667 250.646-49.688-49.688c-23.187 18.771-54.104 30.917-86.125 30.917-15.458 0-28.708-8.833-35.333-22.083l-25.396 16.562v-66.25l25.396 16.563c5.52-13.25 19.875-22.084 35.333-22.084 11.042 0 22.084-3.312 30.917-8.833L12.146 33.125 26.5 18.77l217.521 217.521-14.354 14.354Zm2.208-156.792c0-15.458-8.833-28.708-22.083-35.333l16.562-25.396h-66.25l16.563 25.396c-13.25 5.52-22.084 19.875-22.084 35.333 0 7.729-1.104 14.354-4.416 20.979l56.312 57.417c16.563-22.083 25.396-49.688 25.396-78.396Z" fill="currentColor"/></svg>`,
    title: {
      en: "Product defect",
      fi: "Virhe tuotteessa",
    },
  },
];
