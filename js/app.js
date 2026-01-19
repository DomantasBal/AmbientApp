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
    this.masterVolume = 100;
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

    const masterVolumeSlider = document.querySelector('#masterVolume');
    if (masterVolumeSlider) {
      masterVolumeSlider.addEventListener('input', (e) => {
        const volume = parseInt(e.target.value);
        this.setMasterVolume(volume);
      });
    }

    if (this.ui.playPauseButton) {
      this.ui.playPauseButton.addEventListener('click', () => {
        this.toggleAllSounds();
      });
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
    this.updateMainPlayButtonState();
  }

  toggleAllSounds() {
    if (this.soundManager.isPlaying) {
      this.soundManager.pauseAll();
      this.ui.updateMainPlayButton(false);
      sounds.forEach((sound) => {
        this.ui.updateSoundPlayButton(sound.id, false);
      });
    } else {
      for (const [soundId, audio] of this.soundManager.audioElements) {
        const card = document.querySelector(`[data-sound=${soundId}]`);
        const slider = card?.querySelector('volume-slider');

        if (slider) {
          let volume = parseInt(slider.value);

          if (volume === 0) {
            volume = 50;
            slider.value = 50;
            this.ui.updateVolumeDisplay(soundId, 50);
          }

          this.currentSoundState[soundId] = volume;
          const effectiveVolume = (volume * this.masterVolume) / 100;
          audio.volume = effectiveVolume / 100;
          this.ui.updateSoundPlayButton(soundId, true);
        }
      }
      this.soundManager.playAll();
      this.ui.updateMainPlayButton(true);
    }
  }

  setSoundVolume(soundId, volume) {
    const effectiveVolume = (volume * this.masterVolume) / 100;
    const audio = this.soundManager.audioElements.get(soundId);

    if (audio) {
      audio.volume = effectiveVolume / 100;
    }
    this.ui.updateVolumeDisplay(soundId, volume);
    this.updateMainPlayButtonState();
  }

  setMasterVolume(volume) {
    this.masterVolume = volume;
    const masterVolumeValue = document.querySelector('#masterVolumeValue');
    if (masterVolumeValue) {
      masterVolumeValue.textContent = `${volume}%`;
    }

    this.applyMasterVolumeToAll();
  }

  applyMasterVolumeToAll() {
    for (let [soundId, audio] of this.soundManager.audioElements) {
      if (!audio.paused) {
        const card = document.querySelector(`[data-sound=${soundId}]`);
        const slider = card?.querySelector('.volume-slider');

        if (slider) {
          const individualVolume = parseInt(slider.value);
          const effectiveVolume = (individualVolume * this.masterVolume) / 100;

          audio.volume = effectiveVolume / 100;
        }
      }
    }
  }

  updateMainPlayButtonState() {
    let anySoundsPlaying = false;
    for (const [soundId, audio] of this.soundManager.audioElements) {
      if (!audio.paused) {
        anySoundsPlaying = true;
        break;
      }
    }

    this.soundManager.isPlaying = anySoundsPlaying;
    this.ui.updateMainPlayButton(anySoundsPlaying);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const app = new AmbientMixer();
  app.init();
});
