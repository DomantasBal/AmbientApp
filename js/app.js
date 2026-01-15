import { sounds, defaultPresets } from './SoundData.js';
import SoundManager from './SoundManager.js';

class AmbientMixer {
  constructor() {
    this.soundManager = new SoundManager();
    this.ui = null;
    this.presetManager = null;
    this.timer = null;
    this.currentSoundState = {};
    this.isInitialized = false;
  }

  init() {
    try {
      this.soundManager.loadSound('rain', 'audio/rain.mp3');
      this.isInitialized = true;
    } catch (e) {
      console.error('Failed to initialize app: ', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new AmbientMixer();
  app.init();
});
