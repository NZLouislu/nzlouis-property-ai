"use client";

import { useEffect } from "react";
import { useDatabaseAnalysisStore } from "@/src/stores/useDatabaseAnalysisStore";

export default function DatabaseAnalysisPage() {
  const { data, loading, error, fetchData, clearCache, lastFetch } = useDatabaseAnalysisStore();

  const handleRefresh = () => {
    clearCache();
    fetchData();
  };

  const getCacheStatus = () => {
    if (!lastFetch) return "No cached data";
    const lastFetchTime = new Date(lastFetch);
    const now = new Date();
    const hoursSince = Math.floor((now.getTime() - lastFetchTime.getTime()) / (1000 * 60 * 60));
    return `Last updated: ${hoursSince} hours ago`;
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Database Analysis</h1>
          <p>Loading database analysis data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Database Analysis</h1>
          <p style={{ color: "red" }}>Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div>
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Database Analysis</h1>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <div>
            <h1>Database Analysis</h1>
            <p style={{ fontSize: "14px", color: "#666", margin: "5px 0 0 0" }}>
              {getCacheStatus()}
            </p>
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            style={{
              padding: "8px 16px",
              backgroundColor: loading ? "#ccc" : "#007bff",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: loading ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Refreshing..." : "Refresh Data"}
          </button>
        </div>
        
        <section style={{ marginBottom: "30px" }}>
          <h2>Property Statistics</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            <div style={{
              border: "1px solid #cbd5e1",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "#f8fafc"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Auckland Total Properties</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.aucklandProperties}
              </p>
            </div>

            <div style={{
              border: "1px solid #cbd5e1",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "#f8fafc"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Wellington Total Properties</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.wellingtonProperties}
              </p>
            </div>

            <div style={{
              border: "1px solid #cbd5e1",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "#f8fafc"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Auckland Forecast Total</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.aucklandForecast}
              </p>
            </div>

            <div style={{
              border: "1px solid #cbd5e1",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "#f8fafc"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Wellington Forecast Total</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.wellingtonForecast}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Analysis Summary</h2>
          <div style={{
            border: "1px solid #cbd5e1",
            borderRadius: "5px",
            padding: "20px",
            backgroundColor: "#f1f5f9"
          }}>
            <p>
              Auckland has <strong>{data.aucklandProperties} total properties</strong> and <strong>{data.aucklandForecast} forecast records</strong>.
            </p>
            <p>
              Wellington has <strong>{data.wellingtonProperties} total properties</strong> and <strong>{data.wellingtonForecast} forecast records</strong>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
