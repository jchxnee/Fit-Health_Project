import React from 'react';
import { ResponsiveContainer, ComposedChart, XAxis, YAxis, Tooltip, Legend, Bar, Line, CartesianGrid } from 'recharts';

const transformData = (rawData) => {
  return rawData.map((item) => {
    const date = new Date(item.create_date);
    const formattedDate = `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(
      date.getDate()
    ).padStart(2, '0')}`;
    return {
      date: formattedDate,
      weight: item.weight,
      skeletalMuscle: item.skeletal_muscle,
      bodyFat: item.body_fat,
    };
  });
};

const MixedChart = ({ rawData }) => {
  const data = transformData(rawData);

  const keys = ['체중', '골격근량', '체지방량'];
  const colors = ['#FF5733', '#3366FF', '#33CC33'];

  return (
    <ResponsiveContainer width="100%" height={400}>
      <ComposedChart data={data}>
        <CartesianGrid stroke="#f5f5f5" />
        <XAxis dataKey="date" />
        <YAxis yAxisId="left" orientation="left" />
        <YAxis yAxisId="right" orientation="right" hide />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="weight" barSize={20} fill="#8884d8" name="몸무게 (kg)" />
        <Line yAxisId="right" type="monotone" dataKey="skeletalMuscle" stroke="#82ca9d" name="골격근량 (kg)" />
        <Line yAxisId="right" type="monotone" dataKey="bodyFat" stroke="#ff7300" name="체지방량 (kg)" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

export default MixedChart;
