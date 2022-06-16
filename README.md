# Tailwing Smart Fluid

Tailwind plugin that provides smart fluid spacing and typography using CSS `clamp` and viewport units.

*This is currently experimental, and hasn't been fully tested. Use at your own risk*

## Installation

Install the plugin from npm:

```sh
npm install -D tailwind-smart-fluid
```

Then add the plugin to your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('tailwind-smart-fluid'),
    // ...
  ],
}
```

## Usage

This plugin uses Just In Time (JIT) to generate fluid version values for all spacing utilities.

In its simplest form, add the class `fl-px-[20px,64px]`, where in this case `20px` is the size at the minimum configured viewport (`theme.fluid.min`) and `64px` is the size at the maximum configured viewport (`theme.fluid.max`).

You can also specify custom viewports, with `fl-px-[20px@400px,64px@1440px]`. In this example, when the screen is smaller than  `400px` the padding is `20px`, when the screen is above `1440px` it's `64px`. Between these it will scale with the viewport width.

### Notes:

- Values have to be provided with the same CSS unit;
- If a unit is not specified, it will use `px`;
- Breakpoints have to be provided with the same CSS unit;
- Mixing units between values and breakpoints can produce unexpected results, especially mixing relative and absolute units. For this technique to work the plugin has to convert breakpoints to match the value unit.

## Configuration

You can configure the default min and max viewport and whether the plugin should convert breakpoint units under the `fluid` key in your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  theme: {
    fluid: {
      min: '400px',
      max: '1440px',
      convertUnit: true,
       // change if you use rem and the equivalent font-size on your html element is not 16px
      rootFontSize: '16px'
    }
  }
}
```

### Default config

| Property       | Default  | Notes                                             |
| -------------- | -------- | ------------------------------------------------- |
| `min`          | `576px`  | Minimum viewport when not specified               |
| `max`          | `1024px` | Maximum viewport when not specified               |
| `convertUnits` | `true `  | Should the plugin try to convert breakpoint units |
| `rootFontSize` | `16px`   | Base font-size for converting between rem and px  |

## Changelog

- `0.1.0` &mdash; 10/06/22 &mdash; Initial release

## License and Credits

This project is licensed under the [Apache-2.0 license](https://apache.org/licenses/LICENSE-2.0).

Copyright © 2022 Alistair Shepherd.
