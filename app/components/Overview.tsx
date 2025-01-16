import { ReactNode, useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function Overview({
  children,
  onClose,
}: {
  children: ReactNode;
  onClose: () => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [timerData, setTimerData] = useState<any[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsLoggedIn(false);
      setErrorMessage("Please log in to see your data.");
      return;
    }

    axios
      .get("http://127.0.0.1:5000/api/check-auth", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        if (response.data.logged_in) {
          setIsLoggedIn(true);

          // Fetch timer data
          return axios.get("http://127.0.0.1:5000/api/get-timer-data", {
            headers: { Authorization: `Bearer ${token}` },
          });
        } else {
          setIsLoggedIn(false);
          setErrorMessage("Please log in to see your data.");
        }
      })
      .then((response) => {
        if (response && response.data) {
          setTimerData(response.data.timer_data);
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setErrorMessage("Please log in to see your data.");
      });
  }, []);

  const processGraphData = () => {
    if (!timerData || timerData.length === 0) return null;

    const days: Record<string, Record<string, number>> = {};
    const colors = [
      "rgba(75, 192, 192, 0.5)",
      "rgba(255, 99, 132, 0.5)",
      "rgba(54, 162, 235, 0.5)",
      "rgba(255, 206, 86, 0.5)",
      "rgba(153, 102, 255, 0.5)",
      "rgba(255, 159, 64, 0.5)",
    ];

    const borderColors = [
      "rgba(75, 192, 192, 1)",
      "rgba(255, 99, 132, 1)",
      "rgba(54, 162, 235, 1)",
      "rgba(255, 206, 86, 1)",
      "rgba(153, 102, 255, 1)",
      "rgba(255, 159, 64, 1)",
    ];

    timerData.forEach((entry) => {
      const date = new Date(entry.timestamp).toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "short",
      });
      const project = entry.project_name;

      if (!days[date]) {
        days[date] = {};
      }

      days[date][project] =
        (days[date][project] || 0) + entry.elapsed_time / 3600; // Convert seconds to hours
    });

    const today = new Date();
    const labels: string[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i); // Project the last 6 days and today
      labels.push(
        date.toLocaleDateString("en-US", {
          weekday: "short",
          day: "numeric",
          month: "short",
        })
      );
    }

    const datasets: {
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }[] = [];

    const projectNames = Array.from(
      new Set(timerData.map((entry) => entry.project_name))
    );

    projectNames.forEach((project, index) => {
      const data = labels.map(
        (label) => (days[label] && days[label][project]) || 0
      );
      datasets.push({
        label: project,
        data,
        backgroundColor: colors[index % colors.length],
        borderColor: borderColors[index % borderColors.length],
        borderWidth: 1,
      });
    });

    return {
      labels,
      datasets,
    };
  };

  const graphData = processGraphData();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[800px] max-w-[90%] h-[90%] overflow-auto relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded"
        >
          Close
        </button>

        <div className="p-4 h-[80%]">
          <h2 className="text-2xl font-bold mb-4 text-black">Overview</h2>

          {!isLoggedIn ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : graphData ? (
            <div className="h-full">
              <Bar
                data={graphData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    tooltip: {
                      mode: "index",
                      intersect: false,
                    },
                    legend: {
                      position: "top",
                    },
                  },
                  scales: {
                    x: {
                      stacked: true,
                    },
                    y: {
                      stacked: true,
                    },
                  },
                }}
              />
            </div>
          ) : (
            <p>Loading your data...</p>
          )}

          {children}
        </div>
      </div>
    </div>
  );
}
