const colors = ["#35D461", "#F9E104", "#F99D07", "#882FF6", "#37B6F6"];

export function getRandomColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
