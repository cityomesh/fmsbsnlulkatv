// "use client";
// import React, { useEffect, useState, useMemo } from "react";
// import Header from "../../components/Header";
// import axios from "axios";
// import { circleToCdnMap } from "../../components/constants/cdnMap";

// type Order = {
//     ORDER_ID: string;
//     ORDER_DATE: string;
//     CUSTOMER_NAME: string;
//     CIRCLE_CODE: string;
//     BA_CODE: string;
//     RMN?: string;
//     PHONE_NO?: string;
//     [key: string]: any;
//     EMAIL?: string;
//     ADDRESS?: string;
//     CUST_ACCNT_NO?: string;
//     MTCE_FRANCHISE_CODE?: string;
//     CACHE_UNIQUE_ID?: string;
//     BILL_ACCNT_NO?: string;
//     CUST_TYPE?: string;
//     CACHE_VLAN_ID?: string;
//     MAC_ID?: string;
//     LMO_USER?: string;
//     VENDOR_CODE?: string;
//     USERNAME?: string;
//     EXCHANGE_CODE?: string;
//     IPTV_STATUS?: string;
  
//     fname?: string;
//     lname?: string;
//     mname?: string;
//     gender?: string;
//     mobile_no?: string;
//     phone_no?: string;
//     sublocation_code?: string;
//     flatno?: string;
//     floor?: string;
//     wing?: string;
//     installation_address?: string;
//     installation_pincode?: string;
//     billing_address?: string;
//     billing_pincode?: string;
//     iptvuser_id?: string;
//     bouque_code?: string;
//     outstanding?: string;
//     scheme_code?: string;
//     rperiod_code?: string;
//     dob?: string;
//     customer_type?: string;
//     formno?: string;
//     uid?: string;
//     minid?: string;
//     warranty_date?: string;
//     is_verified?: string;
//     gst_no?: string;
//     iptvuser_password?: string;
//     cdn_code?: string;
//     warranty_end_date?: string;
//   };

// export default function FilteredOrdersByExistingMobiles() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [existingMobiles, setExistingMobiles] = useState<string[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedBA, setSelectedBA] = useState("");
//   const [selectedOD, setSelectedOD] = useState("");
//   const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
//   const [popupData, setPopupData] = useState<Order | null>(null);
//   const [showRenewModal, setShowRenewModal] = useState(false);
//   const [currentMobile, setCurrentMobile] = useState<string | null>(null);
//   const [showResultModal, setShowResultModal] = useState(false);
//   const [successMobiles, setSuccessMobiles] = useState<string[]>([]);
//   const [isRenewChecked, setIsRenewChecked] = useState(false);

//   const currentExistingMobiles: string[] = []; // temp store for this run


//   const handleViewClick = (order: Order) => {
//     setPopupData(order);
//   };
//   const closePopup = () => {
//     setPopupData(null);
//   };

//   useEffect(() => {
//     const stored = localStorage.getItem("existingMobiles");
//     const savedIds = localStorage.getItem('selectedOrderIds');
//     const cachedOrders = localStorage.getItem("filteredOrders");

//     if (cachedOrders) {
//         setOrders(JSON.parse(cachedOrders));
//       }
    
//     if (savedIds) {
//       setSelectedOrderIds(JSON.parse(savedIds));
//     }

//     if (stored) setExistingMobiles(JSON.parse(stored));

//     const cached = localStorage.getItem("filteredOrders");
//     if (cached) setOrders(JSON.parse(cached));
//     fetchFilteredOrders();
//   }, []);

//   useEffect(() => {
//     if (existingMobiles.length > 0) fetchFilteredOrders();
//   }, [existingMobiles]);

//   async function fetchFilteredOrders() {
//     setLoading(true);
//     try {
//       const response = await fetch("/api/fetchIptvOrders", { method: "POST" });
//       if (!response.ok) throw new Error("Failed to fetch orders");
  
//       const data = await response.json();
//       const allOrders: Order[] = data.orders || [];
  
