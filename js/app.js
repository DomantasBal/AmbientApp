import { sounds, defaultPresets } from './SoundData.js';
import SoundManager from './SoundManager.js';
import { UI } from './Ui.js';

class AmbientMixer {
  constructor() {
    this.soundManager = new SoundManager();
    this.ui = new UI();
    this.presetManager = null;
    this.timer = null;
    this.currentSoundState = {};
    this.isInitialized = false;
  }

  init() {
    try {
      this.ui.init();
      this.ui.renderSoundCards(sounds);

      this.loadAllSounds();
      this.isInitialized = true;
    } catch (e) {
      console.error('Failed to initialize app: ', error);
    }
  }
  loadAllSounds() {
    sounds.forEach((sound) => {
      const audioUrl = `audio/${sound.file}`;
      const success = this.soundManager.loadSound(sound.id, audioUrl);

      if (!success) {
        console.ward(`Could not load sound: ${sound.name} from ${audioUrl}`);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new AmbientMixer();
  app.init();
});
