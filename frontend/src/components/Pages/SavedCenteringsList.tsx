import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { CenteringRecord } from "../../types/CenteringRecord";
import {
  fetchSavedCenterings,
  deleteCenteringRecord,
} from "../../api/centering";
import { useNavigate } from "react-router-dom";

export default function SavedCenteringsList() {
  const navigate = useNavigate();
  const [records, setRecords] = useState<CenteringRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  useEffect(() => {
    if (!isLoggedIn) return;

    fetchSavedCenterings()
      .then((data) => {
        setRecords(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching saved centerings:", err);
        setError("Failed to load saved records.");
        setLoading(false);
      });
  }, [isLoggedIn]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this record?")) return;

    try {
      await deleteCenteringRecord(id);
      setRecords((prev) => prev.filter((rec) => rec.id !== id));
    } catch (err) {
      console.error("Failed to delete centering record:", err);
      alert("Failed to delete. See console for details.");
    }
  };

  if (!isLoggedIn) {
    return (
      <p style={{ padding: "1rem" }}>
        Please log in to view your saved centerings.
      </p>
    );
  }

  if (loading)
    return <p style={{ padding: "1rem" }}>Loading saved centerings...</p>;
  if (error) return <p style={{ padding: "1rem", color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h2>Saved Centerings</h2>
      {records.length === 0 ? (
        <p>No saved centerings found.</p>
      ) : (
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "1rem",
          }}
        >
          <thead>
            <tr>
              <th style={thStyle}>Image #</th>
              <th style={thStyle}>Image Name</th>
              <th style={thStyle}>Horizontal</th>
              <th style={thStyle}>Vertical</th>
              <th style={thStyle}>Saved On</th>
              <th style={thStyle}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((rec) => (
              <tr key={rec.id}>
                <td
                  style={{ ...tdStyle, cursor: "pointer" }}
                  onDoubleClick={() => navigate(`/edit/${rec.id}`)}
                >
                  {rec.image_index + 1}
                </td>
                <td style={tdStyle}>{rec.image_name || "Unnamed"}</td>
                <td style={tdStyle}>{rec.horizontal_ratio}</td>
                <td style={tdStyle}>{rec.vertical_ratio}</td>
                <td style={tdStyle}>
                  {new Date(rec.updated_at).toLocaleString()}
                </td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(rec.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = {
  textAlign: "left",
  padding: "8px",
  borderBottom: "1px solid #ccc",
};

const tdStyle: React.CSSProperties = {
  padding: "8px",
  borderBottom: "1px solid #eee",
};
