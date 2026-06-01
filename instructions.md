# Antigravity Mobile App Development Instructions

## 1. System Overview & Tech Stack
*   **Target:** Cross-platform Mobile Application (iOS / Android)
*   **Framework:** React Native + Expo (Managed Workflow)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS (NativeWind v4)
*   **State Management:** Zustand (Lightweight & Fast)
*   **Icons:** Lucide React Native

## 2. General AI Coding Principles (Strict Rules)
*   **Step-by-Step Execution:** Do NOT write the entire application at once. Complete one file or component, verify it, and then proceed to the next.
*   **Modular Architecture:** Separate presentation components, logical hooks, and data constants. Do not put hundreds of lines of code into a single file.
*   **Type Safety:** Always define strict TypeScript interfaces/types for props, states, and API responses. Avoid using `any`.
*   **Self-Healing & Testing:** After creating or modifying files, check for compilation or TypeScript errors. If an error occurs, fix it immediately before asking the user.

## 3. Directory Structure Standards
All new files must strictly follow this structure:
```text
political-compass-mobile/
├── assets/             # Images, fonts, and static resources
├── src/
│   ├── app/            # Expo Router navigation screens
│   ├── components/     # Reusable UI components (Atomic design)
│   ├── hooks/          # Custom React hooks (Logic separation)
│   ├── store/          # Zustand state management definitions
│   └── data/           # Static constants (Questions, configurations)
├── instructions.md     # This instruction file
└── package.json
```

## 4. Specific Development Guidelines (Political Compass Project)

* **Demographics Screen:** Must require gender and age group selection before starting the quiz. Ensure data anonymization; do not collect PII (Personally Identifiable Information).
* **Quiz Engine:** Render one question at a time with a 5-point Likert scale. Include a top progress bar.
* **Calculation Logic:** Map each response to X (Economic) or Y (Social) axes. Normalize final aggregated scores strictly between -10.0 and +10.0.
* **Visualization:** Use a custom SVG-based 2D scatter plot grid to map the user's coordinate point dynamically, ensuring smooth performance on mobile views.

## 5. Deployment & Build Target

* Optimize configurations for Expo Managed Workflow.
* Ensure all dynamic assets or canvas-to-image sharing features use native capabilities (`expo-sharing`, `react-native-view-shot`).
