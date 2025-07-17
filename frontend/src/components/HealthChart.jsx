import React, { useEffect, useState } from 'react';
import { ResponsiveBar } from '@nivo/bar';
import styled from 'styled-components';

const CenteredMessage = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: ${({ theme }) => theme.fontSizes['xl']};
  color: ${({ theme }) => theme.colors.gray[700]};
`;

const transformHealthDataForBarChart = (rawData) => {
  const transformedData = [];
  rawData.forEach((item) => {
    const date = new Date(item.create_date);
    const formattedDate = `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
    transformedData.push({
      date: formattedDate,
      체중: item.weight,
      골격근량: item.skeletal_muscle,
      체지방량: item.body_fat,
    });
  });
  return transformedData;
};

const CustomTooltip = ({ id, value, color, data }) => {
  return (
    <div
      style={{
        background: 'white',
        padding: '10px 12px',
        border: `2px solid ${color}`,
        color: '#333',
        fontSize: '14px',
        fontWeight: 'bold',
      }}
    >
      <div>날짜: {data.date}</div>
      <div style={{ color }}>
        {id}: {value} kg
      </div>
    </div>
  );
};

const HealthChart = ({ rawData, isLoading }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (rawData && rawData.length > 0) {
      setChartData(transformHealthDataForBarChart(rawData));
    }
  }, [rawData]);

  if (isLoading) return <CenteredMessage>로딩 중입니다...</CenteredMessage>;
  if (!chartData.length) return <CenteredMessage>데이터가 없습니다.</CenteredMessage>;

  const keys = ['체중', '골격근량', '체지방량'];
  const colors = ['#FF5733', '#3366FF', '#33CC33'];

  return (
    <ResponsiveBar
      data={chartData}
      keys={keys}
      indexBy="date"
      margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
      padding={0.3}
      groupMode="grouped"
      valueScale={{ type: 'linear' }}
      indexScale={{ type: 'band', round: true }}
      colors={colors}
      borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      axisTop={null}
      axisRight={null}
      axisBottom={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '날짜',
        legendPosition: 'middle',
        legendOffset: 32,
      }}
      axisLeft={{
        tickSize: 5,
        tickPadding: 5,
        tickRotation: 0,
        legend: '값 (kg)',
        legendPosition: 'middle',
        legendOffset: -40,
      }}
      // ⭐ 막대 위에 숫자 레이블 표시
      labelSkipWidth={12}
      labelSkipHeight={12}
      labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
      legends={[
        {
          dataFrom: 'keys',
          anchor: 'bottom-right',
          direction: 'column',
          justify: false,
          translateX: 120,
          translateY: 0,
          itemsSpacing: 2,
          itemWidth: 100,
          itemHeight: 20,
          itemDirection: 'left-to-right',
          itemOpacity: 0.85,
          symbolSize: 12,
          effects: [
            {
              on: 'hover',
              style: {
                itemOpacity: 1,
              },
            },
          ],
        },
      ]}
      tooltip={CustomTooltip}
      theme={{
        // ⭐ 축 글씨 굵기 설정
        axis: {
          domain: { line: { stroke: '#d4d4d4', strokeWidth: 1 } },
          ticks: {
            line: { stroke: '#d4d4d4', strokeWidth: 1 },
            text: { fontSize: 11, fill: '#333333', fontWeight: 'bold' }, // ⭐ fontWeight: 'bold' 추가
          },
          legend: {
            text: { fontSize: 12, fill: '#333333', fontWeight: 'bold' }, // ⭐ fontWeight: 'bold' 추가
          },
        },
        grid: {
          line: { stroke: '#e0e0e0', strokeWidth: 1 },
        },
        // ⭐ 막대 안 레이블 글씨 굵기 설정 (만약 label을 사용할 경우)
        labels: {
          text: {
            fontWeight: 'bold', // ⭐ fontWeight: 'bold' 추가
          },
        },
        // ⭐ 범례 글씨 굵기 설정
        legends: {
          text: {
            fontSize: 12,
            fill: '#333333',
            fontWeight: 'bold', // ⭐ fontWeight: 'bold' 추가
          },
        },
        tooltip: {
          container: {
            background: 'white',
            color: '#333333',
            fontSize: 12,
            borderRadius: '4px',
            boxShadow: '0px 0px 5px rgba(0, 0, 0, 0.1)',
            fontWeight: 'bold',
          },
        },
      }}
    />
  );
};

export default HealthChart;
