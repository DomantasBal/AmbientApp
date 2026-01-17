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
      this.setupEventListeners();
      this.ui.renderSoundCards(sounds);

      this.loadAllSounds();
      this.isInitialized = true;
    } catch (e) {
      console.error('Failed to initialize app: ', error);
    }
  }

  setupEventListeners() {
    document.addEventListener('click', async (e) => {
      if (e.target.closest('.play-btn')) {
        const soundId = e.target.closest('.play-btn').dataset.sound;
        await this.toggleSound(soundId);
      }
    });
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

  async toggleSound(soundId) {
    const audio = this.soundManager.audioElements.get(soundId);

    if (!audio) {
      console.error(`Sound ${soundId} not found`);
      return false;
    }

    if (audio.paused) {
      this.soundManager.setVolume(soundId, 50);
      await this.soundManager.playSound(soundId);
      this.ui.updateSoundPlayButton(soundId, true);
    } else {
      this.soundManager.pauseSound(soundId);
      this.ui.updateSoundPlayButton(soundId, false);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new AmbientMixer();
  app.init();
});
