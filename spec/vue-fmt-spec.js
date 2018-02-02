'use babel'

import VueFmt from '../lib/vue-fmt'

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('VueFmt', () => {
  let workspaceElement, activationPromise

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace)
    activationPromise = atom.packages.activatePackage('vue-fmt')
  })

  describe('when the vue-fmt:toggle event is triggered', () => {
    it('hides and shows the modal panel', () => {
      // Before the activation event the view is not on the DOM, and no panel
      // has been created
      expect(workspaceElement.querySelector('.vue-fmt')).not.toExist()

      // This is an activation event, triggering it will cause the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'vue-fmt:toggle')

      waitsForPromise(() => {
        return activationPromise
      })

      runs(() => {
        expect(workspaceElement.querySelector('.vue-fmt')).toExist()

        let vueFmtElement = workspaceElement.querySelector('.vue-fmt')
        expect(vueFmtElement).toExist()

        let vueFmtPanel = atom.workspace.panelForItem(vueFmtElement)
        expect(vueFmtPanel.isVisible()).toBe(true)
        atom.commands.dispatch(workspaceElement, 'vue-fmt:toggle')
        expect(vueFmtPanel.isVisible()).toBe(false)
      })
    })

    it('hides and shows the view', () => {
      // This test shows you an integration test testing at the view level.

      // Attaching the workspaceElement to the DOM is required to allow the
      // `toBeVisible()` matchers to work. Anything testing visibility or focus
      // requires that the workspaceElement is on the DOM. Tests that attach the
      // workspaceElement to the DOM are generally slower than those off DOM.
      jasmine.attachToDOM(workspaceElement)

      expect(workspaceElement.querySelector('.vue-fmt')).not.toExist()

      // This is an activation event, triggering it causes the package to be
      // activated.
      atom.commands.dispatch(workspaceElement, 'vue-fmt:toggle')

      waitsForPromise(() => {
        return activationPromise
      })

      runs(() => {
        // Now we can test for view visibility
        let vueFmtElement = workspaceElement.querySelector('.vue-fmt')
        expect(vueFmtElement).toBeVisible()
        atom.commands.dispatch(workspaceElement, 'vue-fmt:toggle')
        expect(vueFmtElement).not.toBeVisible()
      })
    })
  })
})
