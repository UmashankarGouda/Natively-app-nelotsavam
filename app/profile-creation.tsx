
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { router } from 'expo-router';
import { Button } from '../components/button';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { voiceService } from '../services/voiceService';
import { useApp } from '../contexts/AppContext';
import { User } from '../types';
import { KERALA_DISTRICTS, KERALA_DISTRICTS_MALAYALAM } from '../types';
import { MOCK_SOIL_DATA } from '../data/mockData';
import { t } from '../utils/translations';

export default function ProfileCreationScreen() {
  const { saveUserData, state } = useApp();
  const [name, setName] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [acres, setAcres] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreateProfile = async () => {
    if (!name.trim()) {
      Alert.alert(t('nameRequired', state.language), t('pleaseEnterName', state.language));
      voiceService.speak('ദയവായി നിങ്ങളുടെ പേര് നൽകുക', 'ml');
      return;
    }

    if (!selectedDistrict) {
      Alert.alert(t('districtRequired', state.language), t('pleaseSelectDistrict', state.language));
      voiceService.speak('ദയവായി നിങ്ങളുടെ ജില്ല തിരഞ്ഞെടുക്കുക', 'ml');
      return;
    }

    const acresNum = parseFloat(acres);
    if (!acres || isNaN(acresNum) || acresNum < 0.1 || acresNum > 100) {
      Alert.alert(t('invalidAcres', state.language), t('pleaseEnterValidAcres', state.language));
      voiceService.speak('ദയവായി സാധുവായ ഏക്കർ നൽകുക', 'ml');
      return;
    }

    setIsLoading(true);

    try {
      const newUser: User = {
        id: Date.now().toString(),
        name: name.trim(),
        location: selectedDistrict,
        district: selectedDistrict,
        acres: acresNum,
        crops: [],
        score: 0,
        badges: [],
        createdAt: new Date(),
      };

      await saveUserData(newUser);

      // Announce profile creation success
      voiceService.speak(`പ്രൊഫൈൽ സൃഷ്ടിച്ചു. സ്വാഗതം ${name}!`, 'ml');

      // Read soil data
      setTimeout(() => {
        voiceService.readSoilData(MOCK_SOIL_DATA, 'ml');
      }, 2000);

      router.replace('/crop-selection');
    } catch (error) {
      console.error('Error creating profile:', error);
      Alert.alert(t('error', state.language), t('profileCreationError', state.language));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>👤</Text>
        <Text style={[commonStyles.title, styles.title]}>{t('createProfile', state.language)}</Text>
      </View>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('name', state.language)} *</Text>
          <TextInput
            style={commonStyles.input}
            value={name}
            onChangeText={setName}
            placeholder={t('enterName', state.language)}
            placeholderTextColor={colors.grey}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('location', state.language)} *</Text>
          <View style={commonStyles.picker}>
            <Picker
              selectedValue={selectedDistrict}
              onValueChange={setSelectedDistrict}
              style={styles.pickerStyle}
            >
              <Picker.Item label={t('selectDistrict', state.language)} value="" />
              {KERALA_DISTRICTS.map((district, index) => (
                <Picker.Item
                  key={district}
                  label={state.language.code === 'ml' ? `${KERALA_DISTRICTS_MALAYALAM[index]}` : district}
                  value={district}
                />
              ))}
            </Picker>
          </View>
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>{t('farmSize', state.language)} *</Text>
          <TextInput
            style={commonStyles.input}
            value={acres}
            onChangeText={setAcres}
            placeholder={t('enterAcres', state.language)}
            placeholderTextColor={colors.grey}
            keyboardType="decimal-pad"
          />
        </View>

        <View style={[commonStyles.card, styles.soilCard]}>
          <Text style={[commonStyles.subtitle, styles.soilTitle]}>
            {t('soilInformation', state.language)}
          </Text>
          <View style={styles.soilInfo}>
            <View style={styles.soilRow}>
              <Text style={styles.soilLabel}>{t('soilType', state.language)}:</Text>
              <Text style={styles.soilValue}>
                {state.language.code === 'ml' ? MOCK_SOIL_DATA.typeMalayalam : MOCK_SOIL_DATA.type}
              </Text>
            </View>
            <View style={styles.soilRow}>
              <Text style={styles.soilLabel}>{t('waterContent', state.language)}:</Text>
              <Text style={styles.soilValue}>{MOCK_SOIL_DATA.waterContent}</Text>
            </View>
            <View style={styles.soilRow}>
              <Text style={styles.soilLabel}>{t('nitrogen', state.language)}:</Text>
              <Text style={styles.soilValue}>{MOCK_SOIL_DATA.nitrogen}</Text>
            </View>
            <View style={styles.soilRow}>
              <Text style={styles.soilLabel}>{t('phosphorus', state.language)}:</Text>
              <Text style={styles.soilValue}>{MOCK_SOIL_DATA.phosphorus}</Text>
            </View>
            <View style={styles.soilRow}>
              <Text style={styles.soilLabel}>{t('potassium', state.language)}:</Text>
              <Text style={styles.soilValue}>{MOCK_SOIL_DATA.potassium}</Text>
            </View>
          </View>
          <Text style={[commonStyles.text, styles.soilDescription]}>
            {state.language.code === 'ml' ? MOCK_SOIL_DATA.descriptionMalayalam : MOCK_SOIL_DATA.description}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleCreateProfile}
          loading={isLoading}
          disabled={isLoading}
          style={buttonStyles.primaryButton}
        >
          <Text style={styles.buttonText}>
            {isLoading ? t('creating', state.language) : t('createProfile', state.language)}
          </Text>
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  icon: {
    fontSize: 60,
    marginBottom: 16,
  },
  title: {
    marginBottom: 8,
  },
  subtitle: {
    color: colors.grey,
    fontSize: 16,
  },
  formContainer: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  pickerStyle: {
    color: colors.text,
  },
  soilCard: {
    marginTop: 20,
    backgroundColor: colors.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: colors.soil,
  },
  soilTitle: {
    color: colors.text,
    marginBottom: 16,
  },
  soilInfo: {
    marginBottom: 16,
  },
  soilRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  soilLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    flex: 1,
  },
  soilValue: {
    fontSize: 14,
    color: colors.soil,
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  soilDescription: {
    fontSize: 14,
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 20,
  },
  buttonContainer: {
    paddingTop: 32,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
