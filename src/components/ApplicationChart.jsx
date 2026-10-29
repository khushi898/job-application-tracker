import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#8054d9",
  "#5b8def",
  "#f5a623",
  "#22b573",
  "#ef6464",
];

function ApplicationChart({ applications = [] }) {
  const statuses = [
    "Saved",
    "Applied",
    "Interview",
    "Offer",
    "Rejected",
  ];

  const chartData = statuses.map((status) => ({
    name: status,
    value: applications.filter(
      (app) =>
        app.status?.toLowerCase() === status.toLowerCase()
    ).length,
  }));

  const hasData = chartData.some((item) => item.value > 0);

  const totalJobs=chartData.reduce(
    (total,item)=>total + item.value,
    0
  );

  return (
    <div className="application-chart-card">
      <h2>Application Status Overview</h2>
      <p>Track your job applications at every stage.</p>

      {hasData ? (
        <div style={{ width: "100%", height: 320 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={3}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index]}
                  />
                ))}
              </Pie>

              <text
  x="50%"
  y="46%"
  textAnchor="middle"
  dominantBaseline="middle"
  fill="#30234f"
  fontSize={32}
  fontWeight={800}
>
  {totalJobs}
</text>

<text
  x="50%"
  y="55%"
  textAnchor="middle"
  dominantBaseline="middle"
  fill="#76698e"
  fontSize={13}
  fontWeight={600}
>
  Total Jobs
</text>

              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <p>No application data available yet.</p>
      )}
    </div>
  );
}

export default ApplicationChart;