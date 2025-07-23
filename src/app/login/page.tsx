"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useTranslation } from "@/lib/useTranslation";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import FontSwitcher from "@/components/FontSwitcher";
import Image from "next/image";
import { useLang, useTheme, useFont } from "../ClientLayout";

// Animated container variants
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2, duration: 0.8 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 80 } },
};

export default function LoginPage() {
  const { lang, setLang } = useLang();
  const { theme, setTheme } = useTheme();
  const { t } = useTranslation(lang);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // Simulate login delay
    setTimeout(() => {
      setLoading(false);
      if (form.email === "admin" && form.password === "admin") {
        router.push("/dashboard");
      } else {
        setError(t("login.invalid_credentials"));
      }
    }, 1200);
  };

  return (
    <div className={`min-h-screen flex items-center justify-center theme-${theme} gradient-bg transition-colors duration-500`}>
      <motion.div
        className="w-full max-w-md p-8 rounded-2xl shadow-2xl card-glass relative"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        {/* Animated floating shapes */}
        <motion.div
          className="absolute -top-10 -left-10 w-32 h-32 bg-blue-400/30 rounded-full blur-2xl animate-pulse"
          animate={{ y: [0, 20, 0], x: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 4 }}
        />
        <motion.div
          className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-400/30 rounded-full blur-2xl animate-pulse"
          animate={{ y: [0, -20, 0], x: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 5 }}
        />
        {/* Theme, font, and language switchers */}
        <div className="flex justify-end gap-2 mb-4">
          <ThemeSwitcher currentTheme={theme} onThemeChange={setTheme} />
          <FontSwitcher theme={theme} />
          <LanguageSwitcher currentLanguage={lang} onLanguageChange={setLang} />
        </div>
        {/* Logo and title */}
        <motion.div variants={itemVariants} className="flex flex-col items-center mb-6">
          <Image src="/images/logo.png" alt="Cyber Hub Logo" width={64} height={64} className="mb-2" />
          <h1 className="text-3xl font-bold text-blue-900 dark:text-white mb-1 tracking-tight text-center">
            {t("login.title")}<br />
            <span className="text-3xl font-bold text-blue-900 dark:text-white">Cyber Hub</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-300 text-sm font-medium">{t("login.subtitle")}</p>
        </motion.div>
        {/* Login form */}
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-5"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants}>
            <label
              className="block mb-1 text-base font-bold dark:text-slate-200"
              htmlFor="email"
              style={{ color: theme === 'light' || theme === 'novel' ? '#000' : undefined }}
            >
              {t("login.email")}
            </label>
            <input
              id="email"
              name="email"
              type="text"
              autoComplete="username"
              placeholder={t("login.email")}
              className="input-field text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-300 border border-slate-500 dark:border-slate-700"
              value={form.email}
              onChange={handleChange}
              required
            />
          </motion.div>
          <motion.div variants={itemVariants}>
            <label
              className="block mb-1 text-base font-bold dark:text-slate-200"
              htmlFor="password"
              style={{ color: theme === 'light' || theme === 'novel' ? '#000' : undefined }}
            >
              {t("login.password")}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              placeholder={t("login.password")}
              className="input-field text-slate-800 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-300 border border-slate-500 dark:border-slate-700"
              value={form.password}
              onChange={handleChange}
              required
            />
          </motion.div>
          {error && (
            <motion.div variants={itemVariants} className="text-red-500 text-sm">
              {error}
            </motion.div>
          )}
          <motion.button
            type="submit"
            className="w-full py-2 rounded-xl bg-gradient-to-r from-blue-600 via-blue-500 to-green-400 hover:from-blue-700 hover:to-green-500 text-white font-bold shadow-lg transition-all duration-200 text-lg tracking-wide mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            disabled={loading}
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? t("login.loading") : t("login.submit")}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
}
// All comments are in English as per project requirements. 