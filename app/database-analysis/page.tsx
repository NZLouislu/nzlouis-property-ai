"use client";

import { useState, useEffect } from "react";
import NavBar from "@/src/components/NavBar";

export default function DatabaseAnalysisPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/database-analysis");
        
        if (!response.ok) {
          throw new Error("Failed to fetch database analysis data");
        }
        
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <NavBar />
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
        <NavBar />
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
        <NavBar />
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Database Analysis</h1>
          <p>No data available</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px" }}>Database Analysis</h1>
        
        {/* 属性统计信息 */}
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
              <h3 style={{ margin: "0 0 10px 0" }}>Total Properties</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.propertyCount}
              </p>
            </div>
            
            <div style={{ 
              border: "1px solid #cbd5e1", 
              borderRadius: "5px", 
              padding: "15px",
              backgroundColor: "#f8fafc"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Avg History Size</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.historySize > 0 ? Math.round(data.historySize / data.sampleData) : 0} chars
              </p>
            </div>
            
            <div style={{ 
              border: "1px solid #cbd5e1", 
              borderRadius: "5px", 
              padding: "15px",
              backgroundColor: "#f8fafc"
            }}>
              <h3 style={{ margin: "0 0 10px 0" }}>Properties with Images</h3>
              <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
                {data.imageUrlCount}
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
              Based on our analysis, your database contains <strong>{data.propertyCount} properties</strong>.
              Among the sampled properties, we found that <strong>{data.imageUrlCount} properties</strong> have image URLs
              and the average history size is <strong>
                {data.historySize > 0 ? Math.round(data.historySize / data.sampleData) : 0} characters
              </strong>.
            </p>
            <p>
              To reduce database size, consider:
            </p>
            <ul style={{ paddingLeft: "20px" }}>
              <li>Moving property history data to a separate table</li>
              <li>Storing images in Supabase Storage instead of keeping URLs in the database</li>
              <li>Archiving old property data that is not frequently accessed</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
}
