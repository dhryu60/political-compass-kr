import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuizStore } from '../store/quizStore';
import { ArrowRight, ShieldCheck, UserCheck } from 'lucide-react-native';

const GENDERS = [
  { key: 'male', label: '남성' },
  { key: 'female', label: '여성' },
  { key: 'other', label: '기타 / 무응답' }
];

const AGE_GROUPS = [
  { key: '10s', label: '10대 이하' },
  { key: '20s', label: '20대' },
  { key: '30s', label: '30대' },
  { key: '40s', label: '40대' },
  { key: '50s', label: '50대' },
  { key: '60s', label: '60대 이상' }
];

export default function DemographicsScreen() {
  const router = useRouter();
  const setDemographics = useQuizStore((state) => state.setDemographics);

  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [selectedAge, setSelectedAge] = useState<string | null>(null);

  const handleStartQuiz = () => {
    if (!selectedGender || !selectedAge) {
      Alert.alert('확인 필요', '원활한 통계 비교 분석을 위해 성별과 연령대를 선택해 주세요.');
      return;
    }
    
    // Save to Zustand Store
    setDemographics(selectedGender, selectedAge);
    
    // Route to Quiz Page
    router.push('/quiz');
  };

  const isFormValid = selectedGender && selectedAge;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Title Indicator */}
        <View style={styles.header}>
          <Text style={styles.stepIndicator}>STEP 01 / 02</Text>
          <Text style={styles.title}>기본 정보 선택</Text>
          <Text style={styles.subtitle}>
            인구통계학적 비교 및 통계 결과 도출을 위해 성별과 연령대를 선택해 주세요.
          </Text>
        </View>

        {/* Gender Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>성별</Text>
          <View style={styles.genderGrid}>
            {GENDERS.map((g) => {
              const isSelected = selectedGender === g.key;
              return (
                <TouchableOpacity
                  key={g.key}
                  style={[
                    styles.card,
                    isSelected && styles.cardSelected
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedGender(g.key)}
                >
                  <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>
                    {g.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Age Group Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>연령대</Text>
          <View style={styles.ageGrid}>
            {AGE_GROUPS.map((a) => {
              const isSelected = selectedAge === a.key;
              return (
                <TouchableOpacity
                  key={a.key}
                  style={[
                    styles.card,
                    styles.ageCard,
                    isSelected && styles.cardSelected
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setSelectedAge(a.key)}
                >
                  <Text style={[styles.cardText, isSelected && styles.cardTextSelected]}>
                    {a.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Legal Anonymity Alert */}
        <View style={styles.anonymityInfo}>
          <ShieldCheck color="#10B981" size={18} style={styles.infoIcon} />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>익명성 100% 보장</Text>
            <Text style={styles.infoText}>
              본 테스트는 회원 가입 없이 완전히 익명으로 실행됩니다. 이름, 전화번호, 기기 정보 등 사용자를 식별할 수 있는 어떠한 민감 정보(PII)도 절대 서버로 수집하거나 저장하지 않습니다.
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            !isFormValid && styles.submitButtonDisabled
          ]}
          disabled={!isFormValid}
          activeOpacity={0.8}
          onPress={handleStartQuiz}
        >
          <Text style={styles.submitButtonText}>정치 성향 테스트 시작</Text>
          <ArrowRight color={isFormValid ? '#FFFFFF' : '#475569'} size={18} style={styles.btnIcon} />
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05070F',
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 30,
  },
  stepIndicator: {
    color: '#FF4A6B',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 8,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#64748B',
    fontSize: 13,
    lineHeight: 18,
  },
  section: {
    marginBottom: 28,
  },
  sectionTitle: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  genderGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  ageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  card: {
    flex: 1,
    backgroundColor: '#0F1322',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageCard: {
    flex: 0,
    width: '48%', // Show 2 items per row
  },
  cardSelected: {
    backgroundColor: 'rgba(255, 74, 107, 0.08)',
    borderColor: '#FF4A6B',
    shadowColor: '#FF4A6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  cardText: {
    color: '#64748B',
    fontSize: 13.5,
    fontWeight: 'bold',
  },
  cardTextSelected: {
    color: '#FF4A6B',
  },
  anonymityInfo: {
    flexDirection: 'row',
    backgroundColor: '#0A0E1A',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 35,
    alignItems: 'flex-start',
  },
  infoIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoText: {
    color: '#475569',
    fontSize: 11.5,
    lineHeight: 16,
  },
  submitButton: {
    backgroundColor: '#FF4A6B',
    flexDirection: 'row',
    paddingVertical: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4A6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  submitButtonDisabled: {
    backgroundColor: '#0F1322',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    shadowOpacity: 0,
    elevation: 0,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  submitButtonDisabledText: {
    color: '#475569',
  },
  btnIcon: {
    marginLeft: 8,
  }
});
