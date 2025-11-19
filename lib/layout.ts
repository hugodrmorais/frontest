import type { BlockLayout } from "@/types/sanity";

export function getBlockLayoutClasses(layout?: BlockLayout | null): string {
  const classes: string[] = [];

  // Width & container
  if (!layout || layout.width === "container" || !layout.width) {
    classes.push("mx-auto", "w-full", "max-w-7xl", "px-6");
  } else {
    classes.push("w-full", "px-6");
  }

  // Background & theme
  switch (layout?.background) {
    case "muted":
      classes.push("bg-zinc-100");
      break;
    case "brand":
      classes.push("bg-zinc-900");
      break;
    case "image":
      // background handled via inline style
      break;
    case "default":
    default:
      classes.push("bg-white");
      break;
  }

  if (layout?.theme === "dark" || layout?.background === "brand") {
    classes.push("text-white");
  } else {
    classes.push("text-zinc-900");
  }

  // Alignment
  if (layout?.align === "center") {
    classes.push("text-center");
  }

  // Padding top
  switch (layout?.paddingTop) {
    case "none":
      classes.push("pt-0");
      break;
    case "sm":
      classes.push("pt-4");
      break;
    case "lg":
      classes.push("pt-16");
      break;
    case "md":
    default:
      classes.push("pt-8");
      break;
  }

  // Padding bottom
  switch (layout?.paddingBottom) {
    case "none":
      classes.push("pb-0");
      break;
    case "sm":
      classes.push("pb-4");
      break;
    case "lg":
      classes.push("pb-16");
      break;
    case "md":
    default:
      classes.push("pb-8");
      break;
  }

  return classes.join(" ");
}