//       const filtered = allOrders.filter((order) =>
//         existingMobiles.includes(order.RMN || order.PHONE_NO || "")
//       );
  
//       const filteredWithCDN = filtered.map((order) => ({
//         ...order,
//         CDN_LABEL: circleToCdnMap[order.CIRCLE_CODE] || "CD1",
//       }));
  
//       const cached = localStorage.getItem("filteredOrders");
//       const previousOrders: Order[] = cached ? JSON.parse(cached) : [];
  
//       const combined = [...previousOrders, ...filteredWithCDN];
//       const uniqueOrders = Array.from(
//         new Map(combined.map((order) => [order.ORDER_ID, order])).values()
//       );
  
//       setOrders(uniqueOrders);
//       localStorage.setItem("filteredOrders", JSON.stringify(uniqueOrders));
//     } catch (error) {
//       console.error("Fetch error:", error);
//       const cached = localStorage.getItem("filteredOrders");
//       if (cached) {
//         setOrders(JSON.parse(cached));
//       } else {
//         setOrders([]);
//       }
//     } finally {
//       setLoading(false);
//     }
//   }
  
//   const token = `Bearer ${localStorage.getItem("access_token")}`; // ✅ Use stored token

//   const handleCreate = async () => {
//       if (selectedOrderIds.length === 0) {
//         alert("Please select at least one order.");
//         return;
//       }
    
//       const selectedOrders = orders.filter((order) =>
//         selectedOrderIds.includes(order.ORDER_ID)
//       );
    
//       const processedPhones = new Set<string>();
//       const successMobiles: string[] = [];
//       const existingMobiles: string[] = [];
    
//       for (const order of selectedOrders) {
//         const mobile = order.RMN || order.PHONE_NO || "9999999999";
//         if (processedPhones.has(mobile)) continue;
    
//         const cleanCircle = order.CIRCLE_CODE?.trim().toUpperCase();
//         const cdn_id = circleToCdnMap[cleanCircle] || 1;
    
//         const subscriberPayload = {
//           billing_address: { addr: order.ADDRESS || "N/A", pincode: "123456" },
//           fname: order.CUSTOMER_NAME || "N/A",
//           mname: "",
//           lname: "NA",
//           mobile_no: mobile,
//           phone_no: mobile,
//           email: order.EMAIL?.trim() || "user@example.com",
//           installation_address: order.ADDRESS || "N/A",
//           pincode: "123456",
//           formno: "",
//           gender: 0,
//           dob: null,
//           customer_type: 1,
//           sublocation_id: 5,
//           cdn_id: cdn_id,
//           flatno: "109",
//           floor: "5",
//         };
    
//         try {
//           const subscriberRes = await fetch(
//             "http://202.62.66.122/api/railtel.php/v1/subscriber?vr=railtel1.1",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: token,
//               },
//               body: JSON.stringify(subscriberPayload),
//             }
//           );
//           const subscriberData = await subscriberRes.json();
//           const subscriberId = subscriberData?.data?.id;
    
//           if (!subscriberRes.ok || !subscriberId) {
//             console.error("❌ Subscriber creation failed:", subscriberData);
//             continue;
//           }
    
//           const accountPayload = {
//             subscriber_id: subscriberId,
//             iptvuser_id: mobile,
//             iptvuser_password: "test55",
//             scheme_id: 1,
//             bouque_ids: [1],
//             rperiod_id: 2,
//             cdn_id,
//           };
    
//           const accountRes = await fetch(
//             "http://202.62.66.122/api/railtel.php/v1/account?vr=railtel1.1",
//             {
//               method: "POST",
//               headers: {
//                 "Content-Type": "application/json",
//                 Authorization: token,
//               },
//               body: JSON.stringify(accountPayload),
//             }
//           );
    
//           const accountData = await accountRes.json();
    
//           if (!accountRes.ok) {
//             const errorMsg = accountData?.data?.message?.pairing_id?.[0];
//             if (errorMsg?.includes("already in assigned")) {
//               currentExistingMobiles.push(mobile);
//             }
//           continue;
//           } else {
//             successMobiles.push(mobile);
//             processedPhones.add(mobile);
//           }
//         } catch (err) {
//           console.error("Error:", err);
//           alert("Something went wrong.");
//         }
//       }
    
