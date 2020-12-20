import express from "express";
import bodyParser from "body-parser";
import helmet from "helmet";
import { tex2svg } from "./adaptor";

const app = express();

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: false }));

app.get("*", async function (req, res, next) {
  const mode = Object.keys(req.query).includes("from")
    ? "block"
    : Object.keys(req.query).includes("inline")
    ? "inline"
    : null;
  if (!mode) {
    return next();
  }
  const isInline = mode === "inline";
  const equation = isInline
    ? (req.query.inline as string)
    : (req.query.from as string);
  if (!equation || equation.match(/\.ico$/)) {
    return next();
  }

  const color = req.query.color as string | undefined;
  const alternateColor = req.query.alternateColor as string | undefined;
  if (
    (color && /[^a-zA-Z0-9#]/.test(color)) ||
    (alternateColor && /[^a-zA-Z0-9#]/.test(alternateColor))
  ) {
    return next();
  }

  const normalizedEquation = equation.replace(/\.(svg|png)$/, "");

  try {
    const svgString = tex2svg(
      normalizedEquation,
      isInline,
      color,
      alternateColor
    );

    res.setHeader("cache-control", "s-maxage=604800, maxage=604800");
    res.contentType("image/svg+xml");
    res.write(`<?xml version="1.0" standalone="no" ?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.0//EN" "http://www.w3.org/TR/2001/REC-SVG-20010904/DTD/svg10.dtd">
`);

    res.end(svgString);
  } catch (err) {
    res.status(500);
    res.write(
      '<svg xmlns="http://www.w3.org/2000/svg"><text x="0" y="15" font-size="15">'
    );
    res.write(err);
    res.end("</text></svg>");
  }
});

app.get("/", function (req, res) {
  res.redirect(301, "/home");
});

export default app;
