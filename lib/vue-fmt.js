'use babel'

import { CompositeDisposable } from 'atom'
import { html_beautify as htmlBeautify } from './jsbeautify'
import prettier from 'prettier'
import prettierEslint from 'prettier-eslint'
import indentString from 'indent-string'

const EMBEDDED_SCOPES = ['text.html.vue']

export default {
  vueFmtView: null,
  modalPanel: null,
  subscriptions: null,
  config: {
    useEslint: {
      type: 'boolean',
      title: 'Use prettier-eslint',
      default: false,
      order: 0
    },
    format: {
      type: 'object',
      titel: 'Code Format Setting',
      properties: {
        htmlWrapAttr: {
          title: 'Html wrap_attributes',
          type: 'string',
          default: 'aligned',
          enum: ['auto', 'force', 'force-aligned', 'force-expand-multiline', 'aligned']
        },
        htmlWrapLine: {
          type: 'integer',
          default: 120,
          minimum: 0
        },
        useTabs: {
          type: 'boolean',
          default: false,
          order: 1
        },
        tabWidth: {
          type: 'integer',
          default: 2,
          minimum: 0,
          order: 2
        },
        printWidth: {
          type: 'integer',
          default: 120,
          minimum: 0,
          order: 3
        },
        semi: {
          type: 'boolean',
          default: false,
          order: 4
        },
        singleQuote: {
          type: 'boolean',
          default: true,
          order: 5
        },
        trailingComma: {
          type: 'string',
          default: 'none',
          enum: ['none', 'es5', 'all']
        },
        bracketSpacing: {
          type: 'boolean',
          default: true
        },
        arrowParens: {
          type: 'string',
          default: 'avoid',
          enum: ['avoid', 'always']
        }
      }
    },
    sort: {
      type: 'object',
      title: 'Sort root tags',
      properties: {
        enable: {
          type: 'boolean',
          default: false
        },
        sortOrder: {
          type: 'array',
          title: 'Sort order',
          default: ['script', 'template', 'style'],
          description: 'resort `template, script, style` area after formated'
        }
      }
    },
    extra: {
      type: 'object',
      title: 'Extra',
      properties: {
        rootIndent: {
          type: 'boolean',
          title: 'add Indent to root tags',
          default: true
        },
        rootNewline: {
          type: 'boolean',
          title: 'add newline between root tags',
          default: true
        }
      }
    }
  },

  activate (state) {
    this.subscriptions = new CompositeDisposable()

    // Register command that toggles this view
    this.subscriptions.add(
      atom.commands.add('atom-workspace', {
        'vue-fmt:toggle': () => this.toggle()
      })
    )
  },

  deactivate () {
    this.modalPanel.destroy()
    this.subscriptions.dispose()
    this.vueFmtView.destroy()
  },

  serialize () {
    return {}
  },

  toggle () {
    console.log('VueFmt was toggled!')
    return this.format(atom.workspace.getActiveTextEditor())
    // this.modalPanel.isVisible() ? this.modalPanel.hide() : this.modalPanel.show()
    // setTimeout()
  },

  // get user's setting
  getOptions (key) {
    if (key) {
      return atom.config.get(`vue-fmt.${key}`)
    }
    return atom.config.get('vue-fmt')
  },

  getCurrentFilePath () {
    const editor = atom.workspace.getActiveTextEditor()
    return editor.buffer.file ? editor.buffer.file.getPath() : undefined
  },

  // check the file is *.vue
  isVueFile (editor) {
    const rs = EMBEDDED_SCOPES.includes(editor.getGrammar().scopeName)
    if (!rs) {
      atom.notifications.addWarning(':( not in a Vue SFC file')
    }
    return rs
  },

  // TODO: with editorConfig
  buildHtmlOptions () {
    const config = this.getOptions('format')
    return {
      indent_size: config['tabWidth'] || 2,
      indent_char: config['useTabs'] ? '	' : ' ', // eslint-disable-line
      indent_with_tabs: config['useTabs'] || false,
      preserve_newlines: true,
      max_preserve_newlines: 1,
      wrap_line_length: config['htmlWrapLine'] || 120,
      wrap_attributes: config['htmlWrapAttr'] || 'aligned'
    }
  },

  buildPrettierOptions (lang) {
    const config = this.getOptions('format')
    const result = {
      printWidth: config['printWidth'] || 120,
      tabWidth: config['tabWidth'] || 2,
      useTabs: config['useTabs'] || false,
      semi: config['semi'] || false,
      singleQuote: config['singleQuote'] || true,
      trailingComma: config['trailingComma'] || 'none',
      bracketSpacing: config['bracketSpacing'] || true,
      arrowParens: config['arrowParens'] || 'avoid'
    }
    if (['style', 'sass', 'scss', 'css', 'postcss'].includes(lang)) {
      result['parser'] = 'postcss'
    }
    if (['ts', 'typescript'].includes(lang)) {
      result['parser'] = 'typescript'
    }
    return result
  },

  buildPrettierEslintOptions (lang, text) {
    const opt = {
      text,
      filePath: this.getCurrentFilePath() + '.js', // hacked to find the eslint file
      fallbackPrettierOptions: this.buildPrettierOptions(lang)
    }
    return opt
  },

  format (editor) {
    const sourceCode = editor.getText()
    this.isVueFile(editor) && editor.setText(this.parse(sourceCode))
  },

  beautifyed (type, lang, text) {
    switch (type) {
      case 'template':
        // console.log('in template', lang)
        return htmlBeautify(text, this.buildHtmlOptions()) + '\n'
      case 'script':
        // console.log('in script', lang)
        if (this.getOptions('useEslint')) {
          return prettierEslint(this.buildPrettierEslintOptions(lang, text))
        } else {
          return prettier.format(text, { ...this.buildPrettierOptions(lang) })
        }
      case 'style':
        lang = lang || 'css'
        // console.log('in style', lang)
        return prettier.format(text, { ...this.buildPrettierOptions(lang) })
    }
  },

  parse (sourceCode) {
    const regexp = /(^<(template|script|style)[^>]*>)((\s|\S)*?)^<\/\2>/gim

    let sourceSort = []
    let resultObj = {}
    let resultText = ''

    const beText = sourceCode.replace(regexp, (match, begin, type, text) => {
      const lang =
        /lang\s*=\s*['"](\w+)["']/.exec(begin) && /lang\s*=\s*['"](\w+)["']/.exec(begin)[1]
      const replaceText = text

      let result
      let beautifiedText = this.beautifyed(type, lang, text.trim())

      // exec replace
      if (beautifiedText) {
        // add indent
        if (this.getOptions('extra.rootIndent')) {
          beautifiedText = this.indentText(beautifiedText)
        }
        // extra newline
        if (this.getOptions('extra.rootNewline')) {
          beautifiedText = `\n${beautifiedText}\n`
        }
        //
        result = match.replace(replaceText, `\n${beautifiedText}`) // the prettier has end with newline
      } else {
        result = match
      }

      // sort need
      sourceSort.push(type)
      resultObj[type] = result
      // console.log('dump', match, type, lang, text, result)
      return result
    })

    // re sort
    if (this.getOptions('sort.enable')) {
      const sortList = this.getOptions('sort.sortOrder')
      resultText = this.sort(sourceSort, sortList, resultObj)
    } else {
      resultText = beText
    }

    atom.notifications.addSuccess(' Vue SFC file formated', {
      description: this.getOptions('useEslint') ? 'use `prettier-eslint`' : 'use `prettier`'
    })
    // console.log('final:', resultText)
    return resultText
  },

  indentText (text) {
    const indentSize = this.getOptions('format.useTabs') ? 1 : this.getOptions('format.tabWidth')
    const indentChar = this.getOptions('format.useTabs') ? '	' : ' ' // eslint-disable-line
    return indentString(text, indentSize, { indent: indentChar })
  },

  sort (sourceSort, sortList, resultObj) {
    let sortedResult = ''

    if (!['template', 'script', 'style'].includes(...sortList)) {
      sortList = sourceSort
    }

    sortList.forEach((type, index) => {
      const newline = index === sortList.length - 1 ? '' : '\n'
      if (resultObj[type]) {
        sortedResult += resultObj[type] + `\n` + newline
      }
    })

    return sortedResult
  }
}
