
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Alert } from 'react-native';
import { useApp } from '../contexts/AppContext';
import { commonStyles, colors } from '../styles/commonStyles';
import { t } from '../utils/translations';
import { AppLanguage } from '../types';

const AVAILABLE_LANGUAGES: AppLanguage[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' }
];

interface LanguageSelectorProps {
  showLabel?: boolean;
  style?: any;
}

export function LanguageSelector({ showLabel = true, style }: LanguageSelectorProps) {
  const { state, changeLanguage } = useApp();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLanguageChange = async (language: AppLanguage) => {
    try {
      await changeLanguage(language);
      setModalVisible(false);
      Alert.alert(
        t('language', state.language),
        t('languageChanged', language)
      );
    } catch (error) {
      console.error('Error changing language:', error);
    }
  };

  return (
    <View style={[styles.container, style]}>
      {showLabel && (
        <Text style={styles.label}>{t('language', state.language)}</Text>
      )}
      
      <TouchableOpacity
        style={styles.selector}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.currentLanguage}>
          {state.language.nativeName}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t('selectLanguage', state.language)}
            </Text>
            
            {AVAILABLE_LANGUAGES.map((language) => (
              <TouchableOpacity
                key={language.code}
                style={[
                  styles.languageOption,
                  state.language.code === language.code && styles.selectedLanguage
                ]}
                onPress={() => handleLanguageChange(language)}
              >
                <Text style={[
                  styles.languageText,
                  state.language.code === language.code && styles.selectedLanguageText
                ]}>
                  {language.nativeName}
                </Text>
                {state.language.code === language.code && (
                  <Text style={styles.checkmark}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.cancelText}>
                {t('cancel', state.language)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  selector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.grey + '40',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  currentLanguage: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  arrow: {
    fontSize: 12,
    color: colors.grey,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.background,
    borderRadius: 16,
    padding: 24,
    width: '80%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedLanguage: {
    backgroundColor: colors.primary + '20',
  },
  languageText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  selectedLanguageText: {
    color: colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: colors.grey,
    fontWeight: '500',
  },
});
