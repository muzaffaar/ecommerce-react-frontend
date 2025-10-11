import React, { useState } from "react";

export default function PayButton() {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handlePay = async () => {
    setResponse(null);
    setError(null);

    try {
      const res = await fetch("http://meetify.uz/api/en/v1/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer 4|VqspwxVUzQwAOevEuvkTszDev3xRkv6wDnR6zGwg0669648a",
          "X-Guest-Token": "6a8bf1f2-7227-4aab-b56b-ec38c3f1be9a"
        },
        body: JSON.stringify({
          amount: 2000,
          currency: "usd",
          recipient_name: "Muzaffar Karimov",
          phone: "+36301234567",
          address_line: "Kassai út 26",
          city: "Debrecen",
          postal_code: "4028",
          country: "Hungary",
          save_address: 1
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      console.error("Error:", err);
      setError(err.message);
    }
  };

  return (
    <div>
      <button onClick={handlePay}>Pay</button>

      {response && (
        <pre style={{ marginTop: "20px", background: "#e0ffe0", padding: "10px" }}>
          {JSON.stringify(response, null, 2)}
        </pre>
      )}

      {error && (
        <pre style={{ marginTop: "20px", background: "#ffe0e0", padding: "10px", color: "red" }}>
          Error: {error}
        </pre>
      )}
    </div>
  );
}
