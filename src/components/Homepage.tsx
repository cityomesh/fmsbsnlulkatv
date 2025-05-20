"use client";

import { useEffect, useState } from "react";
import { circleToCdnMap } from "./constants/cdnMap";
import Select, { SingleValue } from 'react-select';

type Order = {
  ORDER_ID: string;
  ORDER_DATE: string;
  CUSTOMER_NAME: string;
  CIRCLE_CODE: string;
  BA_CODE: string;
  RMN?: string;
  PHONE_NO?: string;
  EMAIL?: string;
  ADDRESS?: string;
  CUST_ACCNT_NO?: string;
  MTCE_FRANCHISE_CODE?: string;
  CACHE_UNIQUE_ID?: string;
  BILL_ACCNT_NO?: string;
  CUST_TYPE?: string;
  CACHE_VLAN_ID?: string;
  MAC_ID?: string;
  LMO_USER?: string;
  VENDOR_CODE?: string;
  USERNAME?: string;
  EXCHANGE_CODE?: string;
  IPTV_STATUS?: string;

  fname?: string;
  lname?: string;
  mname?: string;
  gender?: string;
  mobile_no?: string;
  phone_no?: string;
  sublocation_code?: string;
  flatno?: string;
  floor?: string;
  wing?: string;
  installation_address?: string;
  installation_pincode?: string;
  billing_address?: string;
  billing_pincode?: string;
  iptvuser_id?: string;
  bouque_code?: string;
  outstanding?: string;
  scheme_code?: string;
  rperiod_code?: string;
  dob?: string;
  customer_type?: string;
  formno?: string;
  uid?: string;
  minid?: string;
  warranty_date?: string;
  is_verified?: string;
  gst_no?: string;
  iptvuser_password?: string;
  cdn_code?: string;
  warranty_end_date?: string;
};

type OptionType = {
  value: string;
  label: string;
};

const IPTVOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedBA, setSelectedBA] = useState("");
  const [selectedOD, setSelectedOD] = useState("");
  const [bas, setBas] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [popupData, setPopupData] = useState<Order | null>(null); // For storing clicked order data
  const [isPopupVisible, setIsPopupVisible] = useState(false); // For showing and hiding the modal
  const [totalSelectedCount, setTotalSelectedCount] = useState(0);
  const [showExisting, setShowExisting] = useState(false);
  const [showRegistered, setShowRegistered] = useState(false);

  const [orderDates, setOrderDates] = useState<string[]>([]);
  const [existingMobiles, setExistingMobiles] = useState<string[]>([]);
  const [successMobiles, setSuccessMobiles] = useState<string[]>([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const filteredOrders = orders.filter(order => {
    const orderDateOnly = order.ORDER_DATE.split(' ')[0];
    const matchBA = selectedBA ? order.BA_CODE === selectedBA : true;
    const matchOD = selectedOD ? orderDateOnly === selectedOD : true;
    return matchBA && matchOD;
  });
  
  const currentExistingMobiles: string[] = [];

  const isAllSelected = selectedOrderIds.length === filteredOrders.length;

  {existingMobiles.map((mobile: string, index: number) => (
    <li key={index}>{mobile}</li>
  ))}
  
  
  const orderDateOptions: OptionType[] = orderDates.map(date => {
    const onlyDate = date.split(' ')[0];
    return {
      value: onlyDate,
      label: onlyDate,
    };
  });
  
  
  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    const uniqueOrderDates = Array.from(new Set(orders.map(o => o.ORDER_DATE)));
    setOrderDates(uniqueOrderDates);
  }, [orders]);

  useEffect(() => {
    const storedMobiles = localStorage.getItem("existingMobiles");
    if (storedMobiles) {
      setExistingMobiles(JSON.parse(storedMobiles));
    }
  }, []);
  
  
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/fetchIptvOrders", {
        method: "POST",
      });
  
      if (!response.ok) throw new Error("API fetch failed");
  
      const data = await response.json();
      
      let fetchedOrders: Order[] = data?.orders || [];
  
      fetchedOrders = fetchedOrders.map(order => ({
        ...order,
        CDN_LABEL: circleToCdnMap[order.CIRCLE_CODE] || "CD1",
      }));
  
      localStorage.setItem("iptvOrders", JSON.stringify(fetchedOrders));
      setOrders(fetchedOrders);
  
      const uniqueBAs = Array.from(new Set(fetchedOrders.map(o => o.BA_CODE)));
      setBas(uniqueBAs);
    } catch (err) {
      console.error("API failed, loading from localStorage:", err);
  
      const cachedData = localStorage.getItem("iptvOrders");
      if (cachedData) {
        const cachedOrders: Order[] = JSON.parse(cachedData);
        setOrders(cachedOrders);
        const uniqueBAs = Array.from(new Set(cachedOrders.map(o => o.BA_CODE)));
        setBas(uniqueBAs);
      } else {
        setError("No cached data found.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleViewClick = (order: Order) => {
    setPopupData(order);
    setIsPopupVisible(true);
  };

  const closePopup = () => {
    setIsPopupVisible(false);
    setPopupData(null);
  };
  
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedBA(e.target.value);
  };

  const resetBA = () => {
    setSelectedBA("");
  };
  
  const downloadCSV = () => {
    const headers = [
      "fname", "lname", "mname", "gender", "mobile_no", "phone_no", "email",
      "sublocation_code", "flatno", "floor", "wing", "installation_address",
      "installation_pincode", "billing_address", "billing_pincode",
      "iptvuser_id", "bouque_code", "outstanding", "scheme_code",
      "rperiod_code", "dob", "customer_type", "formno", "uid", "minid",
      "warranty_date", "is_verified", "gst_no", "iptvuser_password",
      "cdn_code", "warranty_end_date"
    ];
  
    const selectedOrders = filteredOrders.filter(order =>
      selectedOrderIds.includes(order.ORDER_ID)
    );
  
    const rows = selectedOrders.map(order => {
      const addressParts = (order.ADDRESS || "").split(",");
      const pincode = addressParts[addressParts.length - 1]?.trim() || "";
      const fullName = (order.CUSTOMER_NAME || "").trim().split(" ");
      const fname = fullName.slice(0, 2).join(" ");
      const lname = fullName.slice(2).join(" ");
  
      return [
        fname, // fname
        lname, // lname
        "", // mname
        "1", // gender
        order.RMN || "", // mobile_no
        order.PHONE_NO || "", // phone_no
        order.EMAIL || "", // email
        order.BA_CODE || "", // BA_CODE
        "1", // flatno
        "1", // floor
        "", // wing
        order.ADDRESS || "", // installation_address
        pincode, // installation_pincode
        order.ADDRESS || "", // billing_address
        pincode, // billing_pincode
        order.RMN, // iptvuser_id
        "1", // bouque_code
        "", // outstanding
        "X000002", // scheme_code
        "3", // rperiod_code
        "", // dob
        "1", // customer_type
        "0", // formno
        "", // uid
        "", // minid
        "", // warranty_date
        "", // is_verified
        "", // gst_no
        "Bsnl@123", // iptvuser_password
        "1", // cdn_code
        "", // warranty_end_date
      ];
    });
  
    const csvContent = [headers, ...rows]
      .map(row => row.map(item => `"${item}"`).join(","))
      .join("\n");
  
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "selected_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  

  const handleCheckboxChange = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };
  
  const handleSelectAll = () => {
    const allIds = filteredOrders.map(o => o.ORDER_ID);
    setSelectedOrderIds(prev =>
      prev.length === allIds.length ? [] : allIds
    );
  };
  
  const token = `Bearer ${localStorage.getItem("access_token")}`; // ✅ Use stored token

  const handleCreate = async () => {
    if (selectedOrderIds.length === 0) {
      alert("Please select at least one order.");
      return;
    }
  
    const selectedOrders = orders.filter((order) =>
      selectedOrderIds.includes(order.ORDER_ID)
    );
  
    const processedPhones = new Set<string>();
    const successMobiles: string[] = [];
    const existingMobiles: string[] = [];
  
    for (const order of selectedOrders) {
      const mobile = order.RMN || order.PHONE_NO || "9999999999";
      if (processedPhones.has(mobile)) continue;
  
      const cleanCircle = order.CIRCLE_CODE?.trim().toUpperCase();
      const cdn_id = circleToCdnMap[cleanCircle] || 1;
  
      const subscriberPayload = {
        billing_address: { addr: order.ADDRESS || "N/A", pincode: "123456" },
        fname: order.CUSTOMER_NAME || "N/A",
        mname: "",
        lname: "NA",
        mobile_no: mobile,
        phone_no: mobile,
        email: order.EMAIL?.trim() || "user@example.com",
        installation_address: order.ADDRESS || "N/A",
        pincode: "123456",
        formno: "",
        gender: 0,
        dob: null,
        customer_type: 1,
        sublocation_id: 5,
        cdn_id: cdn_id,
        flatno: "109",
        floor: "5",
      };
  
      try {
        const subscriberRes = await fetch(
          "http://202.62.66.122/api/railtel.php/v1/subscriber?vr=railtel1.1",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify(subscriberPayload),
          }
        );
        const subscriberData = await subscriberRes.json();
        const subscriberId = subscriberData?.data?.id;
  
        if (!subscriberRes.ok || !subscriberId) {
          console.error("❌ Subscriber creation failed:", subscriberData);
          continue;
        }
  
        const accountPayload = {
          subscriber_id: subscriberId,
          iptvuser_id: mobile,
          iptvuser_password: "test55",
          scheme_id: 1,
          bouque_ids: [1],
          rperiod_id: 2,
          cdn_id,
        };
  
        const accountRes = await fetch(
          "http://202.62.66.122/api/railtel.php/v1/account?vr=railtel1.1",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: token,
            },
            body: JSON.stringify(accountPayload),
          }
        );
  
        const accountData = await accountRes.json();
  
        if (!accountRes.ok) {
          const errorMsg = accountData?.data?.message?.pairing_id?.[0];
          if (errorMsg?.includes("already in assigned")) {
            currentExistingMobiles.push(mobile);
          }
        continue;
        } else {
          successMobiles.push(mobile);
          processedPhones.add(mobile);
        }
      } catch (err) {
        console.error("Error:", err);
        alert("Something went wrong.");
      }
    }
    setSelectedOrderIds([]); // ✅ This will uncheck all checkboxes
    setSuccessMobiles(successMobiles);
    setShowResultModal(true);
    setTotalSelectedCount(selectedOrderIds.length); // ✅ Save selected count
    setExistingMobiles((prev) => Array.from(new Set([...prev, ...existingMobiles])));
    setExistingMobiles((prev) => {
      const updatedList = Array.from(new Set([...prev, ...currentExistingMobiles]));
      localStorage.setItem("existingMobiles", JSON.stringify(updatedList)); // 🧠 Save to localStorage
      return updatedList;
    });
  };
  
  if (loading) return <p className="p-4">Loading...</p>;
  if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

  return (
    <div className="w-full px-4 pt-24 pl-20 overflow-x-auto mb-8">
      <h1 className="text-2xl font-bold mb-6 text-left mt-[2rem]">
        Pending orders from BSNL FMS
      </h1>

      <div className="flex flex-wrap items-center gap-4 mb-6">
        <label className="font-medium">Filter by BA</label>

        <select
          className="border border-gray-300 rounded px-3 py-2 w-64"
          value={selectedBA}
          onChange={handleFilterChange}
        >
          <option value="">-- Select BA --</option>
          {bas.map((ba, idx) => (
            <option key={idx} value={ba}>
              {ba}
            </option>
          ))}
        </select>

          <Select
            className="w-64"
            options={orderDateOptions}
            value={orderDateOptions.find(opt => opt.value === selectedOD)}
            onChange={(selectedOption: SingleValue<OptionType>) => {
              setSelectedOD(selectedOption?.value || '');
              setSelectedOrderIds([]);
            }}
            onFocus={(e) => {
              e.target.click();
            }}
            placeholder="-- DD/MM/YYYY --"
            isClearable
          />

        <button
          type="button"
          onClick={resetBA}
          className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
        >
          Clear
        </button>

        <button
          type="button"
          onClick={downloadCSV}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Generate Upload File
        </button>

        <button
          type="button"
          onClick={handleCreate}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
        >
          Send
        </button>
      </div>

      <div className="overflow-auto">
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
                <td className="px-4 py-2 border">{order.RMN || order.PHONE_NO}</td>
                <td className="p-2 border font-bold">
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
      
      {showResultModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg w-[900px] max-h-[80vh] overflow-y-auto relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-blue-600">
              📋 Registration Summary
            </h2>
            <button
              onClick={() => {
                setShowResultModal(false);
              }}
              className="text-blue-600 font-bold text-lg hover:underline"
            >
              ← Back
            </button>
          </div>
            <p className="text-sm font-medium text-gray-600 mb-2">
              Total Selected: {totalSelectedCount}
            </p>

            <p className="mb-2 text-green-600">
              ✅ Successfully Registered: <strong>{successMobiles.length}</strong>
            </p>
            <p className="mb-2 text-red-600">
              ⚠️ Already Exists: <strong>{existingMobiles.length}</strong>
            </p>

            {existingMobiles.length > 0 && (
              <div className="mt-6">
                <div className="flex justify-between items-center">
                  <p
                    onClick={() => setShowExisting(!showExisting)}
                    className="font-semibold text-blue-700 cursor-pointer hover:underline"
                  >
                    View All Existing Numbers ({existingMobiles.length})
                  </p>
                </div>

                {showExisting && (
                  <div className="mt-2 bg-gray-100 p-4 rounded">
                    <p className="text-sm text-gray-700 mb-2">
                      Total {existingMobiles.length} existing number(s):
                    </p>
                    <ul className="list-disc list-inside text-sm text-gray-800 max-h-40 overflow-y-auto">
                      {existingMobiles.map((num, idx) => (
                        <li key={idx}>{num}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {successMobiles.length > 0 && (
              <div className="mt-4">
                <p
                  onClick={() => setShowRegistered(!showRegistered)}
                  className="font-semibold text-green-700 mb-2 cursor-pointer hover:underline"
                >
                  Registered Numbers Details Click Here:
                </p>

                {showRegistered && (
                  <>
                    <p className="text-sm text-gray-600 mb-2">
                      Total {successMobiles.length} registered number(s) are listed below.
                    </p>
                    <ul className="list-disc list-inside text-sm">
                      {successMobiles.map((num, idx) => (
                        <li key={idx}>{num}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            )}

            <p className="mt-6 font-bold text-xl text-gray-700">
              Do you want to renew their subscription?
            </p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setShowResultModal(false);
                  setExistingMobiles([]);
                  setSuccessMobiles([]);
                }}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {isPopupVisible && popupData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-xl shadow-lg relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={closePopup}
              className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-semibold mb-4">Order Details</h2>
            <div className="space-y-2 text-sm mb-6">
              <p><strong>Order ID:</strong> {popupData.ORDER_ID}</p>
              <p><strong>Order Date:</strong> {popupData.ORDER_DATE}</p>
              <p><strong>Customer Name:</strong> {popupData.CUSTOMER_NAME}</p>
              <p><strong>Phone:</strong> {popupData.RMN || popupData.PHONE_NO}</p>
              <p><strong>Email:</strong> {popupData.EMAIL}</p>
              <p><strong>Address:</strong> {popupData.ADDRESS}</p>
              <p><strong>Circle Code:</strong> {popupData.CIRCLE_CODE}</p>
              <p><strong>BA Code:</strong> {popupData.BA_CODE}</p>
              <p><strong>Customer Account No:</strong> {popupData.CUST_ACCNT_NO}</p>
              <p><strong>Maintenance Franchise Code:</strong> {popupData.MTCE_FRANCHISE_CODE}</p>
              <p><strong>Cache Unique ID:</strong> {popupData.CACHE_UNIQUE_ID}</p>
              <p><strong>Bill Account No:</strong> {popupData.BILL_ACCNT_NO}</p>
              <p><strong>Customer Type:</strong> {popupData.CUST_TYPE}</p>
              <p><strong>Cache VLAN ID:</strong> {popupData.CACHE_VLAN_ID}</p>
              <p><strong>MAC ID:</strong> {popupData.MAC_ID}</p>
              <p><strong>LMO User:</strong> {popupData.LMO_USER}</p>
              <p><strong>Vendor Code:</strong> {popupData.VENDOR_CODE}</p>
              <p><strong>Username:</strong> {popupData.USERNAME}</p>
              <p><strong>Exchange Code:</strong> {popupData.EXCHANGE_CODE}</p>
              <p><strong>IPTV Status:</strong> {popupData.IPTV_STATUS}</p>
            </div>

            <div className="flex justify-end space-x-4">
              <button
                onClick={closePopup}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  console.log("Create clicked", popupData);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IPTVOrdersPage;
