# Sailwind

Sailwind is a Tailwind plugin that provides smarter fluid spacing and typography using CSS `clamp` and viewport units.

*This is currently experimental, and hasn't been fully tested. Use at your own risk*

## Installation

Install the plugin from npm:

```sh
npm install -D sailwind
```

Then add the plugin to your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  theme: {
    // ...
  },
  plugins: [
    require('sailwind'),
    // ...
  ],
}
```

## Usage

Sailwind uses Just In Time (JIT) to generate fluid version values for all spacing utilities.

In its simplest form, add the class `fl-px-[20px,64px]`, where in this case `20px` is the size at the minimum configured viewport (`theme.fluid.min`) and `64px` is the size at the maximum configured viewport (`theme.fluid.max`).

```html
<div class="fl-py-[20px,64px]"></div>
<!-- generates css like this: -->
<style>
  .fl-py-\[20px\2c 64px\] {
    padding-bottom: clamp(1.25rem,calc(4.13vw + 0.28rem),4rem);
    padding-top: clamp(1.25rem,calc(4.13vw + 0.28rem),4rem);
  }
</style>
```

You can also specify custom viewports, with `fl-px-[20px@400px,64px@1440px]`. In this example, when the screen is smaller than  `400px` the padding is `20px`, when the screen is above `1440px` it's `64px`. Between these it will scale with the viewport width.

### Notes:

- Values have to be provided with the same CSS unit;
- If a unit is not specified, it will use `px`;
- Breakpoints have to be provided with the same CSS unit;
- Mixing units between values and breakpoints can produce unexpected results, especially mixing relative and absolute units. For this technique to work the plugin converts breakpoints to match the value unit which may not match what you'd expect.

## Configuration

You can configure the default min and max viewport and whether the plugin should convert breakpoint units under the `sailwind` key in your `tailwind.config.js` file:

```js
// tailwind.config.js
module.exports = {
  theme: {
    sailwind: {
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

| Property       | Default  | Notes                                                                       |
| -------------- | -------- | --------------------------------------------------------------------------- |
| `min`          | `576px`  | Minimum viewport when not specified                                         |
| `max`          | `1024px` | Maximum viewport when not specified                                         |
| `convertUnits` | `true `  | Should the plugin try to convert breakpoint units                           |
| `rootFontSize` | `16px`   | Base font-size for converting between rem and px                            |
| `custom`       | `[]`     | [Custom utilities](#custom-utilities) to add in `name: [properties]` format |

### Custom utilities

By default Sailwind generates fluid versions of all default Tailwind spacing utilities.

It also adds a custom property that can be used for more complex situations—used with `fl-var-[]` and the `--fluid-val` property. This could be used within other property values or extended to other CSS functions.

If this doesn't meet your needs, you can also specify your own utilities in `theme.fluid.extend`:

```js
// tailwind.config.js
module.exports = {
  theme: {
    sailwind: {
      custom: {
        // specify properties to assign in an array, this will add the 'fl-flow-[]' utility
        'flow': ['--flow-space'],

        // for advanced use, provide a function to format your own properties
        'min-padding-x': value => ({
          'padding-left': `min(var(--min), ${value})`,
          'padding-right': `min(var(--min), ${value})`
        })
      }
    }
  }
}
```

## Changelog

- `0.4.0` &mdash; 06/09/22 &mdash; Renamed project to Sailwind and changed config key from `fluid` to `sailwind`
- `0.3.0` &mdash; 29/06/22 &mdash; Added default `--fluid-val` custom property, ability to extend utilities and functional utilities
- `0.2.3` &mdash; 17/06/22 &mdash; Fixed clamp output when second parameter is lower than first
- `0.2.2` &mdash; 16/06/22 &mdash; Removed redundant `console.log`
- `0.2.1` &mdash; 16/06/22 &mdash; Fixed default config not loading and some utilities not generating properly
- `0.2.0` &mdash; 16/06/22 &mdash; Changed prefix to `fl-`
- `0.1.0` &mdash; 10/06/22 &mdash; Initial release

## License and Credits

This project is licensed under the [Apache-2.0 license](https://apache.org/licenses/LICENSE-2.0).

Copyright © 2022 Alistair Shepherd.
