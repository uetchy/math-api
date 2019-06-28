const express = require('express')
const memCache = require('memory-cache')
const path = require('path')
const svg2img = require('svg2img')
const { MathJax } = require('mathjax3')
const { TeX } = require('mathjax3/mathjax3/input/tex')
const { SVG } = require('mathjax3/mathjax3/output/svg')
const { RegisterHTMLHandler } = require('mathjax3/mathjax3/handlers/html')
const { chooseAdaptor } = require('mathjax3/mathjax3/adaptors/chooseAdaptor')

const app = express()

// MathJax bootstrap
const adaptor = chooseAdaptor()
RegisterHTMLHandler(adaptor)

const html = MathJax.document('', {
  InputJax: new TeX(),
  OutputJax: new SVG({ fontCache: 'none' }),
})

function tex2svg(equation, isInline = false) {
  return adaptor.innerHTML(html.convert(equation, { display: !isInline }))
}

function svg2png(svgString, args = {}) {
  return new Promise((resolve, reject) => {
    svg2img(svgString, args, function(error, buffer) {
      if (error) {
        return reject(error)
      }
      resolve(buffer)
    })
  })
}

// math parser
app.get('/', async function(req, res, next) {
  const isInline = Object.keys(req.query)[0] === 'inline'
  const equation = isInline ? req.query.inline : req.query.from
  if (!equation || equation.match(/\.ico$/)) {
    return next()
  }

  const isPNG = /\.png$/.test(equation)
  const normalizedEquation = equation.replace(/\.(svg|png)$/, '')
  const cacheKey = isInline ? 'inline' : 'block' + '.' + normalizedEquation
  const cachedData = memCache.get(cacheKey)

  // render equation
  if (isPNG) {
    res.contentType('image/png')
  } else {
    res.contentType('image/svg+xml')
    res.write(`<?xml version="1.0" standalone="no" ?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
  `)
  }

  try {
    let image = cachedData || tex2svg(normalizedEquation, isInline)
    if (!cachedData) memCache.put(cacheKey, image, 60 * 1000)
    if (isPNG) {
      image = new Buffer(await svg2png(image), 'base64')
    }
    res.end(image)
  } catch (err) {
    res.write(
      '<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-size="15">'
    )
    res.write(err)
    res.end('</text></svg>')
  }
})

// welcome page
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen()
