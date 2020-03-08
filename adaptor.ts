import svg2img from 'svg2img';
import { mathjax } from 'mathjax-full/js/mathjax';
import { TeX } from 'mathjax-full/js/input/tex';
import { SVG } from 'mathjax-full/js/output/svg';
import { LiteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages';

// MathJax bootstrap
const adaptor = new LiteAdaptor();
RegisterHTMLHandler(adaptor);

const html = mathjax.document('', {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: 'none' }),
});

export function tex2svg(equation: string, isInline: boolean, color: string): string {
  const svg = adaptor
    .innerHTML(html.convert(equation, { display: !isInline }))
    .replace(/fill="currentColor"/, `fill="${color}"`);
  if (svg.includes('merror')) {
    return svg.replace(/<rect.+?><\/rect>/, '');
  }
  return svg;
}

export function svg2png(svgString: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const [width, height] = svgString
      .match(/width="([\d.]+)ex" height="([\d.]+)ex"/)!
      .slice(1)
      .map(s => parseFloat(s));
    const args = {
      width: `${width * 3}ex`,
      height: `${height * 3}ex`,
    };
    svg2img(svgString, args, function(error: Error, buffer: Buffer) {
      if (error) {
        return reject(error);
      }
      resolve(buffer);
    });
  });
}
