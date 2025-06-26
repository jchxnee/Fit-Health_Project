import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import styled from 'styled-components';

// 컴포넌트 안이나 파일 상단에 추가
const CenteredMessage = styled.div`
  height: 100%; /* 차트 높이와 동일하게 */
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes['xl']};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

// raw 데이터 → 차트용 데이터 변환
const transformHealthData = (rawData) => {
  console.log(rawData);
  const weightData = [];
  const skeletalMuscleData = [];
  const bodyFatData = [];

  rawData.forEach((item) => {
    const date = new Date(item.create_date); // 소문자 필드명
    const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
      date.getDate()
    ).padStart(2, '0')}`;

    weightData.push({ x: formattedDate, y: item.weight });
    skeletalMuscleData.push({ x: formattedDate, y: item.skeletal_muscle });
    bodyFatData.push({ x: formattedDate, y: item.body_fat });
  });

  return [
    { id: '체중 (kg)', data: weightData },
    { id: '골격근량 (kg)', data: skeletalMuscleData },
    { id: '체지방량 (kg)', data: bodyFatData },
  ];
};

const HealthChart = ({ rawData, isLoading }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (rawData && rawData.length > 0) {
      setChartData(transformHealthData(rawData));
    }
  }, [rawData]);

  if (isLoading) return <CenteredMessage>로딩 중입니다...</CenteredMessage>;
  if (!chartData.length) return <CenteredMessage>데이터가 없습니다.</CenteredMessage>;

  return (
    <ResponsiveLine
      data={chartData}
      margin={{ top: 50, right: 140, bottom: 70, left: 50 }}
      xScale={{ type: 'point' }}
      yScale={{
        type: 'linear',
        min: 'auto',
        max: 'auto',
        stacked: false,
        reverse: false,
      }}
      yFormat=" >-.2f"
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: -45,
        legend: '날짜',
        legendOffset: 50,
        legendPosition: 'middle',
        truncateTickAt: 0,
        format: (value) => {
          const parts = value.split('.');
          return parts.length === 3 ? `${parts[1]}.${parts[2]}` : value;
        },
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '값 (kg)',
        legendOffset: -40,
        legendPosition: 'middle',
      }}
      pointSize={10}
      pointColor={{ theme: 'background' }}
      pointBorderWidth={2}
      pointBorderColor={{ from: 'serieColor' }}
      pointLabelYOffset={-12}
      useMesh={true}
      colors={['#FF5733', '#3366FF', '#33CC33']}
      theme={{
        axis: {
          domain: {
            line: { stroke: '#d4d4d4', strokeWidth: 1 },
          },
          ticks: {
            line: { stroke: '#d4d4d4', strokeWidth: 1 },
            text: { fontSize: 11, fill: '#333333' },
          },
          legend: {
            text: { fontSize: 12, fill: '#333333', fontWeight: 'bold' },
          },
        },
        grid: {
          line: { stroke: '#e0e0e0', strokeWidth: 1 },
        },
        legends: {
          text: { fontSize: 12, fill: '#333333' },
        },
        tooltip: {
          container: {
            background: 'white',
            color: '#333333',
            fontSize: 12,
            borderRadius: '4px',
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
          },
        },
      }}
      legends={[
        {
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 0,
          itemDirection: 'left-to-right',
          itemWidth: 80,
          itemHeight: 20,
          itemOpacity: 0.75,
          symbolSize: 12,
          symbolShape: 'circle',
          symbolBorderColor: 'rgba(0, 0, 0, .5)',
          effects: [
            {
              on: 'hover',
              style: {
                itemBackground: 'rgba(0, 0, 0, .03)',
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
    />
  );
};

export default HealthChart;
