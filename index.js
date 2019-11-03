const path = require('path');
const helmet = require('helmet');
const express = require('express');
const svg2img = require('svg2img');
const bodyParser = require('body-parser');

const memCache = require('memory-cache');

const {MathJax} = require('mathjax3');
const {TeX} = require('mathjax3/mathjax3/input/tex');
const {SVG} = require('mathjax3/mathjax3/output/svg');
const {RegisterHTMLHandler} = require('mathjax3/mathjax3/handlers/html');
const {chooseAdaptor} = require('mathjax3/mathjax3/adaptors/chooseAdaptor');

const app = express();

// Helmet
app.use(helmet());
app.use(bodyParser.urlencoded({extended: true}));

// MathJax bootstrap
const adaptor = chooseAdaptor();
RegisterHTMLHandler(adaptor);

const html = MathJax.document('', {
  InputJax: new TeX(),
  OutputJax: new SVG({fontCache: 'none'}),
});

function tex2svg(equation, isInline, color) {
  return adaptor
    .innerHTML(html.convert(equation, {display: !isInline}))
    .replace(/fill="currentColor"/, `fill="${color}"`);
}

function svg2png(svgString, args = {}) {
  return new Promise((resolve, reject) => {
    svg2img(svgString, args, function(error, buffer) {
      if (error) {
        return reject(error);
      }
      resolve(buffer);
    });
  });
}

// math parser
app.get('/', async function(req, res, next) {
  const mode = Object.keys(req.query).includes('from')
    ? 'block'
    : Object.keys(req.query).includes('inline')
    ? 'inline'
    : null;
  if (!mode) {
    return next();
  }
  const isInline = mode === 'inline';
  const equation = isInline ? req.query.inline : req.query.from;
  if (!equation || equation.match(/\.ico$/)) {
    return next();
  }

  const color = req.query.color || 'black';

  const isPNG = /\.png$/.test(equation);
  const normalizedEquation = equation.replace(/\.(svg|png)$/, '');
  const cacheKey = `${isInline ? 'inline' : 'block'}-${color}-${normalizedEquation}`;
  const cachedData = memCache.get(cacheKey);

  try {
    let image = cachedData || tex2svg(normalizedEquation, isInline, color);
    if (!cachedData) memCache.put(cacheKey, image, 60 * 1000);
    if (isPNG) {
      image = Buffer.from(await svg2png(image), 'base64');
    }

    res.setHeader('cache-control', 's-maxage=604800, maxage=86400');

    // render equation
    if (isPNG) {
      res.contentType('image/png');
    } else {
      res.contentType('image/svg+xml');
      res.write(`<?xml version="1.0" standalone="no" ?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
  `);
    }

    res.end(image);
  } catch (err) {
    res.write('<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-size="15">');
    res.write(err);
    res.end('</text></svg>');
  }
});

// welcome page
app.get('/', function(req, res) {
  res.setHeader('cache-control', 's-maxage=86400, maxage=86400');
  res.sendFile(path.join(__dirname, 'index.html'));
});

// app.listen();
module.exports = app;
