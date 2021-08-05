// Copied from https://github.com/gaearon/reactjs.org/blob/d72a2c7df862cc28b32c7de638d63d69c2809b68/src/utils/patchDOMForGoogleTranslate.js
// 

// This is not pretty.
// See https://github.com/facebook/react/issues/11538#issuecomment-417504600
// We need this because we don't even offer official translations.
// https://github.com/facebook/react/issues/12460

export default function patchDOMForGoogleTranslate() {
  const originalRemoveChild = Node.prototype.removeChild
  // $FlowFixMe Intentionally monkepatching.
  Node.prototype.removeChild = function (child) {
    if (child.parentNode !== this) {
      if (typeof console !== 'undefined') {
        console.error(
          'Cannot remove a child from a different parent',
          child,
          this
        )
      }
      return child
    }
    return originalRemoveChild.apply(this, arguments)
  }

  const originalInsertBefore = Node.prototype.insertBefore
  // $FlowFixMe Intentionally monkepatching.
  Node.prototype.insertBefore = function (newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (typeof console !== 'undefined') {
        console.error(
          'Cannot insert before a reference node from a different parent',
          referenceNode,
          this
        )
      }
      return newNode
    }
    return originalInsertBefore.apply(this, arguments)
  }
}
