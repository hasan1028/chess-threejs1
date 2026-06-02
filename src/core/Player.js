export default class Player {
  constructor(name, color, isAI = false) {
    this.name = name;
    this.color = color;
    this.isAI = isAI;
  }

  getInfo() {
    return {
      name: this.name,
      color: this.color,
      isAI: this.isAI,
    };
  }
}
