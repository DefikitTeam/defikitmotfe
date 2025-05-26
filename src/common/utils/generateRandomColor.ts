export default function generateRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  // Check if the color is black or white
  if (color === '#000000' || color === '#FFFFFF') {
    // If it is, generate a new color
    return generateRandomColor();
  }
  return color;
}
