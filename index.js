const express = require('express')
const mathJax = require('mathjax-node')
const memCache = require('memory-cache')

const app = express()

app.set('port', process.env.PORT || 3000)
app.set('view engine', 'pug')

mathJax.config({
  MathJax: {},
})
mathJax.start()

// math parser
app.get('/', function(req, res, next) {
  const isInline = Object.keys(req.query)[0] === 'inline'
  const equation = isInline ? req.query.inline : req.query.from
  if (!equation || equation.match(/\.(ico|png)$/)) {
    // pass to next router
    return next()
  }
  const normalizedEquation = equation.replace(/\.svg$/, '')
  const mathJaxFormat = isInline ? 'inline-TeX' : 'TeX'
  const cacheKey = mathJaxFormat + normalizedEquation
  const cachedData = memCache.get(cacheKey)
  if (cachedData) {
    res.contentType('image/svg+xml')
    res.write(`<?xml version="1.0" standalone="no" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
`)
    return res.end(cachedData)
  }
  mathJax.typeset(
    {
      math: normalizedEquation,
      format: mathJaxFormat,
      svg: true,
    },
    function(data) {
      res.contentType('image/svg+xml')
      res.write(`<?xml version="1.0" standalone="no" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
`)
      if (!data.errors) {
        memCache.put(cacheKey, data.svg, 60 * 1000)
        res.end(data.svg)
      } else {
        res.write(
          '<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-size="15">'
        )
        res.write(data.errors[0])
        res.end('</text></svg>')
      }
      next('router')
    }
  )
})

// welcome page
app.get('/', function(req, res) {
  res.render('index')
})

app.listen(app.get('port'), () => {
  console.log(`listening on ${app.get('port')} ...`)
})