//       setSelectedOrderIds([]);
//       setSuccessMobiles(successMobiles);
//       setShowResultModal(true);
//       setExistingMobiles((prev) => Array.from(new Set([...prev, ...existingMobiles])));
//       setExistingMobiles((prev) => {
//         const updatedList = Array.from(new Set([...prev, ...currentExistingMobiles]));
//         localStorage.setItem("existingMobiles", JSON.stringify(updatedList));
//         return updatedList;
//       });
//     };

//   const handleRenew = async () => {
//     try {
//       const subscriberResponse = await axios.get(
//         `http://202.62.66.122/api/railtel.php/v1/subscriber?filter[mobile]=${currentMobile}&expand=...`,
//         {
//           headers: {
//             Authorization: token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const subscriberId = subscriberResponse?.data?.data?.[0]?.id;
//       if (!subscriberId) throw new Error("Subscriber ID not found");

//       const accountResponse = await axios.get(
//         `http://202.62.66.122/api/railtel.php/v1/account?filter[subscriber_id]=${subscriberId}&expand=is_rpc,is_primary_lbl,...`,
//         {
//           headers: {
//             Authorization: token,
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       const accountId = accountResponse?.data?.data?.[0]?.id;
//       if (!accountId) throw new Error("Account ID not found");

//       const renewPayload = {
//         account_id: accountId.toString(),
//         bouque_ids: [1],
//         rperiod_id: 2,
//         remark: "Renew",
//       };

//       const renewResponse = await axios.post(
//         "http://202.62.66.122/api/railtel.php/v1/account-bouque/0?vr=railtel1.1",
//         renewPayload,
//         {
//           headers: {
//             Authorization: token,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log("Renewal successful:", renewResponse.data);
//       alert("Renewal successful!");
//       setShowRenewModal(false);
//     } catch (error) {
//       console.error("Renewal failed:", error);
//       alert("Renewal failed. Please try again.");
//     }
//     setSelectedOrderIds([]);
//   };


//   const filteredOrders = useMemo(() => {
//     return orders.filter((order) => {
//       const orderDateOnly = order.ORDER_DATE.split(" ")[0];
//       const matchBA = selectedBA ? order.BA_CODE === selectedBA : true;
//       const matchOD = selectedOD ? orderDateOnly === selectedOD : true;
//       return matchBA && matchOD;
//     });
//   }, [orders, selectedBA, selectedOD]);


//   const downloadCSV = () => {
//     const headers = [
//       "fname", "lname", "mname", "gender", "mobile_no", "phone_no", "email",
//       "sublocation_code", "flatno", "floor", "wing", "installation_address",
//       "installation_pincode", "billing_address", "billing_pincode",
//       "iptvuser_id", "bouque_code", "outstanding", "scheme_code",
//       "rperiod_code", "dob", "customer_type", "formno", "uid", "minid",
//       "warranty_date", "is_verified", "gst_no", "iptvuser_password",
//       "cdn_code", "warranty_end_date"
//     ];

//     const selectedOrders = filteredOrders.filter(order =>
//       selectedOrderIds.includes(order.ORDER_ID)
//     );

//     const rows = selectedOrders.map(order => {
//       const addressParts = (order.ADDRESS || "").split(",");
//       const pincode = addressParts[addressParts.length - 1]?.trim() || "";
//       const fullName = (order.CUSTOMER_NAME || "").trim().split(" ");
//       const fname = fullName.slice(0, 2).join(" ");
//       const lname = fullName.slice(2).join(" ");

//       return [
//         fname, lname, "", "1", order.RMN || "", order.PHONE_NO || "", order.EMAIL || "",
//         "S0005S000001", "1", "1", "", order.ADDRESS || "", pincode, order.ADDRESS || "",
//         pincode, order.RMN, "1", "", "X000002", "3", "", "1", "0", "", "", "", "", "",
//         "Bsnl@123", "1", ""
//       ];
//     });

