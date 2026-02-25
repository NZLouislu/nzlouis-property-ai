"use client";

import { useEffect } from "react";
import { useDatabaseAnalysisStore } from "@/src/stores/useDatabaseAnalysisStore";

export default function DatabaseAnalysisPage() {
  const { data, loading, error, fetchData, clearCache, lastFetch } = useDatabaseAnalysisStore();

  const handleRefresh = () => {
    clearCache();
    fetchData();
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
          </div>
        </div>

        <section style={{ marginBottom: "30px" }}>
          <h2>Property Statistics</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            {/* Wellington first */}
            <div style={{
              border: "1px solid var(--card-border)",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "var(--card-bg)"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Wellington Total Properties</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.wellington_properties || data.wellingtonProperties}
              </p>
            </div>

            <div style={{
              border: "1px solid var(--card-border)",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "var(--card-bg)"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Wellington Forecast Total</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.wellington_forecast_total || data.wellingtonForecast}
              </p>
            </div>

            {/* Auckland second */}
            <div style={{
              border: "1px solid var(--card-border)",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "var(--card-bg)"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Auckland Total Properties</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.auckland_properties || data.aucklandProperties}
              </p>
            </div>

            <div style={{
              border: "1px solid var(--card-border)",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "var(--card-bg)"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Auckland Forecast Total</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.auckland_forecast_total || data.aucklandForecast}
              </p>
            </div>
          </div>
        </section>

        {/* Add forecast data with different confidence levels */}
        <section style={{ marginBottom: "30px" }}>
          <h2>Forecast Data by Confidence Level</h2>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px"
          }}>
            {/* Wellington first */}
            <div style={{
              border: "1px solid var(--card-border)",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "var(--card-bg)"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Wellington 90% Confidence</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.wellington_forecast_90_percent}
              </p>
            </div>

            <div style={{
              border: "1px solid var(--card-border)",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "var(--card-bg)"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Wellington 80% Confidence</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.wellington_forecast_80_percent}
              </p>
            </div>

            <div style={{
              border: "1px solid var(--card-border)",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "var(--card-bg)"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Wellington 60% Confidence</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.wellington_forecast_60_percent}
              </p>
            </div>

            {/* Auckland second */}
            <div style={{
              border: "1px solid var(--card-border)",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "var(--card-bg)"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Auckland 90% Confidence</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.auckland_forecast_90_percent}
              </p>
            </div>

            <div style={{
              border: "1px solid var(--card-border)",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "var(--card-bg)"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Auckland 80% Confidence</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.auckland_forecast_80_percent}
              </p>
            </div>

            <div style={{
              border: "1px solid var(--card-border)",
              borderRadius: "5px",
              padding: "15px",
              backgroundColor: "var(--card-bg)"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Auckland 60% Confidence</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.auckland_forecast_60_percent}
              </p>
            </div>
          </div>
        </section>

        <section>
          <h2>Analysis Summary</h2>
          <div style={{
            border: "1px solid var(--card-border)",
            borderRadius: "5px",
            padding: "20px",
            backgroundColor: "var(--card-bg)",
            color: "var(--foreground)"
          }}>
            <p>
              Wellington has <strong>{data.wellington_properties || data.wellingtonProperties} total properties</strong> and <strong>{data.wellington_forecast_total || data.wellingtonForecast} forecast records</strong>.
            </p>
            <p>
              Auckland has <strong>{data.auckland_properties || data.aucklandProperties} total properties</strong> and <strong>{data.auckland_forecast_total || data.aucklandForecast} forecast records</strong>.
            </p>
            <p>
              Wellington 90% confidence forecast: <strong>{data.wellington_forecast_90_percent} properties</strong>.
            </p>
            <p>
              Auckland 90% confidence forecast: <strong>{data.auckland_forecast_90_percent} properties</strong>.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}