# [vue-fmt](https://github.com/voodeng/vue-fmt)
  A Vue format & beautify tool.
  
  it use customed `jsbeautify` to format `<template>`  
  use `prettier` & `prettier-eslint` to format `<script>` `<style>`
  
  can Indent and Sort root tags


## Feature
- *Sort Your Root Tags*
- *Indent Root Tags*
- *Newline between Root Tags*
- *Align `<template>` Html Attr*

![feature](http://ww1.sinaimg.cn/large/87c01ec7gy1fo30g5rh4ug20qe0owwzu.gif)


## Install

```bash
apm install vue-fmt

# or

cd ~/.atom/package
git clone https://github.com/voodeng/vue-fmt && cd vue-fmt
npm install
```

## Language Support

- [x] Vue File, Components, the scope is `text.html.vue`
  - [x] template, only html
  - [ ] pug & other late..
  - [x] style, `sass,scss,less,postcss` use `prettier` parser `postcss`
  - [x] script, javascript and typescript
- [ ] editorConfig

## Custom Setting

Keymaps
```coffeescript
'.editor':
  'alt-l': 'vue-format:format'
```

### Tips
`Setting -> Sort -> Sort enable`

*! it will delete other tags*

if enable, will resort your code by `sortOrder` after formated,  
only `template, script, style` 3 tags name support,  
if only input 1 or 2, it will merged with origin code Sort


## License
  `vue-fmt` is MIT-licensed
  
  by [Voodeng](https://github.com/voodeng)
