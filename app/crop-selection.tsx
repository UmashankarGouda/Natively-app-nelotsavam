
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { Button } from '../components/button';
import { commonStyles, colors, buttonStyles } from '../styles/commonStyles';
import { voiceService } from '../services/voiceService';
import { useApp } from '../contexts/AppContext';
import { AVAILABLE_CROPS } from '../data/mockData';
import { Crop } from '../types';
import { t } from '../utils/translations';

export default function CropSelectionScreen() {
  const { state, saveUserData } = useApp();
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    // Voice prompt for crop selection
    voiceService.speak('ഏത് വിളകളാണ് നിങ്ങൾ കൃഷി ചെയ്യുന്നത്? കാർഡുകൾ തിരഞ്ഞെടുക്കുക', 'ml');
  }, []);

  const toggleCropSelection = (cropId: string) => {
    setSelectedCrops(prev => {
      if (prev.includes(cropId)) {
        return prev.filter(id => id !== cropId);
      } else {
        return [...prev, cropId];
      }
    });
  };

  const handleContinue = async () => {
    if (selectedCrops.length === 0) {
      Alert.alert(t('selectCrops', state.language), t('selectAtLeastOne', state.language));
      voiceService.speak('ദയവായി കുറഞ്ഞത് ഒരു വിള തിരഞ്ഞെടുക്കുക', 'ml');
      return;
    }

    if (!state.user) {
      Alert.alert(t('error', state.language), 'User data not found');
      return;
    }

    setIsLoading(true);

    try {
      const selectedCropNames = selectedCrops.map(cropId => {
        const crop = AVAILABLE_CROPS.find(c => c.id === cropId);
        return crop ? crop.name : '';
      }).filter(Boolean);

      const updatedUser = {
        ...state.user,
        crops: selectedCropNames,
      };

      await saveUserData(updatedUser);

      // Announce selection
      const cropNamesML = selectedCrops.map(cropId => {
        const crop = AVAILABLE_CROPS.find(c => c.id === cropId);
        return crop ? crop.nameMalayalam : '';
      }).filter(Boolean);

      voiceService.speak(`തിരഞ്ഞെടുത്ത വിളകൾ: ${cropNamesML.join(', ')}. ഡാഷ്ബോർഡിലേക്ക് പോകുന്നു`, 'ml');

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving crop selection:', error);
      Alert.alert(t('error', state.language), 'Error saving crop selection');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={commonStyles.wrapper} contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.icon}>🌾</Text>
        <Text style={[commonStyles.title, styles.title]}>{t('selectCrops', state.language)}</Text>
        <Text style={[commonStyles.text, styles.description]}>
          {t('chooseCrops', state.language)}
        </Text>
      </View>

      <View style={styles.cropsContainer}>
        {AVAILABLE_CROPS.map((crop) => (
          <TouchableOpacity
            key={crop.id}
            style={[
              commonStyles.cropCard,
              selectedCrops.includes(crop.id) && commonStyles.selectedCropCard,
            ]}
            onPress={() => toggleCropSelection(crop.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.cropIcon}>{crop.icon}</Text>
            <Text style={styles.cropName}>
              {state.language.code === 'ml' ? crop.nameMalayalam : crop.name}
            </Text>
            <Text style={styles.cropDescription}>
              {state.language.code === 'ml' ? crop.descriptionMalayalam : crop.description}
            </Text>
            {selectedCrops.includes(crop.id) && (
              <View style={styles.selectedIndicator}>
                <Text style={styles.checkmark}>✓</Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </View>

      {selectedCrops.length > 0 && (
        <View style={styles.selectionSummary}>
          <Text style={styles.selectionTitle}>
            {state.language.code === 'ml' ? 'തിരഞ്ഞെടുത്ത വിളകൾ:' : 'Selected Crops:'}
          </Text>
          <View style={styles.selectedCropsList}>
            {selectedCrops.map(cropId => {
              const crop = AVAILABLE_CROPS.find(c => c.id === cropId);
              return crop ? (
                <View key={cropId} style={styles.selectedCropItem}>
                  <Text style={styles.selectedCropText}>
                    {crop.icon} {state.language.code === 'ml' ? crop.nameMalayalam : crop.name}
                  </Text>
                </View>
              ) : null;
            })}
          </View>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <Button
          onPress={handleContinue}
          loading={isLoading}
          disabled={isLoading || selectedCrops.length === 0}
          style={[
            buttonStyles.primaryButton,
            selectedCrops.length === 0 && styles.disabledButton,
          ]}
        >
          <Text style={styles.buttonText}>
            {isLoading ? (state.language.code === 'ml' ? 'സേവ് ചെയ്യുന്നു...' : 'Saving...') : t('continue', state.language)}
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

  description: {
    textAlign: 'center',
    color: colors.text,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  cropsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  cropIcon: {
    fontSize: 40,
    marginBottom: 8,
  },
  cropName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 4,
  },

  cropDescription: {
    fontSize: 12,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 16,
  },
  selectedIndicator: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: colors.primary,
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkmark: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectionSummary: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  selectedCropsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  selectedCropItem: {
    backgroundColor: colors.primary + '20',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  selectedCropText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '500',
  },
  buttonContainer: {
    paddingTop: 16,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    backgroundColor: colors.grey + '50',
  },
});
