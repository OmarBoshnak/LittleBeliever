import React from 'react';
import Svg, { Circle, Text as SvgText } from 'react-native-svg';

const toArabicDigits = (n: number) =>
  `${n}`.replace(/\d/g, d => '٠١٢٣٤٥٦٧٨٩'[+d]);

export function AyahMedallion({
  number,
  color = '#c9a961',
  bg = '#F6F3EC',
  active = false,
}: {
  number: number;
  color?: string;
  bg?: string;
  active?: boolean;
}) {
  return (
    <Svg width={30} height={30} viewBox="0 0 32 32">
      <Circle
        cx="16"
        cy="16"
        r="14"
        stroke={color}
        strokeWidth={0.8}
        fill="none"
        opacity={0.35}
      />
      <Circle
        cx="16"
        cy="16"
        r="12"
        stroke={color}
        strokeWidth={1.6}
        fill={active ? `${color}13` : bg}
      />
      <Circle
        cx="16"
        cy="16"
        r="10"
        stroke={color}
        strokeWidth={0.6}
        fill="none"
        opacity={0.4}
      />
      <SvgText
        x="16"
        y="16"
        textAnchor="middle"
        alignmentBaseline="middle"
        fontSize="11"
        fill="#8B7355"
        fontWeight="600"
        fontFamily="KFGQPC Uthmanic Script HAFS"
      >
        {toArabicDigits(number)}
      </SvgText>
    </Svg>
  );
}
