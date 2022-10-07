export function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

function smallAndUp(classes: string) {
  return prefixMap("sm", classes);
}

function mediumAndUp(classes: string) {
  return prefixMap("md", classes);
}

function largeAndUp(classes: string) {
  return prefixMap("lg", classes);
}

function prefixMap(prefix: string, classes: string) {
  return classes
    .split(" ")
    .map((s) => `${prefix}:${s}`)
    .join(" ");
}

export const breakpoints = {
  smallAndUp,
  mediumAndUp,
  largeAndUp,
};

