import * as Speech from 'expo-speech';

export class VoiceService {
  private static isSpeaking: boolean = false;
  public static isVoiceEnabled: boolean = true;

  public static toggleVoice(): boolean {
    this.isVoiceEnabled = !this.isVoiceEnabled;
    if (!this.isVoiceEnabled) {
      this.stop();
    }
    return this.isVoiceEnabled;
  }

  /**
   * Speaks a text instruction clearly using text-to-speech
   */
  public static speak(text: string, onDone?: () => void): void {
    if (!this.isVoiceEnabled) {
      if (onDone) onDone();
      return;
    }
    
    try {
      if (this.isSpeaking) {
        Speech.stop();
      }
      this.isSpeaking = true;
      Speech.speak(text, {
        language: 'en-US',
        pitch: 1.0,
        rate: 0.85, // Slightly slower rate for elderly accessibility
        onDone: () => {
          this.isSpeaking = false;
          if (onDone) onDone();
        },
        onError: (err) => {
          this.isSpeaking = false;
          console.warn('Speech TTS warning:', err);
        },
      });
    } catch (err) {
      console.warn('Speech service unavailable:', err);
    }
  }

  /**
   * Stops active speech narration
   */
  public static stop(): void {
    try {
      Speech.stop();
      this.isSpeaking = false;
    } catch (err) {
      console.warn('Error stopping speech:', err);
    }
  }
}