//     const csvContent = [headers, ...rows]
//       .map(row => row.map(item => `"${item}"`).join(","))
//       .join("\n");

//     const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement("a");
//     link.setAttribute("href", url);
//     link.setAttribute("download", "selected_orders.csv");
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
//     localStorage.setItem('selectedOrderIds', JSON.stringify(selectedOrderIds));
//     setSelectedOrderIds([]);
//   };

//   const handleCheckboxChange = (orderId: string) => {
//     setSelectedOrderIds((prev) =>
//       prev.includes(orderId)
//         ? prev.filter((id) => id !== orderId)
//         : [...prev, orderId]
//     );
//   };
  

//   const handleSelectAll = () => {
//     const allIds = filteredOrders.map(o => o.ORDER_ID);
//     setSelectedOrderIds(prev => (prev.length === allIds.length ? [] : allIds));
//   };
  
//   const isAllSelected = filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length;


//   if (existingMobiles.length === 0) {
//     return <p className="mt-[7rem] ml-12">No existing mobile numbers found.</p>;
//   }


//   return (
//     <div className="p-16 mt-[4rem] mb-8">
//       <Header />
//       <div className="flex items-center gap-4 mb-4">
//         <h2 className="text-lg font-semibold">Orders Matching Existing Mobile Numbers</h2>

//         <button
//             type="button"
//             onClick={downloadCSV}
//             className="bg-red-500 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm"
//         >
//             Generate Upload File
//         </button>
//         <button
//             onClick={() => {
//             setShowResultModal(false);
//             handleRenew();
//             }}
//             className="px-4 py-2 bg-blue-600 text-white rounded"
//         >
//             Renew
//         </button>
//         </div>

//       {loading ? (
//         <p className="ml-12">Loading filtered orders...</p>
//       ) : filteredOrders.length === 0 ? (
//         <p className="ml-12">No orders match the given filters.</p>
//       ) : (
//         <div>
//           <table className="min-w-[1700px] border border-gray-300 text-[15px]">
//             <thead className="bg-gray-100 text-left font-bold">
//                 <tr>
//                 <th className="px-4 py-2 border">
//                     <input
//                     type="checkbox"
//                     checked={isAllSelected}
//                     onChange={handleSelectAll}
//                     />
//                 </th>
//                 <th className="px-4 py-2 border">Order ID</th>
//                 <th className="px-4 py-2 border">Order Date</th>
//                 <th className="px-4 py-2 border">Customer</th>
//                 <th className="px-4 py-2 border">Circle Code</th>
//                 <th className="px-4 py-2 border">BA Code</th>
//                 <th className="px-4 py-2 border">RMN</th>
//                 <th className="px-4 py-2 border">Action</th>
//                 </tr>
//             </thead>
//             <tbody>
//                 {orders.map((order, idx) => (
//                 <tr key={idx} className="hover:bg-gray-50">
//                     <td className="px-4 py-2 border">
//                     <input
//                         type="checkbox"
//                         checked={selectedOrderIds.includes(order.ORDER_ID)}
//                         onChange={() => handleCheckboxChange(order.ORDER_ID)}
//                     />
//                     </td>
//                     <td className="px-4 py-2 border">{order.ORDER_ID}</td>
//                     <td className="px-4 py-2 border">{order.ORDER_DATE}</td>
//                     <td className="px-4 py-2 border">{order.CUSTOMER_NAME}</td>
//                     <td className="px-4 py-2 border">{order.CIRCLE_CODE}</td>
//                     <td className="px-4 py-2 border">{order.BA_CODE}</td>
//                     <td className="px-4 py-2 border">{order.RMN || order.PHONE_NO}</td>
//                     <td className="p-2 border font-bold">
//                         <button
//                         onClick={() => handleViewClick(order)}
//                         className="text-blue-500"
//                         >
//                         View
//                         </button>
//                     </td>
//                 </tr>
//                 ))}
//             </tbody>
//             </table>
//         </div>
//       )}

