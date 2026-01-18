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

    document.addEventListener('input', (e) => {
      if (e.target.classList.contains('volume-slider')) {
        const soundId = e.target.dataset.sound;
        const volume = parseInt(e.target.value);
        this.setSoundVolume(soundId, volume);
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
      const card = document.querySelector(`[data-sound="${soundId}"]`);
      const slider = card.querySelector('.volume-slider');
      let volume = parseInt(slider.value);

      if (volume === 0) {
        volume = 15;
        this.ui.updateVolumeDisplay(soundId, volume);
      }

      this.soundManager.setVolume(soundId, volume);
      await this.soundManager.playSound(soundId);
      this.ui.updateSoundPlayButton(soundId, true);
    } else {
      this.soundManager.pauseSound(soundId);
      this.ui.updateSoundPlayButton(soundId, false);
    }
  }

  setSoundVolume(soundId, volume) {
    this.soundManager.setVolume(soundId, volume);
    this.ui.updateVolumeDisplay(soundId, volume);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new AmbientMixer();
  app.init();
});
