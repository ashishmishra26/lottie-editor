import { AnimatedProperty } from "@lottiefiles/lottie-types";

const colorKeys = ["c"];

export const extractColorsFromLayer = (
  layer: Record<string, any>,
  path: string = ""
): Record<string, any> => {
  let colors: Record<string, AnimatedProperty.Color> = {};

  for (const key in layer) {
    const currentPath = path ? `${path}.${key}` : key;
    if (
      colorKeys.includes(key) &&
      layer[key] !== true &&
      typeof layer[key]?.k?.[0] === "number"
    ) {
      colors[currentPath] = layer[key] as AnimatedProperty.Color;
    } else if (typeof layer[key] === "object" && layer[key] !== null) {
      colors = {
        ...colors,
        ...extractColorsFromLayer(layer[key], currentPath),
      };
    }
  }

  return colors;
};

export async function parseJsonFile(file: File) {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();

    fileReader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        resolve(json);
      } catch (error) {
        reject(error);
      }
    };
    fileReader.onerror = (error) => reject(error);
    fileReader.readAsText(file);
  });
}

export function rgbaToLottieColor(rgbaColor: {
  r: number;
  g: number;
  b: number;
  a: number;
}) {
  const { r, g, b, a } = rgbaColor;
  return [r / 255, g / 255, b / 255, a];
}

export function lottieColorToRgba(color: AnimatedProperty.Color) {
  return {
    r: Math.round(typeof color.k[0] === "number" ? color.k[0] * 255 : 0),
    g: Math.round(typeof color.k[1] === "number" ? color.k[1] * 255 : 0),
    b: Math.round(typeof color.k[2] === "number" ? color.k[2] * 255 : 0),
    a: Math.round(typeof color.k[3] === "number" ? color.k[3] : 1),
  };
}