//       {popupData && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
//           <div className="bg-white p-6 rounded-lg w-[90%] max-w-xl shadow-lg relative overflow-y-auto max-h-[90vh]">
//             <button
//               onClick={closePopup}
//               className="absolute top-2 right-2 text-gray-500 hover:text-black text-xl"
//             >
//               &times;
//             </button>
//             <h2 className="text-xl font-semibold mb-4">Order Details</h2>
//             <div className="space-y-2 text-sm mb-6 max-h-[60vh] overflow-y-auto">
//               {Object.entries(popupData).map(([key, value]) => {
//                 if (!value) return null;
//                 const formattedKey = key
//                   .replace(/_/g, " ")
//                   .toLowerCase()
//                   .replace(/\b\w/g, (c) => c.toUpperCase());

//                 return (
//                   <p key={key}>
//                     <strong>{formattedKey}:</strong> {value}
//                   </p>
//                 );
//               })}
//             </div>

//             <div className="flex justify-end space-x-4">
//               <button
//                 onClick={closePopup}
//                 className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={async () => {
//                   try {
//                     const response = await fetch("/api/createOrder", {
//                       method: "POST",
//                       headers: {
//                         "Content-Type": "application/json",
//                       },
//                       body: JSON.stringify(popupData),
//                     });

//                     const result = await response.json();
//                     if (result.success) {
//                       alert("Order saved successfully!");
//                       closePopup();
//                     } else {
//                       alert("Failed to save order.");
//                     }
//                   } catch (err) {
//                     console.error("Error creating order:", err);
//                     alert("Something went wrong.");
//                   }
//                 }}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 Create
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }








"use client";
import React, { useEffect, useState, useMemo } from "react";
import Header from "../../components/Header";
import axios from "axios";
import { circleToCdnMap } from "../../components/constants/cdnMap";

