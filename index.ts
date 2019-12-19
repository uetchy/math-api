import helmet from "helmet";
import express from "express";
import svg2img from "svg2img";
import bodyParser from "body-parser";
import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import { LiteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages";

const app = express();

// Helmet
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));

// MathJax bootstrap
const adaptor = new LiteAdaptor();
RegisterHTMLHandler(adaptor);
const html = mathjax.document("", {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: "none" })
});

function tex2svg(equation: string, isInline: boolean, color: string): string {
  const svg = adaptor
    .innerHTML(html.convert(equation, { display: !isInline }))
    .replace(/fill="currentColor"/, `fill="${color}"`);
  if (svg.includes("merror")) {
    return svg.replace(/<rect.+?><\/rect>/, "");
  }
  return svg;
}

function svg2png(svgString: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const [width, height] = svgString
      .match(/width="([\d.]+)ex" height="([\d.]+)ex"/)!
      .slice(1)
      .map(s => parseFloat(s));

    const args = {
      width: `${width * 3}ex`,
      height: `${height * 3}ex`
    };

    svg2img(svgString, args, function(error: Error, buffer: Buffer) {
      if (error) {
        return reject(error);
      }
      resolve(buffer);
    });
  });
}

// math parser
app.get("/", async function(req, res, next) {
  const mode = Object.keys(req.query).includes("from")
    ? "block"
    : Object.keys(req.query).includes("inline")
    ? "inline"
    : null;
  if (!mode) {
    return next();
  }
  const isInline = mode === "inline";
  const equation = isInline ? req.query.inline : req.query.from;
  if (!equation || equation.match(/\.ico$/)) {
    return next();
  }

  const color = req.query.color || "black";
  if (/[^a-zA-Z0-9#]/.test(color)) {
    return next();
  }

  const isPNG = /\.png$/.test(equation);
  const normalizedEquation = equation.replace(/\.(svg|png)$/, "");

  try {
    const svgString = tex2svg(normalizedEquation, isInline, color);
    const imageData = isPNG ? await svg2png(svgString) : svgString;

    res.setHeader("cache-control", "s-maxage=604800, maxage=604800");

    // render equation
    if (isPNG) {
      res.contentType("image/png");
    } else {
      res.contentType("image/svg+xml");
      res.write(`<?xml version="1.0" standalone="no" ?>
  <!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
  `);
    }

    res.end(imageData);
  } catch (err) {
    res.write(
      '<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-size="15">'
    );
    res.write(err);
    res.end("</text></svg>");
  }
});

// welcome page
app.get("/", function(req, res) {
  res.redirect(301, "/home");
});

// app.listen();
export default app;
