import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Alert, Share, StatusBar, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuizStore } from '../store/quizStore';
import { CompassGraph } from '../components/CompassGraph';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { Share2, RefreshCw, Layers, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react-native';

interface QuadrantInfo {
  title: string;
  tagline: string;
  description: string;
  keywords: string[];
  color: string;
}

const GET_QUADRANT_INFO = (x: number, y: number): QuadrantInfo => {
  if (x >= 0 && y >= 0) {
    return {
      title: "상향 권위주의 우파",
      tagline: "질서와 자유시장경제의 수호자",
      description: "개인과 기업의 경제적 자유와 시장 경쟁력을 확고히 지지하면서도, 사회문화적으로는 전통적 도덕 질서와 투철한 국가 안보, 그리고 법질서의 엄격한 확립을 중시하는 성향입니다.",
      keywords: ["법인세 인하", "규제 완화", "안보 자립", "사법적 엄벌주의", "전통주의"],
      color: "#3B82F6"
    };
  } else if (x < 0 && y >= 0) {
    return {
      title: "상향 권위주의 좌파",
      tagline: "조화와 공적 안전망의 설계자",
      description: "자원의 형평성 있는 분배와 사회적 격차 완화를 목표로 국가 경제 개입을 강하게 긍정하지만, 사회적 일탈 방지와 체제 안정을 위해 개인적 표현이나 행위를 국가가 규율해야 한다고 신뢰하는 성향입니다.",
      keywords: ["보편적 복지", "국유화", "행정적 통제", "질서 수호", "공익 우선"],
      color: "#EF4444"
    };
  } else if (x < 0 && y < 0) {
    return {
      title: "하향 자유주의 좌파",
      tagline: "평등과 다양성의 해방가",
      description: "경제 양극화와 시장 독점을 타파하기 위해 정부 차원의 강력한 복지와 분배가 이루어져야 한다고 보면서도, 사생활 보호, 소수자 인권 신장, 예술과 사상의 철저한 개인적 자율을 전폭 옹호하는 성향입니다.",
      keywords: ["양극화 해소", "친노동", "다원주의", "차별 금지", "표현의 자유"],
      color: "#10B981"
    };
  } else {
    return {
      title: "하향 자유주의 우파",
      tagline: "개인의 전적 자율과 혁신의 자유주의자",
      description: "국가의 개입을 극소화하여 세금 및 규제 장벽을 철폐하는 자유시장경제를 절대시하며, 동시에 도덕률이나 안보라는 명목으로 국가가 개인의 자율적 선택과 사생활을 침해해서는 안 된다는 신념의 성향입니다.",
      keywords: ["작은 정부", "세금 최소화", "규제 철폐", "완전한 사생활", "자유시장"],
      color: "#F59E0B"
    };
  }
};

const ViewShotComponent = React.forwardRef(({ children, style, ...props }: any, ref: any) => {
  if (Platform.OS === 'web') {
    return <View style={style}>{children}</View>;
  }
  return (
    <ViewShot ref={ref} style={style} {...props}>
      {children}
    </ViewShot>
  );
});


export default function ResultsScreen() {
  const router = useRouter();
  const { results, demographics, resetQuiz } = useQuizStore();
  const [showReferences, setShowReferences] = useState(true);
  const [isSharing, setIsSharing] = useState(false);
  const viewShotRef = useRef<ViewShot>(null);

  // Fallback coords for debugging in dev mode if store got reset
  const userX = results?.x ?? -2.5;
  const userY = results?.y ?? -4.5;
  const gender = demographics?.gender === 'male' ? '남성' : demographics?.gender === 'female' ? '여성' : '무응답';
  const age = demographics?.ageGroup ? `${demographics.ageGroup.replace('s', '대')}` : '알 수 없음';

  const quad = GET_QUADRANT_INFO(userX, userY);

  const handleShare = async () => {
    if (Platform.OS === 'web') {
      Alert.alert(
        '공유 안내',
        '웹 브라우저에서는 이미지 직접 캡처 기능이 네이티브 모듈 제약으로 제한됩니다. 모바일 기기의 스크린샷 캡처 기능을 이용하여 간편하게 소장 및 공유해 주세요!'
      );
      return;
    }

    if (isSharing) return;
    setIsSharing(true);
    
    try {
      if (viewShotRef.current && viewShotRef.current.capture) {
        const uri = await viewShotRef.current.capture();
        
        const sharingAvailable = await Sharing.isAvailableAsync();
        if (sharingAvailable) {
          await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: '폴리티컬 캠퍼스 KR 정치 성향 진단서',
            UTI: 'public.png'
          });
        } else {
          Alert.alert('공유 불가', '현재 플랫폼에서는 파일 공유 기능이 지원되지 않습니다.');
        }
      } else {
        Alert.alert('공유 오류', '캡처 대상을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('Sharing failed:', error);
      Alert.alert('오류 발생', '결과 이미지를 생성하는 중 예기치 못한 에러가 발생했습니다.');
    } finally {
      setIsSharing(false);
    }
  };

  const handleRestart = () => {
    resetQuiz();
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Step Indicator */}
        <View style={styles.titleBlock}>
          <Text style={styles.stepIndicator}>STEP 02 / 02 완료</Text>
          <Text style={styles.mainTitle}>성향 분석 보고서</Text>
        </View>

        {/* ViewShot Target: We capture this entire elegant card for SNS sharing! */}
        <ViewShotComponent
          ref={viewShotRef}
          options={{ format: 'png', quality: 0.95 }}
          style={styles.captureCard}
        >
          {/* Header Branding (Embedded in saved image for branding) */}
          <View style={styles.brandingHeader}>
            <View style={styles.brandingLogoGroup}>
              <View style={styles.brandingDot} />
              <Text style={styles.brandingLogoText}>폴리티컬 캠퍼스 KR</Text>
            </View>
            <Text style={styles.brandingTag}>내 성향 내비게이터</Text>
          </View>

          {/* Demographics Stamp */}
          <View style={styles.demographicsStamp}>
            <Text style={styles.stampText}>
              분석 참여자: <Text style={styles.stampHighlight}>{age} {gender}</Text>
            </Text>
          </View>

          {/* Core Result Quadrant Title */}
          <View style={styles.resultTitleBox}>
            <Text style={styles.resultIntro}>당신의 종합 정치 성향은</Text>
            <Text style={[styles.resultTitle, { color: quad.color }]}>[{quad.title}]</Text>
            <Text style={styles.resultTagline}>"{quad.tagline}"</Text>
          </View>

          {/* Interactive SVG Compass Graph */}
          <CompassGraph userCoords={{ x: userX, y: userY }} showReferences={showReferences} size={290} />

          {/* Math Coordinates Detail Stamp */}
          <View style={styles.coordsCard}>
            <View style={styles.coordSub}>
              <Text style={styles.coordLabel}>경제 지수 (좌파 / 우파)</Text>
              <Text style={[styles.coordVal, { color: userX >= 0 ? '#3B82F6' : '#10B981' }]}>
                {userX >= 0 ? `우파 +${userX.toFixed(1)}` : `좌파 ${userX.toFixed(1)}`}
              </Text>
            </View>
            <View style={styles.coordDivider} />
            <View style={styles.coordSub}>
              <Text style={styles.coordLabel}>사회 지수 (자유 / 권위)</Text>
              <Text style={[styles.coordVal, { color: userY >= 0 ? '#EF4444' : '#10B981' }]}>
                {userY >= 0 ? `권위주의 +${userY.toFixed(1)}` : `자유주의 ${userY.toFixed(1)}`}
              </Text>
            </View>
          </View>

          {/* Philosophy Detail Box */}
          <View style={styles.philosophyBox}>
            <Text style={styles.philTitle}>대표적 지향점 해설</Text>
            <Text style={styles.philDesc}>{quad.description}</Text>
            
            {/* Keywords Pills */}
            <View style={styles.keywordsGrid}>
              {quad.keywords.map((kw, i) => (
                <View key={i} style={styles.keywordPill}>
                  <CheckCircle2 color={quad.color} size={11} style={{ marginRight: 4 }} />
                  <Text style={styles.keywordText}>{kw}</Text>
                </View>
              ))}
            </View>
          </View>
        </ViewShotComponent>

        {/* Buttons / Actions Block (Outside ViewShot so it's not captured) */}
        <View style={styles.actionsContainer}>
          {/* Overlay Toggle Button */}
          <TouchableOpacity
            style={styles.toggleBtn}
            activeOpacity={0.7}
            onPress={() => setShowReferences(prev => !prev)}
          >
            <Layers color="#6366F1" size={16} style={{ marginRight: 6 }} />
            <Text style={styles.toggleBtnText}>
              {showReferences ? "한국 정치인 비교군 감추기" : "한국 정치인 비교군 표시하기"}
            </Text>
          </TouchableOpacity>

          {/* Share CTA Button */}
          <TouchableOpacity
            style={[styles.btn, styles.shareBtn, isSharing && { opacity: 0.7 }]}
            activeOpacity={0.8}
            onPress={handleShare}
            disabled={isSharing}
          >
            <Share2 color="#FFFFFF" size={18} style={{ marginRight: 8 }} />
            <Text style={styles.btnText}>
              {isSharing ? "이미지 캡처 중..." : "결과 이미지 SNS 공유"}
            </Text>
          </TouchableOpacity>

          {/* Restart Button */}
          <TouchableOpacity
            style={[styles.btn, styles.restartBtn]}
            activeOpacity={0.8}
            onPress={handleRestart}
          >
            <RefreshCw color="#94A3B8" size={16} style={{ marginRight: 8 }} />
            <Text style={styles.restartBtnText}>처음부터 다시 하기</Text>
          </TouchableOpacity>
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
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  titleBlock: {
    marginBottom: 20,
  },
  stepIndicator: {
    color: '#FF4A6B',
    fontSize: 11,
    fontWeight: 'bold',
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  mainTitle: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: 'bold',
  },
  captureCard: {
    backgroundColor: '#0B0F1E',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 24,
    padding: 20,
    marginBottom: 24,
  },
  brandingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#1E293B',
    paddingBottom: 10,
    marginBottom: 16,
  },
  brandingLogoGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FF4A6B',
    marginRight: 6,
  },
  brandingLogoText: {
    color: '#F8FAFC',
    fontSize: 10.5,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  brandingTag: {
    color: '#475569',
    fontSize: 9.5,
    fontWeight: '500',
  },
  demographicsStamp: {
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 14,
    borderWidth: 0.8,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  stampText: {
    color: '#64748B',
    fontSize: 10,
    fontWeight: '500',
  },
  stampHighlight: {
    color: '#6366F1',
    fontWeight: 'bold',
  },
  resultTitleBox: {
    alignItems: 'center',
    marginBottom: 8,
  },
  resultIntro: {
    color: '#64748B',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 2,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  resultTagline: {
    color: '#CBD5E1',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  coordsCard: {
    flexDirection: 'row',
    backgroundColor: '#070A14',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#111827',
  },
  coordSub: {
    flex: 1,
    alignItems: 'center',
  },
  coordLabel: {
    color: '#475569',
    fontSize: 9.5,
    fontWeight: '500',
    marginBottom: 4,
  },
  coordVal: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  coordDivider: {
    width: 1,
    backgroundColor: '#1E293B',
    marginHorizontal: 4,
  },
  philosophyBox: {
    backgroundColor: '#0F1322',
    borderWidth: 1,
    borderColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
  },
  philTitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  philDesc: {
    color: '#64748B',
    fontSize: 11.5,
    lineHeight: 18,
    marginBottom: 14,
  },
  keywordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  keywordPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#070A14',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    borderWidth: 0.8,
    borderColor: '#1E293B',
  },
  keywordText: {
    color: '#CBD5E1',
    fontSize: 10,
    fontWeight: '500',
  },
  actionsContainer: {
    gap: 12,
  },
  toggleBtn: {
    flexDirection: 'row',
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
  },
  toggleBtnText: {
    color: '#6366F1',
    fontSize: 12,
    fontWeight: 'bold',
  },
  btn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareBtn: {
    backgroundColor: '#FF4A6B',
    shadowColor: '#FF4A6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  btnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  restartBtn: {
    backgroundColor: '#0F1322',
    borderWidth: 1.5,
    borderColor: '#1E293B',
  },
  restartBtnText: {
    color: '#94A3B8',
    fontSize: 14,
    fontWeight: 'bold',
  }
});
