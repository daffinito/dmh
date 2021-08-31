class HelpersService {
  constructor() {}

  randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async wait(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
  }
}

export default HelpersService;
