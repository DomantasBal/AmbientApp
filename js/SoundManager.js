export default class SoundManager {
  constructor() {
    this.audioElements = new Map();
    this.isPlaying = false;
  }

  loadSound(soundId, filePath) {
    try {
      const audio = new Audio();
      audio.src = filePath;
      audio.loop = true;
      audio.preload = 'metadata';

      this.audioElements.set(soundId, audio);
      return true;
    } catch (e) {
      console.error(`Failed to load sound ${soundId}`);
      return false;
    }
  }
}
