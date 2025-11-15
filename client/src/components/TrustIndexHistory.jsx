import React, { useEffect, useState } from "react";
import { dashboard } from "../api/api";
import Loader from "./Loader";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

export default function TrustIndexHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const res = await dashboard.tiHistory();
      setHistory(res.data?.data?.tiHistory || res.data?.tiHistory || []);
    } catch (err) {
      console.error("Failed to load TI history", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  // Get last 6 updates for the graph
  const last6Updates = history.slice(-6).map((entry, idx) => ({
    ...entry,
    updateNumber: idx + 1,
    displayValue: entry.value,
  }));

  const getTIColor = ti => {
    if (ti >= 800) return "text-emerald-400";
    if (ti >= 600) return "text-green-400";
    if (ti >= 500) return "text-yellow-400";
    if (ti >= 400) return "text-orange-400";
    return "text-red-400";
  };

  const getStrokeColor = ti => {
    if (ti >= 800) return "#34d399";
    if (ti >= 600) return "#4ade80";
    if (ti >= 500) return "#facc15";
    if (ti >= 400) return "#fb923c";
    return "#f87171";
  };

  // Custom tooltip component
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-900 border border-white/20 rounded-lg p-3 shadow-lg">
          <p className="text-gray-300 text-sm mb-1">
            Update {data.updateNumber}
          </p>
          <p className={`font-bold text-lg ${getTIColor(data.value)}`}>
            TI: {data.value}
          </p>
          <p className="text-gray-400 text-xs mt-1">
            {new Date(data.date).toLocaleDateString()}
          </p>
        </div>
      );
    }
    return null;
  };

  // Get dynamic stroke color based on current value
  const getLineColor = () => {
    if (last6Updates.length === 0) return "#4ade80";
    const lastValue = last6Updates[last6Updates.length - 1].value;
    return getStrokeColor(lastValue);
  };

  return (
    <div className="space-y-6">
      {/* Graph Section */}
      {last6Updates.length > 0 && (
        <div className="bg-white/5 border border-white/10 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-6">
            TrustIndex Trend (Last 6 Updates)
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={last6Updates}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.1)"
              />
              <XAxis
                dataKey="updateNumber"
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
                tickFormatter={value => `Update ${value}`}
              />
              <YAxis
                domain={[0, 950]}
                ticks={[0, 200, 400, 600, 800, 950]}
                stroke="#9ca3af"
                tick={{ fill: "#9ca3af", fontSize: 12 }}
              />
              <Tooltip content={<CustomTooltip />} />

              {/* Reference lines for TI thresholds */}
              <ReferenceLine
                y={800}
                stroke="#34d399"
                strokeDasharray="3 3"
                opacity={0.3}
              />
              <ReferenceLine
                y={600}
                stroke="#4ade80"
                strokeDasharray="3 3"
                opacity={0.3}
              />
              <ReferenceLine
                y={500}
                stroke="#facc15"
                strokeDasharray="3 3"
                opacity={0.3}
              />
              <ReferenceLine
                y={400}
                stroke="#fb923c"
                strokeDasharray="3 3"
                opacity={0.3}
              />

              <Line
                type="monotone"
                dataKey="value"
                stroke={getLineColor()}
                strokeWidth={3}
                dot={{
                  r: 5,
                  fill: "#fff",
                  stroke: getLineColor(),
                  strokeWidth: 2,
                }}
                activeDot={{
                  r: 7,
                  fill: getLineColor(),
                  stroke: "#fff",
                  strokeWidth: 2,
                }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap gap-4 text-xs">
            {last6Updates.map((entry, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: getStrokeColor(entry.value) }}
                ></div>
                <span className="text-gray-400">Update {idx + 1}:</span>
                <span className={`font-bold ${getTIColor(entry.value)}`}>
                  {entry.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* History List */}
      {history.length === 0 ? (
        <div className="text-gray-400 text-center py-6">No history yet</div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white mb-3">
            Recent Changes
          </h3>
          {history
            .slice()
            .reverse()
            .slice(0, 10)
            .map((entry, idx, arr) => {
              const prevEntry = arr[idx + 1];
              const change = prevEntry ? entry.value - prevEntry.value : 0;

              return (
                <div
                  key={entry._id || idx}
                  className="flex justify-between items-center p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <div className="flex-1">
                    <div className="text-sm font-medium text-white">
                      TrustIndex Update
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {new Date(entry.date).toLocaleString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {idx < arr.length - 1 && (
                      <div
                        className={`font-bold text-lg ${
                          change >= 0 ? "text-green-400" : "text-red-400"
                        }`}
                      >
                        {change >= 0 ? "+" : ""}
                        {change}
                      </div>
                    )}
                    <div className="text-sm text-gray-300">
                      <span
                        className={`font-semibold ${getTIColor(entry.value)}`}
                      >
                        {entry.value}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
