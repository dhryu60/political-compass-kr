import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Rect, Line, Circle, Text as SvgText, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { REFERENCE_POINTS } from '../data/questions';

interface CompassGraphProps {
  userCoords: { x: number; y: number } | null;
  showReferences?: boolean;
  size?: number;
}

export const CompassGraph: React.FC<CompassGraphProps> = ({
  userCoords,
  showReferences = true,
  size = 320
}) => {
  const half = size / 2;
  const scale = (size - 40) / 20; // 20 units total (-10 to +10), leave 20px padding on each side

  // Translate math coordinates to SVG viewport coordinates
  const getSvgCoords = (x: number, y: number) => {
    const svgX = half + x * scale;
    // Y-axis is inverted in SVG (positive math Y is top, smaller SVG Y is top)
    const svgY = half - y * scale;
    return { x: svgX, y: svgY };
  };

  const userPoint = userCoords ? getSvgCoords(userCoords.x, userCoords.y) : null;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          {/* Quadrant Background Gradients with Glassy Dark Mode Aesthetics */}
          {/* Top Left: Authoritarian Left (Pink/Reddish tint) */}
          <LinearGradient id="topLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#4A1D2E" stopOpacity={0.85} />
            <Stop offset="100%" stopColor="#1E1B29" stopOpacity={0.6} />
          </LinearGradient>
          {/* Top Right: Authoritarian Right (Blue/Indigo tint) */}
          <LinearGradient id="topRightGrad" x1="100%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#1E293B" stopOpacity={0.85} />
            <Stop offset="100%" stopColor="#181824" stopOpacity={0.6} />
          </LinearGradient>
          {/* Bottom Left: Libertarian Left (Green/Teal tint) */}
          <LinearGradient id="bottomLeftGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#1C352D" stopOpacity={0.85} />
            <Stop offset="100%" stopColor="#141F23" stopOpacity={0.6} />
          </LinearGradient>
          {/* Bottom Right: Libertarian Right (Yellow/Amber tint) */}
          <LinearGradient id="bottomRightGrad" x1="100%" y1="100%" x2="0%" y2="0%">
            <Stop offset="0%" stopColor="#4B3F1D" stopOpacity={0.85} />
            <Stop offset="100%" stopColor="#221D1E" stopOpacity={0.6} />
          </LinearGradient>

          {/* User Pulsing Indicator Glow */}
          <LinearGradient id="userGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FF4A6B" stopOpacity={0.8} />
            <Stop offset="100%" stopColor="#FF8855" stopOpacity={0.2} />
          </LinearGradient>
        </Defs>

        {/* 4 Quadrants Background Grid */}
        <G id="quadrants">
          {/* Top Left: Authoritarian Left */}
          <Rect
            x={20}
            y={20}
            width={half - 20}
            height={half - 20}
            fill="url(#topLeftGrad)"
            rx={8}
          />
          {/* Top Right: Authoritarian Right */}
          <Rect
            x={half}
            y={20}
            width={half - 20}
            height={half - 20}
            fill="url(#topRightGrad)"
            rx={8}
          />
          {/* Bottom Left: Libertarian Left */}
          <Rect
            x={20}
            y={half}
            width={half - 20}
            height={half - 20}
            fill="url(#bottomLeftGrad)"
            rx={8}
          />
          {/* Bottom Right: Libertarian Right */}
          <Rect
            x={half}
            y={half}
            width={half - 20}
            height={half - 20}
            fill="url(#bottomRightGrad)"
            rx={8}
          />
        </G>

        {/* Subtle Grid Lines */}
        <G stroke="#334155" strokeWidth={1} strokeDasharray="3,3" opacity={0.35}>
          {/* Vertical Grid Lines */}
          {[-8, -6, -4, -2, 2, 4, 6, 8].map((val) => {
            const pos = getSvgCoords(val, 0);
            return (
              <React.Fragment key={`v-${val}`}>
                <Line x1={pos.x} y1={20} x2={pos.x} y2={size - 20} />
                <Line x1={20} y1={pos.y} x2={size - 20} y2={pos.y} />
              </React.Fragment>
            );
          })}
        </G>

        {/* Main XY Axes */}
        <G stroke="#64748B" strokeWidth={2}>
          {/* X Axis */}
          <Line x1={15} y1={half} x2={size - 15} y2={half} />
          {/* Y Axis */}
          <Line x1={half} y1={15} x2={half} y2={size - 15} />
        </G>

        {/* Quadrant Text Labels inside Grid Corners */}
        <G fontSize={10} fill="#94A3B8" fontWeight="bold" opacity={0.7}>
          <SvgText x={30} y={35}>상향 권위주의 좌파</SvgText>
          <SvgText x={size - 115} y={35}>상향 권위주의 우파</SvgText>
          <SvgText x={30} y={size - 27}>하향 자유주의 좌파</SvgText>
          <SvgText x={size - 115} y={size - 27}>하향 자유주의 우파</SvgText>
        </G>

        {/* Axis Title Labels */}
        <G fontSize={11} fill="#F8FAFC" fontWeight="bold">
          {/* Y Axis Top Label */}
          <SvgText x={half} y={13} textAnchor="middle">권위주의 (Authoritarian)</SvgText>
          {/* Y Axis Bottom Label */}
          <SvgText x={half} y={size - 4} textAnchor="middle">자유주의 (Libertarian)</SvgText>
          {/* X Axis Left Label */}
          <SvgText x={4} y={half + 4} textAnchor="start">좌파</SvgText>
          {/* X Axis Right Label */}
          <SvgText x={size - 4} y={half + 4} textAnchor="end">우파</SvgText>
        </G>

        {/* Reference Politicians / Parties */}
        {showReferences && (
          <G id="references" opacity={0.65}>
            {REFERENCE_POINTS.map((ref, idx) => {
              const pos = getSvgCoords(ref.x, ref.y);
              return (
                <G key={`ref-${idx}`}>
                  {/* Subtle point */}
                  <Circle
                    cx={pos.x}
                    cy={pos.y}
                    r={4}
                    fill={ref.color}
                    opacity={0.8}
                  />
                  {/* Label background pill for readability */}
                  <Rect
                    x={pos.x - 20}
                    y={pos.y - 12}
                    width={40}
                    height={10}
                    fill="#0F172A"
                    rx={2}
                    opacity={0.7}
                  />
                  {/* Label text */}
                  <SvgText
                    x={pos.x}
                    y={pos.y - 4}
                    fontSize={7.5}
                    fill="#CBD5E1"
                    textAnchor="middle"
                    fontWeight="600"
                  >
                    {ref.name}
                  </SvgText>
                </G>
              );
            })}
          </G>
        )}

        {/* User Current / Final Coordinate Pointer */}
        {userPoint && (
          <G id="user-point">
            {/* Outer halo */}
            <Circle
              cx={userPoint.x}
              cy={userPoint.y}
              r={16}
              fill="url(#userGlow)"
              opacity={0.6}
            />
            {/* Pulsing ring */}
            <Circle
              cx={userPoint.x}
              cy={userPoint.y}
              r={10}
              fill="none"
              stroke="#FF3366"
              strokeWidth={1.5}
            />
            {/* Core dot */}
            <Circle
              cx={userPoint.x}
              cy={userPoint.y}
              r={5}
              fill="#FFFFFF"
              stroke="#FF3366"
              strokeWidth={2}
            />
          </G>
        )}
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#090D1A',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    alignSelf: 'center',
    marginVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  }
});
