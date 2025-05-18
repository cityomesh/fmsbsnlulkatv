"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter(); // Next.js router

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await fetch(
        "http://202.62.66.122/api/railtel.php/v1/user/login?vr=railtel1.1", // 👈 Updated API URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            LoginForm: {
              username,
              password,
            },
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess("User login successful!");
        console.log("User Data:", data.data);
        localStorage.setItem("access_token", data.data.access_token);
        localStorage.setItem("auth_token", data.data.auth_token);
        localStorage.setItem("username", data.data.username); 

        setTimeout(() => {
          router.push("/");
        }, 1000);
      } else {
        setError(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-xl p-8 bg-black rounded-lg shadow-lg bg-gray-200">
        <div className="flex justify-center gap-4 mb-6">
          <Link href="/">
            <Image src="/bsnl.png" alt="BSNL Logo" width={50} height={40} />
          </Link>
          <Link href="/">
            <Image src="/ulka.png" alt="ULKA Logo" width={50} height={40} />
          </Link>
        </div>

        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            className="w-full p-3 mb-3 bg-white text-black rounded-md focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 mb-3 bg-white text-black rounded-md focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-3">{success}</p>}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        <div className="flex justify-between text-sm mt-4 text-gray-400">
          <a href="#" className="hover:text-white">
            Signup/Register
          </a>
          <a href="/forgotpassword" className="hover:text-white">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;


// "use client";
// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";

// const Login = () => {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const [success, setSuccess] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const router = useRouter();

//   // Check if user is already logged in
//   useEffect(() => {
//     const token = localStorage.getItem("access_token");
//     if (token) {
//       setIsLoggedIn(true);
//     }
//   }, []);

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError("");
//     setSuccess("");

//     try {
//       const response = await fetch(
//         "http://202.62.66.122/api/railtel.php/v1/user/login?vr=railtel1.1",
//         {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify({
//             LoginForm: {
//               username,
//               password,
//             },
//           }),
//         }
//       );

//       const data = await response.json();

//       if (data.success) {
//         setSuccess("User login successful!");
//         console.log("User Data:", data.data);
//         localStorage.setItem("access_token", data.data.access_token);
//         localStorage.setItem("auth_token", data.data.auth_token);
//         localStorage.setItem("username", data.data.username);

//         setIsLoggedIn(true);

//         setTimeout(() => {
//           router.push("/"); // Redirect to home or dashboard
//         }, 1000);
//       } else {
//         setError(data.message || "Invalid credentials. Please try again.");
//       }
//     } catch (error) {
//       setError("Something went wrong. Please try again later.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("access_token");
//     localStorage.removeItem("auth_token");
//     localStorage.removeItem("username");
//     setIsLoggedIn(false);
//     router.push("/login");
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-50">
//       <div className="w-full max-w-xl p-8 bg-black rounded-lg shadow-lg bg-gray-200">
//         <div className="flex justify-center gap-4 mb-6">
//           <Link href="/">
//             <Image src="/bsnl.png" alt="BSNL Logo" width={50} height={40} />
//           </Link>
//           <Link href="/">
//             <Image src="/ulka.png" alt="ULKA Logo" width={50} height={40} />
//           </Link>
//         </div>

//         {!isLoggedIn ? (
//           <>
//             <form onSubmit={handleLogin}>
//               <input
//                 type="text"
//                 placeholder="Username"
//                 className="w-full p-3 mb-3 bg-white text-black rounded-md focus:outline-none"
//                 value={username}
//                 onChange={(e) => setUsername(e.target.value)}
//                 required
//               />
//               <input
//                 type="password"
//                 placeholder="Password"
//                 className="w-full p-3 mb-3 bg-white text-black rounded-md focus:outline-none"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 required
//               />
//               {error && <p className="text-red-500 text-sm mb-3">{error}</p>}
//               {success && <p className="text-green-500 text-sm mb-3">{success}</p>}
//               <button
//                 type="submit"
//                 className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md"
//                 disabled={loading}
//               >
//                 {loading ? "Logging in..." : "Login"}
//               </button>
//             </form>

//             <div className="flex justify-between text-sm mt-4 text-gray-400">
//               <a href="#" className="hover:text-white">
//                 Signup/Register
//               </a>
//               <a href="/forgotpassword" className="hover:text-white">
//                 Forgot password?
//               </a>
//             </div>
//           </>
//         ) : (
//           <>
//             <p className="text-green-600 text-center font-semibold text-lg mb-4">
//               You are already logged in.
//             </p>
//             <button
//               onClick={handleLogout}
//               className="w-full bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 rounded-md"
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Login;
