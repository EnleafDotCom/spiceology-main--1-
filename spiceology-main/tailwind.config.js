module.exports = {
  mode: "jit",
  content: [
    "./src/scripts/**/*.js",
    "./src/scripts/*.js",
    "./src/styles/**/*.scss",
    "./src/styles/*.scss",
    "./layout/*.liquid",
    "./sections/*.liquid",
    "./snippets/*.liquid",
    "./templates/**/*.liquid",
    "./templates/*.liquid",
  ],
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
  safelist: ["overflow-hidden"],
  variants: {
    extend: {},
  },
  theme: {
    fontFamily: {
      sans: [
        "Chromatic Grotesque",
        "ui-sans-serif",
        "system-ui",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Ubuntu",
        "Cantarell",
        "Noto Sans",
        "sans-serif",
        "BlinkMacSystemFont",
        "Segoe UI",
        "Roboto",
        "Helvetica Neue",
        "Arial",
        "Noto Sans",
        "sans-serif",
        "Apple Color Emoji",
        "Segoe UI Emoji",
        "Segoe UI Symbol",
        "Noto Color Emoji",
      ],
      mono: ["Chromatic Mono", "ui-monospace", "monospace"],
      kremlin: ["kremlin-pro-semi-exp"],
    },
    fontWeight: new Array(10)
      .fill()
      .map((_, i) => i)
      .reduce((acc, val) => {
        acc[val] = `${val * 10}px`;
        return acc;
      }, {}),
    fontSize: new Array(100)
      .fill()
      .map((_, i) => i)
      .reduce((acc, val) => {
        acc[val] = `${val}px`;
        return acc;
      }, {}),
    letterSpacing: new Array(40)
      .fill()
      .map((_, i) => i)
      .reduce((acc, val) => {
        acc[`${val - 20}`] = `${(val - 20) / 100}em`;
        return acc;
      }, {}),
    lineHeight: {
      95: "95%",
      100: "100%",
      110: "110%",
      120: "120%",
      130: "130%",
      140: "140%",
      150: "150%",
      160: "160%",
      170: "170%",
      180: "180%",
      190: "190%",
      200: "200%",
    },
    aspectRatio: {
      square: "1",
      "16/9": "16/9",
      "9/16": "9/16",
      "4/3": "4/3",
      "3/4": "3/4",
    },
    colors: {
      transparent: "transparent",
      black: "#181613",
      white: "#FFFFFF",
      grey: {
        light: "#F2F2F2",
        DEFAULT: "#DCDBDA",
      },
      blue: {
        light: "#1AAAE7",
        DEFAULT: "#00A1E4",
      },
      green: {
        light: "#31BD66",
        DEFAULT: "#0DB14B",
      },
      yellow: {
        light: "#fec743",
        DEFAULT: "#FDB916",
      },
      red: {
        light: "#F54E5E",
        DEFAULT: "#ED1B2F",
      },
      pink: {
        light: "#E66AAD",
        DEFAULT: "#D63B8E",
      },
      purple: {
        light: "#966EAA",
        DEFAULT: "#84549B",
      },
      gray: {
        DEFAULT: "#B6B5B4",
        1: "#FBF9F4",
        2: "#E9E7E2",
        3: "#C7C7C4",
        4: "#B6B5B4",
        5: "#90908F",
        6: "#6C6C6C",
        7: "#595959",
      },
    },
    extend: {
      fontSize: {
        "header-2": [
          "56px",
          {
            letterSpacing: "0rem",
            lineHeight: "3.33rem",
          },
        ],
        "header-3": [
          "40px",
          {
            letterSpacing: "0rem",
            lineHeight: "2.38rem",
          },
        ],
        "header-4": [
          "28px",
          {
            letterSpacing: "0rem",
            lineHeight: "26.6px",
          },
        ],
        "header-5": [
          "22px",
          {
            letterSpacing: "0rem",
            lineHeight: "1.51rem",
          },
        ],
        "header-6": [
          "18px",
          {
            letterSpacing: "0rem",
            lineHeight: "1.12rem",
          },
        ],
        "header-7": [
          "16px",
          {
            letterSpacing: "0.03rem",
            lineHeight: "1.1rem",
          },
        ],
        "body-1": [
          "20px",
          {
            letterSpacing: "0.8px",
            lineHeight: "26px",
          },
        ],
        "body-2": [
          "16px",
          {
            letterSpacing: "0.64px",
            lineHeight: "24px",
          },
        ],
        "body-3": [
          "14px",
          {
            letterSpacing: "0.28px",
            lineHeight: "16.8px",
          },
        ],
        caption: [
          "14px",
          {
            letterSpacing: "0.02rem",
            lineHeight: "1.05rem",
          },
        ],
        "utility-1": [
          "13px",
          {
            letterSpacing: "0.66px",
            lineHeight: "15.4px",
          },
        ],
        "utility-2": [
          "9px",
          {
            letterSpacing: "0.54px",
            lineHeight: "9px",
          },
        ],
        handwriting: [
          "1.12rem",
          {
            letterSpacing: "0.01rem",
            lineHeight: "1.35rem",
          },
        ],
      },
      fontWeight: {
        400: 400,
        500: 500,
      },
      borderRadius: {
        2: "2px",
        4: "4px",
        6: "6px",
      },
      height: {
        "screen-nav": "calc(100vh - var(--nav-height))",
      },
      minHeight: {
        "screen-nav": "calc(100vh - var(--nav-height))",
      },
      screens: {
        // if breakpoints are changed, they also need to be changed in theme.liquid, where all the css is loaded based on media query
        "2xs": "320px",
        xs: "440px",
        "2xl": "1440px",
        "3xl": "1920px",
        "4xl": "2560px",
      },
      animation: {
        "fade-in-500": "fadeIn 500ms ease-in-out forwards",
        "fade-in-out-800": "fadeIn 800ms ease-in-out forwards",
        "slide-up":
          "slideInFromBottom 450ms var(--slide-animation-bezier) 100ms forwards",
        marquee: "marquee 500s linear infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0%" },
          "100%": { opacity: "100%" },
        },
        marquee: {
          "0%": { transform: "translate3d(var(--move-initial), 0, 0)" },
          "100%": { transform: "translate3d(var(--move-final), 0, 0)" },
        },
      },
      margin: {
        dnav: "var(--nav-height-desktop-banner)",
        mnav: "var(--nav-height-mobile-banner)",
        safari: "90px",
      },
      inset: {
        dnav: "var(--nav-height-desktop-banner)",
        mnav: "var(--nav-height-mobile-banner)",
        nav: "var(--nav-height)",
      },
      spacing: {
        7.5: "1.875rem",
        11: "2.75rem",
        13: "3.25rem",
        15: "3.75rem",
        17: "4.25rem",
        18: "4.5rem",
        19: "4.75rem",
        25: "6.25rem",
        30: "7.5rem",
        35: "8.75rem",
        40: "10rem",
        45: "11.25rem",
        50: "12.5rem",
        55: "13.75rem",
        60: "15rem",
        65: "16.25rem",
        nav: "var(--nav-height)",
      },
      padding: {
        container: "var(--container-padding)",
        dnav: "var(--nav-height-desktop-banner)",
        mnav: "var(--nav-height-mobile-banner)",
        safari: "80px",
      },
    },
  },
};
