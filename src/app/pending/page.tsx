"use client";
import React, { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header";
import { circleToCdnMap } from "../../components/constants/cdnMap";

type Order = {
  ORDER_ID: string;
  ORDER_DATE: string;
  CUSTOMER_NAME: string;
  CIRCLE_CODE: string;
  BA_CODE: string;
  RMN?: string;
  PHONE_NO?: string;
  CDN_LABEL?: string;
  [key: string]: string | number | boolean | undefined;
};

export default function FilteredOrdersByExistingMobiles() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [existingMobiles, setExistingMobiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);

  const selectedBA = "";
  const selectedOD = "";

  useEffect(() => {
    const stored = localStorage.getItem("existingMobiles");
    const savedIds = localStorage.getItem("selectedOrderIds");
    const cachedOrders = localStorage.getItem("filteredOrders");

    if (stored) setExistingMobiles(JSON.parse(stored));
    if (savedIds) setSelectedOrderIds(JSON.parse(savedIds));
    if (cachedOrders) setOrders(JSON.parse(cachedOrders));

    (async () => {
      await fetchFilteredOrders();
    })();
  }, []);

  useEffect(() => {
    if (existingMobiles.length > 0) fetchFilteredOrders();
  }, [existingMobiles]);

  async function fetchFilteredOrders() {
    setLoading(true);
    try {
      const response = await fetch("/api/fetchIptvOrders", { method: "POST" });
      if (!response.ok) throw new Error("Failed to fetch orders");

      const data = await response.json();
      const allOrders: Order[] = data.orders || [];

      const filtered = allOrders.filter((order) =>
        existingMobiles.includes(order.RMN || order.PHONE_NO || "")
      );

      const filteredWithCDN = filtered.map((order) => ({
        ...order,
        CDN_LABEL: circleToCdnMap[order.CIRCLE_CODE] || "CD1",
      }));

      const cached = localStorage.getItem("filteredOrders");
      const previousOrders: Order[] = cached ? JSON.parse(cached) : [];

      const combined = [...previousOrders, ...filteredWithCDN];
      const uniqueOrders = Array.from(
        new Map(combined.map((order) => [order.ORDER_ID, order])).values()
      );

      localStorage.setItem("filteredOrders", JSON.stringify(uniqueOrders));
    } catch (error) {
      console.error("Fetch error:", error);
      const cached = localStorage.getItem("filteredOrders");
      if (cached) {
        setOrders(JSON.parse(cached));
      } else {
        setOrders([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDateOnly = order.ORDER_DATE.split(" ")[0];
      const matchBA = selectedBA ? order.BA_CODE === selectedBA : true;
      const matchOD = selectedOD ? orderDateOnly === selectedOD : true;
      return matchBA && matchOD;
    });
  }, [orders, selectedBA, selectedOD]);

  const handleCheckboxChange = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  const handleSelectAll = () => {
    const allIds = filteredOrders.map((o) => o.ORDER_ID);
    setSelectedOrderIds((prev) =>
      prev.length === allIds.length ? [] : allIds
    );
  };

  const isAllSelected =
    filteredOrders.length > 0 &&
    selectedOrderIds.length === filteredOrders.length;

  const handleViewClick = (order: Order) => {
    console.log("Viewing order", order);
    // You can replace this with modal or navigation
  };

  if (existingMobiles.length === 0) {
    return <p className="mt-[7rem] ml-12">No existing mobile numbers found.</p>;
  }

  return (
    <div className="p-16 mt-[4rem] mb-8">
      <Header />

      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold">
          Orders Matching Existing Mobile Numbers
        </h2>

        <button
          type="button"
          disabled={loading}
          className="bg-red-500 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
        >
          Generate Upload File
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => {
            console.log("Renewing orders", selectedOrderIds);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Renew
        </button>
      </div>

      {loading ? (
        <p className="ml-12">Loading filtered orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="ml-12">No orders match the given filters.</p>
      ) : (
        <div>
          <table className="min-w-[1700px] border border-gray-300 text-[15px]">
            <thead className="bg-gray-100 text-left font-bold">
              <tr>
                <th className="px-4 py-2 border">
                  <input
                    type="checkbox"
                    checked={isAllSelected}
                    onChange={handleSelectAll}
                  />
                </th>
                <th className="px-4 py-2 border">Order ID</th>
                <th className="px-4 py-2 border">Order Date</th>
                <th className="px-4 py-2 border">Customer</th>
                <th className="px-4 py-2 border">Circle Code</th>
                <th className="px-4 py-2 border">BA Code</th>
                <th className="px-4 py-2 border">RMN</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">
                    <input
                      type="checkbox"
                      checked={selectedOrderIds.includes(order.ORDER_ID)}
                      onChange={() => handleCheckboxChange(order.ORDER_ID)}
                    />
                  </td>
                  <td className="px-4 py-2 border">{order.ORDER_ID}</td>
                  <td className="px-4 py-2 border">{order.ORDER_DATE}</td>
                  <td className="px-4 py-2 border">{order.CUSTOMER_NAME}</td>
                  <td className="px-4 py-2 border">{order.CIRCLE_CODE}</td>
                  <td className="px-4 py-2 border">{order.BA_CODE}</td>
                  <td className="px-4 py-2 border">
                    {order.RMN || order.PHONE_NO}
                  </td>
                  <td className="px-4 py-2 border font-bold">
                    <button
                      onClick={() => handleViewClick(order)}
                      className="text-blue-500"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
