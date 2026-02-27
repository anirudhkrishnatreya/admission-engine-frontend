import { useState } from "react";
import { useRouter } from "next/router";
import API from "../utils/api";
import { useToast } from "../components/ToastContext";

export default function Login() {
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    // This allows the "Enter" key to work by preventing the default form reload
    if (e) e.preventDefault();
    
    try {
      setLoading(true);
      const res = await API.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      router.push("/dashboard");
    } catch (err) {
      showToast("Invalid credentials, try again", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans text-gray-900">
      
      {/* LEFT SIDE: CAMPUS IMAGE */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="https://iitgandhinagar.futurense.com/pluginfile.php/1/theme_almondb/loginslideimage1/0/IIT%20Gandhinagar%20university%20image%20%281%29.jpg"
          alt="IIT Gandhinagar Campus"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>

      {/* RIGHT SIDE: LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          
          {/* LOGO SECTION */}
          <div className="flex items-center justify-center space-x-6 mb-10">
            <img 
              src="https://imgs.search.brave.com/gkwVunq7NUTF0yOSpoRdOCiPyXhglSmtOeblTODUtF8/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly93d3cu/dmh2LnJzL2Rwbmcv/ZC8xNzYtMTc2MzQy/Nl9pbWFnZS1kZXNj/cmlwdGlvbi1paXQt/Z2FuZGhpbmFnYXIt/bG9nby1oZC1wbmct/ZG93bmxvYWQucG5n" 
              alt="IITGN Logo" 
              className="h-16 w-auto" 
            />
            <div className="h-12 w-[1.5px] bg-gray-300"></div>
            <div className="flex flex-col items-center">
               <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">Powered by</span>
               <img 
                 src="https://pbs.twimg.com/profile_images/1540573271862566912/kWFeLqSG_400x400.jpg" 
                 alt="Futurense Logo" 
                 className="h-10 w-auto" 
               />
            </div>
          </div>

          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Welcome Back.</h2>
            <p className="text-gray-500 text-sm">
              Glad to see you here again! Login to your account with your credentials.
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold mb-2">Enter Email</label>
              <input
                type="email"
                required
                className="w-full p-4 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition shadow-sm"
                placeholder="ex. knockturnals@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2">Enter Password</label>
              <input
                type="password"
                required
                className="w-full p-4 rounded-lg border border-gray-200 bg-gray-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-600 transition shadow-sm"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex justify-start">
              <button type="button" className="text-xs text-gray-400 hover:text-purple-600 transition underline underline-offset-4 decoration-gray-300">
                Forgot Password ?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#5a36bc] to-[#4527a0] hover:from-[#4527a0] hover:to-[#5a36bc] text-white font-bold rounded-lg shadow-xl shadow-purple-200 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}