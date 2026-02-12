
import * as Speech from 'expo-speech';
import { Platform } from 'react-native';

export class VoiceService {
  private static instance: VoiceService;
  private isSpeaking = false;

  static getInstance(): VoiceService {
    if (!VoiceService.instance) {
      VoiceService.instance = new VoiceService();
    }
    return VoiceService.instance;
  }

  async speak(text: string, language: 'en' | 'ml' = 'ml'): Promise<void> {
    try {
      if (this.isSpeaking) {
        await this.stop();
      }

      this.isSpeaking = true;
      
      const options: Speech.SpeechOptions = {
        language: language === 'ml' ? 'ml-IN' : 'en-US',
        pitch: 1.0,
        rate: 0.8,
        quality: Speech.VoiceQuality.Enhanced,
        onStart: () => {
          console.log('Speech started');
        },
        onDone: () => {
          console.log('Speech completed');
          this.isSpeaking = false;
        },
        onStopped: () => {
          console.log('Speech stopped');
          this.isSpeaking = false;
        },
        onError: (error) => {
          console.error('Speech error:', error);
          this.isSpeaking = false;
        },
      };

      await Speech.speak(text, options);
    } catch (error) {
      console.error('Error in speech synthesis:', error);
      this.isSpeaking = false;
    }
  }

  async stop(): Promise<void> {
    try {
      await Speech.stop();
      this.isSpeaking = false;
      console.log('Speech stopped');
    } catch (error) {
      console.error('Error stopping speech:', error);
    }
  }

  getIsSpeaking(): boolean {
    return this.isSpeaking;
  }

  // Voice command recognition (simplified - in a real app you'd use a proper STT service)
  async recognizeVoiceCommand(command: string, language: 'en' | 'ml' = 'ml'): Promise<string | null> {
    try {
      // This is a simplified implementation
      // In a real app, you would integrate with Google Speech-to-Text or similar service
      const normalizedCommand = command.toLowerCase().trim();
      
      const commandMappings = {
        'ml': {
          'പ്രൊഫൈൽ ഉണ്ടാക്കുക': 'create_profile',
          'ദൗത്യങ്ങൾ കാണിക്കുക': 'show_missions',
          'ദൗത്യം സ്വീകരിക്കുക': 'accept_mission',
          'ലീഡർബോർഡ് കാണിക്കുക': 'show_leaderboard',
          'ഫോറം കാണിക്കുക': 'show_forum',
          'പ്രൊഫൈൽ കാണിക്കുക': 'show_profile',
          'വീട്ടിലേക്ക് പോകുക': 'go_home',
        },
        'en': {
          'create profile': 'create_profile',
          'show missions': 'show_missions',
          'accept mission': 'accept_mission',
          'show leaderboard': 'show_leaderboard',
          'show forum': 'show_forum',
          'show profile': 'show_profile',
          'go home': 'go_home',
        }
      };

      const mappings = commandMappings[language];
      for (const [phrase, action] of Object.entries(mappings)) {
        if (normalizedCommand.includes(phrase)) {
          return action;
        }
      }

      return null;
    } catch (error) {
      console.error('Error recognizing voice command:', error);
      return null;
    }
  }

  async announceWelcome(userName: string, score: number, language: 'en' | 'ml' = 'ml'): Promise<void> {
    const welcomeText = language === 'ml' 
      ? `സ്വാഗതം ${userName}! നിങ്ങളുടെ സ്കോർ: ${score} പോയിന്റുകൾ`
      : `Welcome ${userName}! Your score: ${score} points`;
    
    await this.speak(welcomeText, language);
  }

  async announceMissionAccepted(missionTitle: string, language: 'en' | 'ml' = 'ml'): Promise<void> {
    const text = language === 'ml'
      ? `ദൗത്യം സ്വീകരിച്ചു: ${missionTitle}`
      : `Mission accepted: ${missionTitle}`;
    
    await this.speak(text, language);
  }

  async announceMissionCompleted(missionTitle: string, points: number, language: 'en' | 'ml' = 'ml'): Promise<void> {
    const text = language === 'ml'
      ? `ദൗത്യം പൂർത്തിയായി: ${missionTitle}. ${points} പോയിന്റുകൾ നേടി!`
      : `Mission completed: ${missionTitle}. Earned ${points} points!`;
    
    await this.speak(text, language);
  }

  async announceBadgeEarned(badgeName: string, language: 'en' | 'ml' = 'ml'): Promise<void> {
    const text = language === 'ml'
      ? `പുതിയ ബാഡ്ജ് നേടി: ${badgeName}!`
      : `New badge earned: ${badgeName}!`;
    
    await this.speak(text, language);
  }

  async readSoilData(soilData: any, language: 'en' | 'ml' = 'ml'): Promise<void> {
    const text = language === 'ml'
      ? `മണ്ണിന്റെ വിവരങ്ങൾ: തരം - ${soilData.typeMalayalam}, ജലാംശം - ${soilData.waterContent}, നൈട്രജൻ - ${soilData.nitrogen}`
      : `Soil information: Type - ${soilData.type}, Water content - ${soilData.waterContent}, Nitrogen - ${soilData.nitrogen}`;
    
    await this.speak(text, language);
  }
}

export const voiceService = VoiceService.getInstance();
