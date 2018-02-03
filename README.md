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

- [x] Vue File, Components
  - [x] template, only html
  - [x] style, `sass,scss,less,postcss` use `prettier` parser `postcss`
  - [x] script, javascript and typescript
- [ ] editorConfig

## Custom Setting

Keymaps
```coffeescript
'.editor':
  'alt-l': 'vue-format:format'
```

## License
  `vue-fmt` is MIT-licensed
  
  by [Voodeng](https://github.com/voodeng)
