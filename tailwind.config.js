module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,vue,html}"],
  theme: {
    extend: {},
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.btn': {
          padding: '0.5rem 1rem',
          fontWeight: '600',
          borderRadius: '0.5rem',
          transition: 'all 0.2s',
        },
        '.btn-primary': {
          '@apply btn bg-indigo-600 text-white hover:bg-indigo-700': {},
        },
        '.btn-default': {
          '@apply btn bg-gray-200 text-gray-800 hover:bg-gray-300': {},
        },
        '.btn-outline': {
          '@apply btn border border-gray-600 text-gray-600 hover:bg-gray-100': {},
        },
        '.btn-home': {
          '@apply btn bg-green-600 text-white hover:bg-green-700': {},
        },
      })
    }
  ]
}
