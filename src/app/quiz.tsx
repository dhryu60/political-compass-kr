import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, ScrollView, Animated, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuizStore } from '../store/quizStore';
import { QUESTIONS } from '../data/questions';
import Ionicons from '@expo/vector-icons/Ionicons';

const LIKERT_OPTIONS = [
  { value: -2, label: '매우 반대', color: '#EF4444', bgColor: 'rgba(239, 68, 68, 0.08)', borderColor: '#EF4444' },
  { value: -1, label: '반대', color: '#F97316', bgColor: 'rgba(249, 115, 22, 0.06)', borderColor: '#F97316' },
  { value: 0, label: '보통 / 중립', color: '#64748B', bgColor: 'rgba(100, 116, 139, 0.05)', borderColor: '#475569' },
  { value: 1, label: '찬성', color: '#10B981', bgColor: 'rgba(16, 185, 129, 0.06)', borderColor: '#10B981' },
  { value: 2, label: '매우 찬성', color: '#059669', bgColor: 'rgba(5, 150, 105, 0.08)', borderColor: '#059669' }
];

export default function QuizScreen() {
  const router = useRouter();
  const {
    currentQuestionIndex,
    answers,
    saveAnswer,
    nextQuestion,
    prevQuestion,
    calculateScores
  } = useQuizStore();

  const currentQuestion = QUESTIONS[currentQuestionIndex];
  const selectedValue = answers[currentQuestion.id];

  const progress = (currentQuestionIndex + 1) / QUESTIONS.length;
  const progressPercentage = Math.round(progress * 100);

  const handleSelect = (value: number) => {
    // Save answer
    saveAnswer(currentQuestion.id, value);

    // Auto-advance with a tiny delay for visual feedback
    setTimeout(() => {
      if (currentQuestionIndex < QUESTIONS.length - 1) {
        nextQuestion();
      } else {
        // Last question answered, calculate and route
        calculateScores();
        router.push('/results');
      }
    }, 280);
  };

  const handleFinish = () => {
    calculateScores();
    router.push('/results');
  };

  const isLastQuestion = currentQuestionIndex === QUESTIONS.length - 1;
  const isAnswered = selectedValue !== undefined;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Top Header & Progress */}
      <View style={styles.topBar}>
        <View style={styles.progressTextContainer}>
          <Text style={styles.categoryBadge}>{currentQuestion.category}</Text>
          <Text style={styles.progressCounter}>
            {currentQuestionIndex + 1} <Text style={styles.totalCount}>/ {QUESTIONS.length}</Text>
          </Text>
        </View>
        
        {/* Progress Bar Track */}
        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: `${progressPercentage}%` }]} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        
        {/* Question Card */}
        <View style={styles.card}>
          <View style={styles.helpIconBox}>
            <Ionicons name="help-circle" color="#6366F1" size={24} />
          </View>
          <Text style={styles.questionText}>{currentQuestion.text}</Text>
          <Text style={styles.axisLabel}>
            ({currentQuestion.axis === 'X' ? '경제 분야 의제' : '사회·정치 분야 의제'})
          </Text>
        </View>

        {/* Likert 5-point Option Buttons */}
        <View style={styles.optionsContainer}>
          {LIKERT_OPTIONS.map((opt) => {
            const isSelected = selectedValue === opt.value;
            return (
              <TouchableOpacity
                key={opt.value}
                style={[
                  styles.optionBtn,
                  { borderColor: opt.borderColor, backgroundColor: opt.bgColor },
                  isSelected && {
                    backgroundColor: opt.color,
                    shadowColor: opt.color,
                    shadowOpacity: 0.35,
                    shadowRadius: 10,
                    elevation: 5
                  }
                ]}
                activeOpacity={0.7}
                onPress={() => handleSelect(opt.value)}
              >
                <Text
                  style={[
                    styles.optionText,
                    { color: opt.color },
                    isSelected && { color: '#FFFFFF', fontWeight: 'bold' }
                  ]}
                >
                  {opt.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Navigation Buttons */}
        <View style={styles.navContainer}>
          <TouchableOpacity
            style={[styles.navBtn, currentQuestionIndex === 0 && styles.navBtnDisabled]}
            disabled={currentQuestionIndex === 0}
            activeOpacity={0.7}
            onPress={prevQuestion}
          >
            <Ionicons name="chevron-back" color={currentQuestionIndex === 0 ? '#334155' : '#94A3B8'} size={18} />
            <Text style={[styles.navBtnText, currentQuestionIndex === 0 && styles.navBtnTextDisabled]}>이전</Text>
          </TouchableOpacity>

          {isLastQuestion && isAnswered ? (
            <TouchableOpacity
              style={styles.finishBtn}
              activeOpacity={0.8}
              onPress={handleFinish}
            >
              <Text style={styles.finishBtnText}>결과 분석하기</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.navBtn, !isAnswered && styles.navBtnDisabled]}
              disabled={!isAnswered}
              activeOpacity={0.7}
              onPress={nextQuestion}
            >
              <Text style={[styles.navBtnText, !isAnswered && styles.navBtnTextDisabled]}>다음</Text>
              <Ionicons name="chevron-forward" color={!isAnswered ? '#334155' : '#94A3B8'} size={18} />
            </TouchableOpacity>
          )}
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
  topBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
    backgroundColor: '#05070F',
    borderBottomWidth: 1,
    borderColor: '#0F1322',
  },
  progressTextContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    color: '#6366F1',
    fontSize: 10.5,
    fontWeight: 'bold',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
    textTransform: 'uppercase',
  },
  progressCounter: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: 'bold',
  },
  totalCount: {
    color: '#475569',
    fontSize: 12,
  },
  progressBarTrack: {
    height: 6,
    backgroundColor: '#0F1322',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#FF4A6B',
    borderRadius: 3,
  },
  scrollContainer: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#0F1322',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    borderRadius: 20,
    paddingVertical: 32,
    paddingHorizontal: 24,
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 28,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  helpIconBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(99, 102, 241, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  questionText: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 10,
  },
  axisLabel: {
    color: '#475569',
    fontSize: 11,
    fontWeight: '500',
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 35,
  },
  optionBtn: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  navContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },
  navBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#0F1322',
    borderWidth: 1.5,
    borderColor: '#1E293B',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  navBtnDisabled: {
    borderColor: '#0F1322',
    opacity: 0.4,
  },
  navBtnText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: 'bold',
  },
  navBtnTextDisabled: {
    color: '#334155',
  },
  finishBtn: {
    flex: 1,
    backgroundColor: '#FF4A6B',
    paddingVertical: 14,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#FF4A6B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 3,
  },
  finishBtnText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: 'bold',
  }
});
