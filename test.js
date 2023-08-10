const acorn = require('acorn')
const acornJsx = require('acorn-jsx')
const assert = require('assert')
const astring = require('./index')
const fs = require('fs')

const tap = require('tap')

const extend = Object.assign

// Load text and build AST
const text = fs.readFileSync('sample.jsx').toString()
const parser = acorn.Parser.extend(acornJsx())
const ast = parser.parse(text, {
  ecmaVersion: '2020',
})

tap.test('supports all JSX features', function (t) {
  t.plan(1)
  const processed = astring(ast, { indent: '  ' })
  t.equal(text, processed, 'original and processed text should be equal')
})

tap.test('supports custom generator', function (t) {
  t.plan(1)

  const generator = extend({}, astring.generator, {
    ClassDeclaration: function ClassDeclaration(node, state) {
      t.equal(node.id.name, 'Test', 'should support custom generators')
      astring.generator.ClassDeclaration(node, state)
    }
  })

  const processed = astring(ast, {
    generator,
    indent: '  '
  })
})
