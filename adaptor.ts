import { mathjax } from "mathjax-full/js/mathjax";
import { TeX } from "mathjax-full/js/input/tex";
import { SVG } from "mathjax-full/js/output/svg";
import { LiteAdaptor } from "mathjax-full/js/adaptors/liteAdaptor";
import { RegisterHTMLHandler } from "mathjax-full/js/handlers/html";
import { AllPackages } from "mathjax-full/js/input/tex/AllPackages";
import { colord, extend } from "colord";
import harmoniesPlugin from "colord/plugins/harmonies";
import namesPlugin from "colord/plugins/names";

// Colord bootstrap
extend([namesPlugin, harmoniesPlugin]);

// MathJax bootstrap
const adaptor = new LiteAdaptor();
RegisterHTMLHandler(adaptor);

const html = mathjax.document("", {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: "none" }),
});

export function tex2svg(
  equation: string,
  isInline: boolean,
  color: string = "black",
  bgColor?: string
): string {
  const autoBg = colord(color).isDark() ? "white" : "black";
  const bg = bgColor === "auto" ? autoBg : bgColor;

  const svg = adaptor
    .innerHTML(html.convert(equation, { display: !isInline }))
    .replace(
      /(?<=<svg.+?>)/,
      `
<style>
  * {
    fill: ${color};
    background-color: ${bg ?? "transparent"};
  }
</style>`
    );
  if (svg.includes("merror")) {
    return svg.replace(/<rect.+?><\/rect>/, "");
  }
  return svg;
}
