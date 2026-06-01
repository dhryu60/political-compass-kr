import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, StatusBar, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function IntroScreen() {
  const router = useRouter();
  const [participantCount, setParticipantCount] = useState(14820);
  const [countText, setCountText] = useState("14,820");

  // Mock a live counter to create viral MZ-generation excitement!
  useEffect(() => {
    // Sync to local locale on mount
    setCountText(participantCount.toLocaleString());
    
    const interval = setInterval(() => {
      setParticipantCount(prev => {
        const next = prev + Math.floor(Math.random() * 3) + 1;
        setCountText(next.toLocaleString());
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Header Branding */}
        <View style={styles.header}>
          <Ionicons name="sparkles" color="#6366F1" size={18} />
          <Text style={styles.headerSubtitle}>내 정치 성향 내비게이터</Text>
        </View>

        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.iconContainer}>
            <Ionicons name="compass" color="#FF4A6B" size={48} />
          </View>
          
          <Text style={styles.title}>
            폴리티컬 캠퍼스 <Text style={styles.titleHighlight}>KR</Text>
          </Text>
          
          <Text style={styles.tagline}>
            "당신의 진짜 정치·경제적 위치는 어디입니까?"
          </Text>
          
          <Text style={styles.description}>
            1차원적 진보·보수 프레임을 뛰어넘어, 경제(좌/우)와 사회(권위/자유) 2가지 축으로 구성된 2차원 나침반 위에 당신의 성향을 객관화해 보세요.
          </Text>
        </View>

        {/* Dynamic Social Proof Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.pulseContainer}>
            <View style={styles.pulseDot} />
            <View style={styles.pulseRing} />
          </View>
          <Text style={styles.statsText}>
            현재 <Text style={styles.statsHighlight}>{countText}</Text>명의 유권자가 진단을 마쳤습니다.
          </Text>
        </View>

        {/* Feature Highlights Grid */}
        <View style={styles.featureGrid}>
          <View style={styles.featureItem}>
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.1)' }]}>
              <Ionicons name="flame" color="#EF4444" size={20} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>대한민국 현지화 질문</Text>
              <Text style={styles.featureDesc}>종부세, 대북 정책, 차별금지법 등 한국 정서 맞춤형 의제 분석</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Ionicons name="award" color="#6366F1" size={20} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>역대 정치인과 비교</Text>
              <Text style={styles.featureDesc}>김대중, 노무현, 박정희, 윤석열 등 한국 정치 인물과 성향 비교</Text>
            </View>
          </View>

          <View style={styles.featureItem}>
            <View style={[styles.featureIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Ionicons name="shield-half" color="#10B981" size={20} />
            </View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>익명성 및 민감정보 보호</Text>
              <Text style={styles.featureDesc}>비회원 익명 테스트 및 개인 정보 미수집으로 법적 안심 보장</Text>
            </View>
          </View>
        </View>

        {/* Footer Area with Start Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={styles.startButton} 
            activeOpacity={0.8}
            onPress={() => router.push('/demographics')}
          >
            <Text style={styles.startButtonText}>무료 분석 시작하기</Text>
          </TouchableOpacity>
          <Text style={styles.estimatedTime}>소요 시간 약 3~5분 • 총 30문항</Text>
        </View>

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
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 40,
    backgroundColor: '#0F1322',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  headerSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 6,
    letterSpacing: 0.5,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  iconContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#0F1322',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#334155',
    shadowColor: '#FF4A6B',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  titleHighlight: {
    color: '#FF4A6B',
  },
  tagline: {
    color: '#CBD5E1',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
    paddingHorizontal: 10,
    lineHeight: 22,
  },
  description: {
    color: '#64748B',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 8,
  },
  statsCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1322',
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 32,
    width: '100%',
  },
  pulseContainer: {
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  pulseRing: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#10B981',
    opacity: 0.5,
  },
  statsText: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  statsHighlight: {
    color: '#10B981',
    fontWeight: 'bold',
  },
  featureGrid: {
    width: '100%',
    marginBottom: 40,
    gap: 16,
  },
  featureItem: {
    flexDirection: 'row',
    backgroundColor: '#0A0E1A',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#111827',
  },
  featureIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: '#F1F5F9',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  featureDesc: {
    color: '#64748B',
    fontSize: 11.5,
    lineHeight: 16,
  },
  actionContainer: {
    width: '100%',
    alignItems: 'center',
  },
  startButton: {
    backgroundColor: '#FF4A6B',
    width: '100%',
    paddingVertical: 18,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4A6B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 12,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  estimatedTime: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '500',
  }
});
