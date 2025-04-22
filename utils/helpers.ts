export function getInitials(name: string | undefined): string {
  if (name) {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  } else {
    return "";
  }
}