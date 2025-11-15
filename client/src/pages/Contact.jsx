import React, { useState } from "react";
import { notifications as notificationsApi } from "../api/api";
import toast from "react-hot-toast";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill name, email and message");
      return;
    }
    setLoading(true);
    try {
      // Try backend notifications endpoint (if present). If it fails, fallback to mailto
      try {
        await notificationsApi.create({ title: form.subject || "Contact message", body: `${form.message}\nFrom: ${form.name} <${form.email}>` });
        toast.success("Message submitted. We'll follow up soon.");
        setForm({ name: "", email: "", subject: "", message: "" });
      } catch (err) {
        // Fallback: open mailto
        const mailto = `mailto:support@fintrustchain.example?subject=${encodeURIComponent(form.subject || 'Contact')} &body=${encodeURIComponent(form.message + '\n\nFrom: ' + form.name + ' <' + form.email + '>')}`;
        window.location.href = mailto;
        toast('Opening your email client...');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-max py-24">
      <div className="max-w-3xl mx-auto card p-6 rounded">
        <h2 className="text-2xl font-semibold neon-text">Contact Us</h2>
        <p className="text-gray-300 mt-2">Have questions or need help? Send us a message and our team will get back to you.</p>

        <form onSubmit={submit} className="mt-4 grid grid-cols-1 gap-3">
          <input value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Full name" className="p-3 rounded bg-transparent border border-white/6" />
          <input value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} placeholder="Email" className="p-3 rounded bg-transparent border border-white/6" />
          <input value={form.subject} onChange={(e)=>setForm({...form,subject:e.target.value})} placeholder="Subject" className="p-3 rounded bg-transparent border border-white/6" />
          <textarea value={form.message} onChange={(e)=>setForm({...form,message:e.target.value})} rows={6} placeholder="Message" className="p-3 rounded bg-transparent border border-white/6" />

          <div className="flex justify-end">
            <button className="btn-neon p-3 rounded" disabled={loading}>{loading? 'Sending...' : 'Send message'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
