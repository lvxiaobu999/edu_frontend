/** @type {import('tailwindcss').Config} */
const pxValues = [
  0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 30, 32, 36, 40, 48, 56, 64, 72, 80, 96, 120,
  160, 200, 240,
]

const toPxScale = values => Object.fromEntries(values.map(value => [`${value}px`, `${value}px`]))

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  important: true,
  theme: {
    extend: {
      spacing: toPxScale(pxValues),
      fontSize: toPxScale(pxValues),
      lineHeight: toPxScale(pxValues),
      borderRadius: toPxScale(pxValues),
      minWidth: toPxScale(pxValues),
      minHeight: toPxScale(pxValues),
      maxWidth: toPxScale(pxValues),
      maxHeight: toPxScale(pxValues),
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
}
