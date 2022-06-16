module.exports = {
  prefix: 'fl-',
  min: '576px',
  max: '1024px',
  convertUnit: true,
  rootFontSize: '16px',

  utilities: {
    // padding
    p: ['padding'],
    'pl': ['padding-left'],
    'pr': ['padding-right'],
    'pt': ['padding-top'],
    'pb': ['padding-bottom'],
    'py': ['padding-top', 'padding-bottom'],
    px: ['padding-left', 'padding-right'],

    // margin
    m: ['margin'],
    'ml': ['margin-left'],
    'mr': ['margin-right'],
    'mt': ['margin-top'],
    'mb': ['margin-bottom'],
    'my': ['margin-top', 'margin-bottom'],
    mx: ['margin-left', 'margin-right'],

    // sizing
    w: ['width'],
    'min-w': ['min-width'],
    'max-w': ['max-width'],
    h: ['height'],
    'min-h': ['min-height'],
    'max-h': ['max-height'],

    // positioning
    top: ['top'],
    bottom: ['bottom'],
    left: ['left'],
    right: ['right'],
    inset: ['top', 'bottom', 'left', 'right'],

    // gap
    gap: ['gap'],
    'gap-x': ['column-gap'],
    'gap-y': ['row-gap'],

    // misc
    text: ['font-size'],
    basis: ['flex-basis'],
    rounded: ['border-radius'],
  },
}
