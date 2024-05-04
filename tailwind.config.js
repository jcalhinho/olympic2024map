export const darkMode = "class";
export const important = true;
export const content = [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}",
  "./node_modules/react-tailwindcss-datepicker/dist/index.esm.js",
];
export const theme = {
  extend: {
    fontFamily: {
      'inter': ['inter']
    },
    fontSize: {
      'xs': '.75rem', // Extra small screens
      'sm': '.875rem', // Small screens
      'base': '1 rem', // Default size (usually 16px)
      'lg': '1.15rem', // Large screens
      'xl': '1.25rem', // Extra large screens
      '2xl': '1.5rem', // 2x large screens
      '3xl': '1.875rem', // 3x large screens
      // ... Add more sizes as needed
    },
    screens: {
      'dropdownSmallScrenn': { 'raw': '(min-height: 200px) and (max-height: 970px)' },
      'navbarMinMax': { 'min': '400px', 'max': '890px' },
      'layoutMinMax': { 'min': '400px', 'max': '1024px' },
      'max-xs': { 'max': '400px' },
      'xs': '400px',
      // => @media (min-width: 400px) { ... }
      'max-sm': { 'max': '640px' },
      'sm': '640px',
      // => @media (min-width: 640px) { ... }
      'max-md': { 'max': '768px' },
      'md': '768px',
      // => @media (min-width: 768px) { ... }
      'max-lg': { 'max': '1024px' },
      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }
      'max-xl': { 'max': '1280px' },
      'xl': '1280px',
      '1.5xl': "1380px",
      // => @media (min-width: 1280px) { ... }
      'max-2xl': { 'max': '1536px' },
      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
      '3xl': '2736px',
      '4xl': '3000px'
    },
    gridTemplateColumns: {
      'custom': 'repeat(12, 72px)',
    },
    colors: {
      LogoColor: '#0B1C2E',
      BgColorLight: '#F1F4FD',
      BgColorDark: '#161C22',
      SelectedButton: "#E2E7F6",
      SelectedButtonDark: "#354656",
      MainText: "#0B1C2E",
      TextNavBarDar: "#FCFCFC",
      BgNavBarDark: "#1B242D",
      stateCritical: "#D43A3A",
      stateCriticalDark: "#D24CF3",
      white: "#FFF",
      black: "#000",
      darkBlue: "#243467",
      lightBlue: "#358ce8",
      grey: "#2B2E35",
      grey150: "#9698A2",
      bodyBgLight: "#F1F4FD",
      bodyBgDark: "#161C22",
      cardBgLight: "#FCFCFC",
      cardAlert: "#4C53F3",
      cardBgDark: "#1B242D",
      cardBorder: "#B9BBC1",
      smallCardBorder: "#8B887F",
      selectedLight: "#F1F4FD",
      selectedDark: "#354656",
      green: "#4ade80",
      lightGreen: "#f0fdf4",
      orange: "#facc15",
      lightOrange: "#fefce8",
      red: "#f87171",
      lightRed: "#fef2f2",
      success100: "#16742B",
      information100: "#BCD9F7",
      warningLight100: "#FFC700",
      warningDark100: "#4CB7F3",
      highLight100: "#EB7203",
      highDark100: "#4C53F3",
      dangerLight100: "#F3564C",
      dangerDark100: "#AA4CF3",
      success15: "rgba(22, 116, 43, 0.15)",
      information15: "rgba(188, 217, 247, 0.15)",
      warningLight15: "rgba(255, 199, 0, 0.15)",
      warningDark15: "rgba(76, 183, 243, 0.15)",
      highLight15: "rgba(235, 114, 3, 0.15)",
      highDark15: "rgba(76, 83, 243, 0.15)",
      dangerLight15: "rgba(243, 86, 76, 0.15)",
      dangerDark15: "rgba(170, 76, 243, 0.15)",
      criticalDark15: "rgba(210, 76, 243, 0.15)",
      critical15: "rgba(212, 58, 58, 0.15)",
      mainTextLight: "#0B1C2E",
      mainTextDark: "#FCFCFC",
      lightTextLight: "#5D5F6A",
      lightTextDark: "#FCFCFC",
      secondTextLight: "#FCFCFC",
      secondTextDark: "#0B1C2E",
      SecondaryBtnBg: "#F1F4FD",
      OutlinedBtn: "#A6AAB8",
      OutlinedBtnBg: "#FFF",
      PrimaryBtnBg: "#0B1C2E",
      PrimaryBtnText: "#FCFCFC",
      gradientBg: "linear-gradient(0deg, #E2E7F6 0%, #E2E7F6 100%)",
      logoAzure: "#0DADEA",
      CTABgDark: "#1A3148",
      divider: "#D7E8FA",
      underlineNavText: "#579FEC",
      doneColor: "#2C75C1",
      smartAlert: "#25B08F",
      darkBlue50: "#D3D6E1",
      code2L: "#1B4674",
      code1L: "#9A2CC1",
      code1D: "#31FFF3",
      code2D: "#FCFCFC",
      bgCategoriesDark: "#DCDCEA",
      textCategories: "#272586",
      bgCategoriesLight: "#DFDFED",
      subnav: "#A6AAB8"
    },
    height: {
      '100': '6.25rem',
    },
    maxHeight: {
      '100': '6.25rem',
    },
    minWidth: {
      '100': '6.25rem',
    },
    backgroundImage: {
      'nano-pattern': "url(../assets/index.jpg)",
      'usa': "url(../assets/usa.png)",
      'france': "url(../assets/france.png)",
      'nuit': "url(../assets/nuit.png)",
      'sun': "url(../assets/sun.png)",
      'epingle': "url(../assets/epingle.png)",
      'broche-de-localisation': "url(../assets/broche-de-localisation.png)",
    },
    animation: {
      'spin-slow': 'spin 3s linear infinite',
    }
  },
};
export const plugins = [];
