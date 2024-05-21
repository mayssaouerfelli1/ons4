import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Title, Tooltip, Legend);

const UserStatsChart = ({ userStats, courseStats }) => {
  if (!userStats || !userStats.apprenants || !userStats.instructeurs || !courseStats) {
    return <div>Loading...</div>;
  }

  const totalUsers = userStats.apprenants.actifs + userStats.apprenants.inactifs + userStats.instructeurs.actifs + userStats.instructeurs.inactifs;
  const apprenants = userStats.apprenants.actifs + userStats.apprenants.inactifs;
  const instructeurs = userStats.instructeurs.actifs + userStats.instructeurs.inactifs;

  const data = {
    labels: ['Total Utilisateurs', 'Apprenants', 'Instructeurs', 'Apprenants Actifs', 'Instructeurs Actifs', 'Total Cours'],
    datasets: [
      {
        label: 'Total Utilisateurs',
        data: [totalUsers, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Apprenants',
        data: [0, apprenants, 0, 0, 0, 0],
        backgroundColor: 'rgba(255, 205, 86, 0.2)',
        borderColor: 'rgba(255, 205, 86, 1)',
        borderWidth: 1,
      },
      {
        label: 'Instructeurs',
        data: [0, 0, instructeurs, 0, 0, 0],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Apprenants Actifs',
        data: [0, 0, 0, userStats.apprenants.actifs, 0, 0],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
      {
        label: 'Instructeurs Actifs',
        data: [0, 0, 0, 0, userStats.instructeurs.actifs, 0],
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 1,
      },
      {
        label: 'Total Cours',
        data: [0, 0, 0, 0, 0, courseStats.totalCourses],
        backgroundColor: 'rgba(255, 159, 64, 0.2)',
        borderColor: 'rgba(255, 159, 64, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
      },
      title: {
        display: true,
        text: 'Statistiques des Utilisateurs et des Cours',
      },
    },
    scales: {
      x: {
        maxBarThickness: 50, // Modifier la largeur des barres ici
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default UserStatsChart;
