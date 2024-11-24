import { SignIn } from "@clerk/clerk-react";
import { motion } from "framer-motion";

export const Auth = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-800 mb-6 text-center"
        >
          Welcome Back 👋
        </motion.h1>
        
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: 
                "bg-blue-600 hover:bg-blue-700 text-sm normal-case",
              card: "bg-transparent shadow-none",
              headerTitle: "hidden",
              headerSubtitle: "hidden",
              socialButtonsBlockButton: 
                "border-2 border-gray-200 hover:border-blue-600 hover:bg-blue-50",
              socialButtonsBlockButtonText: "text-gray-600",
              formFieldInput: 
                "border-2 focus:border-blue-600 focus:ring-0",
              footerActionLink: "text-blue-600 hover:text-blue-700"
            },
          }}
        />
      </motion.div>
    </div>
  );
};

export default Auth;
