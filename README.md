# political-compass-kr

React Native 및 Expo Managed Workflow 기반의 크로스 플랫폼(iOS / Android) 정치 성향 테스트 애플리케이션이다.

## 1. 기술 스택 (Tech Stack)

* **Framework:** React Native + Expo (Managed Workflow)
* **Language:** TypeScript
* **Styling:** Tailwind CSS (NativeWind v4)
* **State Management:** Zustand
* **Icons:** Lucide React Native

## 2. 주요 기능 (Key Features)

* **인구통계학 데이터 입력:** 개인정보(PII)를 수집하지 않는 익명 기반의 성별 및 연령대 선택 화면을 제공한다.
* **퀴즈 엔진:** 5점 리커트 척도(Likert scale) 기반의 단일 문항 출력 방식과 상단 프로그레스 바를 포함한다.
* **성향 연산 로직:** 각 문항의 응답을 경제(X축) 및 사회(Y축) 축으로 매핑하며, 최종 산출 점수는 '-10.0'에서 '+10.0' 사이로 엄격히 정규화된다.
* **결과 시각화:** SVG 기반의 커스텀 2D 산점도 그리드를 통해 사용자의 정치 성향 좌표를 동적으로 표시한다.
* **결과 공유:** 'expo-sharing' 및 'react-native-view-shot'을 활용한 결과 화면 이미지 저장 및 공유 기능을 지원한다.

## 3. 디렉터리 구조 (Directory Structure)

본 프로젝트는 아토믹 디자인(Atomic Design) 패턴 및 로직 분리 원칙을 준수하여 설계되었다.

```text
political-compass-mobile/
├── assets/             # 이미지, 폰트 및 정적 리소스
├── src/
│   ├── app/            # Expo Router 내비게이션 스크린
│   ├── components/     # 재사용 가능한 UI 컴포넌트
│   ├── hooks/          # 커스텀 리액트 훅 (프레젠테이션과 로직 분리)
│   ├── store/          # Zustand 전역 상태 관리 정의
│   └── data/           # 정적 데이터 (퀴즈 문항 및 설정값)
├── instructions.md     # AI 개발 가이드 및 지침서
└── package.json