type Order = {
  ORDER_ID: string;
  ORDER_DATE: string;
  CUSTOMER_NAME: string;
  CIRCLE_CODE: string;
  BA_CODE: string;
  RMN?: string;
  PHONE_NO?: string;
  [key: string]: any;
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

export default function FilteredOrdersByExistingMobiles() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [existingMobiles, setExistingMobiles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBA, setSelectedBA] = useState("");
  const [selectedOD, setSelectedOD] = useState("");
  const [selectedOrderIds, setSelectedOrderIds] = useState<string[]>([]);
  const [popupData, setPopupData] = useState<Order | null>(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [successMobiles, setSuccessMobiles] = useState<string[]>([]);
  const currentExistingMobiles: string[] = [];

  const handleViewClick = (order: Order) => setPopupData(order);
  const closePopup = () => setPopupData(null);

  useEffect(() => {
    const stored = localStorage.getItem("existingMobiles");
    const savedIds = localStorage.getItem("selectedOrderIds");
    const cachedOrders = localStorage.getItem("filteredOrders");

    if (cachedOrders) setOrders(JSON.parse(cachedOrders));
    if (savedIds) setSelectedOrderIds(JSON.parse(savedIds));
    if (stored) setExistingMobiles(JSON.parse(stored));

    fetchFilteredOrders();
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

      setOrders(uniqueOrders);
      localStorage.setItem("filteredOrders", JSON.stringify(uniqueOrders));
    } catch (error) {
      console.error("Fetch error:", error);
      const cached = localStorage.getItem("filteredOrders");
      if (cached) setOrders(JSON.parse(cached));
      else setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  const token = `Bearer ${localStorage.getItem("access_token")}`;

  const handleCreate = async () => {
    if (selectedOrderIds.length === 0) return alert("Please select at least one order.");
    const selectedOrders = orders.filter((order) => selectedOrderIds.includes(order.ORDER_ID));

    const processedPhones = new Set<string>();
    const successMobiles: string[] = [];

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
        cdn_id,
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

        if (!subscriberRes.ok || !subscriberId) continue;

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

    setSelectedOrderIds([]);
    setSuccessMobiles(successMobiles);
    setShowResultModal(true);
    setExistingMobiles((prev) => {
      const updatedList = Array.from(new Set([...prev, ...currentExistingMobiles]));
      localStorage.setItem("existingMobiles", JSON.stringify(updatedList));
      return updatedList;
    });
  };




  const headers = [
    "fname", "lname", "mname", "gender", "mobile_no", "phone_no", "email",
    "sublocation_code", "flatno", "floor", "wing", "installation_address",
    "installation_pincode", "billing_address", "billing_pincode",
    "iptvuser_id", "bouque_code", "outstanding", "scheme_code",
    "rperiod_code", "dob", "customer_type", "formno", "uid", "minid",
    "warranty_date", "is_verified", "gst_no", "iptvuser_password",
    "cdn_code", "warranty_end_date"
  ];
  
  const downloadCSV = () => {
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
        fname, lname, "", "1", order.RMN || "", order.PHONE_NO || "", order.EMAIL || "",
        "S0005S000001", "1", "1", "", order.ADDRESS || "", pincode, order.ADDRESS || "",
        pincode, order.RMN, "1", "", "X000002", "3", "", "1", "0", "", "", "", "", "",
        "Bsnl@123", "1", ""
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
  
    localStorage.setItem('selectedOrderIds', JSON.stringify(selectedOrderIds));
    setSelectedOrderIds([]);
  };

  const handleCheckboxChange = (orderId: string) => {
    setSelectedOrderIds((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };
  
  
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const orderDateOnly = order.ORDER_DATE.split(" ")[0];
      const matchBA = selectedBA ? order.BA_CODE === selectedBA : true;
      const matchOD = selectedOD ? orderDateOnly === selectedOD : true;
      return matchBA && matchOD;
    });
  }, [orders, selectedBA, selectedOD]);

  const handleSelectAll = () => {
    const allIds = filteredOrders.map((o) => o.ORDER_ID);
    setSelectedOrderIds((prev) => (prev.length === allIds.length ? [] : allIds));
  };

  const isAllSelected = filteredOrders.length > 0 && selectedOrderIds.length === filteredOrders.length;

  if (existingMobiles.length === 0) {
    return <p className="mt-[7rem] ml-12">No existing mobile numbers found.</p>;
  }

  return (
    <div className="p-16 mt-[4rem] mb-8">
      <Header />
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-lg font-semibold">Orders Matching Existing Mobile Numbers</h2>
      </div>
      <button
          type="button"
          onClick={downloadCSV}
          disabled={selectedOrderIds.length === 0}
          className={`px-4 py-2 rounded text-sm text-white ${
            selectedOrderIds.length === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-red-500 hover:bg-blue-700'
          }`}
        >
          Generate Upload File
        </button>

      {loading ? (
        <p className="ml-12">Loading filtered orders...</p>
      ) : filteredOrders.length === 0 ? (
        <p className="ml-12">No orders match the given filters.</p>
      ) : (
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
              <th className="px-4 py-2 border">Customer Name</th>
              <th className="px-4 py-2 border">Mobile</th>
              <th className="px-4 py-2 border">BA Code</th>
              <th className="px-4 py-2 border">Order Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.ORDER_ID}>
                <td className="px-4 py-2 border">
                  <input
                    type="checkbox"
                    checked={selectedOrderIds.includes(order.ORDER_ID)}
                    onChange={() =>
                      setSelectedOrderIds((prev) =>
                        prev.includes(order.ORDER_ID)
                          ? prev.filter((id) => id !== order.ORDER_ID)
                          : [...prev, order.ORDER_ID]
                      )
                    }
                  />
                </td>
                <td className="px-4 py-2 border">{order.ORDER_ID}</td>
                <td className="px-4 py-2 border">{order.CUSTOMER_NAME}</td>
                <td className="px-4 py-2 border">{order.RMN || order.PHONE_NO}</td>
                <td className="px-4 py-2 border">{order.BA_CODE}</td>
                <td className="px-4 py-2 border">{order.ORDER_DATE}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        onClick={handleCreate}
      >
        Create Accounts
      </button>
    </div>
  );
}