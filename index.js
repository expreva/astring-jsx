const astring = require('astring')

const generator = Object.assign({
  // <div></div>
  JSXElement: function JSXElement(node, state) {
    state.write('<')
    this[node.openingElement.type](node.openingElement, state)
    if (node.closingElement) {
      state.write('>')
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i]
        this[child.type](child, state)
      }
      state.write('</')
      this[node.closingElement.type](node.closingElement, state)
      state.write('>')
    } else {
      state.write(' />')
    }
  },
  // <div>
  JSXOpeningElement: function JSXOpeningElement(node, state) {
    this[node.name.type](node.name, state)
    for (let i = 0; i < node.attributes.length; i++) {
      const attr = node.attributes[i]
      this[attr.type](attr, state)
    }
  },
  // </div>
  JSXClosingElement: function JSXOpeningElement(node, state) {
    this[node.name.type](node.name, state)
  },
  // div
  JSXIdentifier: function JSXOpeningElement(node, state) {
    state.write(node.name)
  },
  // Member.Expression
  JSXMemberExpression: function JSXMemberExpression(node, state) {
    this[node.object.type](node.object, state)
    state.write('.')
    this[node.property.type](node.property, state)
  },
  // attr="something"
  JSXAttribute: function JSXAttribute(node, state) {
    state.write(' ')
    this[node.name.type](node.name, state)

    if (node.value !== null) {
      state.write('=')
      this[node.value.type](node.value, state)
    }
  },
  JSXSpreadAttribute: function JSXSpreadAttribute(node, state) {
    state.write('  {...')
    this[node.argument.type](node.argument, state)
    state.write('}')
  },
  // namespaced:attr="something"
  JSXNamespacedName: function JSXNamespacedName(node, state) {
    this[node.namespace.type](node.namespace, state)
    state.write(':')
    this[node.name.type](node.name, state)
  },
  // {expression}
  JSXExpressionContainer: function JSXExpressionContainer(node, state) {
    state.write('{')
    this[node.expression.type](node.expression, state)
    state.write('}')
  },
  JSXEmptyExpression: function JSXEmptyExpression(node, state) {
  },
  // text
  JSXText: function JSXExpressionContainer(node, state) {
    state.write(node.value)
  },
  JSXFragment: function JSXFragment(node, state) {
    state.write('<>')
    for (const child of node.children) {
      this[child.type](child, state)
    }
    state.write('</>')
  }
}, astring.GENERATOR)

function astringJsx(ast, options) {
  return astring.generate(ast, Object.assign({
    generator
  }, options))
}

astringJsx.generator = generator
module.exports = astringJsx
