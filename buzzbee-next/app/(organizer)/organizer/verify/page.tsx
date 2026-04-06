"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, ShieldCheck, AlertCircle, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import api from "@/lib/axios";
import { useAuth } from "@/app/providers/auth-provider";

export default function VerificationPage() {
  const { user, refreshUser } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [docs, setDocs] = useState<string[]>([]);

  const handleDocAdd = () => {
    // Simulated upload for now - in real app would be a file input
    const mockDoc = `ID_Document_${Math.floor(Math.random() * 1000)}.pdf`;
    setDocs([...docs, mockDoc]);
  };

  const handleRemoveDoc = (index: number) => {
    setDocs(docs.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (docs.length === 0) {
      setError("Please add at least one verification document.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await api.post("/auth/verify-organizer", {
        documents: docs
      });
      setSuccess(true);
      await refreshUser();
      setTimeout(() => {
        router.push("/organizer/dashboard");
      }, 3000);
    } catch (err: unknown) {
      let message = "Failed to submit verification.";
      if (err && typeof err === 'object' && 'response' in err) {
        message = (err as any).response?.data?.message || message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (user?.isVerified) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="text-green-600" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Already Verified!</h1>
          <p className="text-gray-600 mb-6">Your organizer account is already verified. You can now host events as a trusted partner.</p>
          <Button variant="primary" onClick={() => router.push("/organizer/dashboard")}>Back to Dashboard</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="bg-brand-coral p-8 text-white">
            <div className="flex items-center gap-3 mb-4">
              <ShieldCheck size={32} />
              <h1 className="text-3xl font-bold">Organizer Verification</h1>
            </div>
            <p className="opacity-90">Verify your identity to build trust and unlock advanced features for your events.</p>
          </div>

          <div className="p-8">
            {success ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="text-green-600" size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Submission Successful!</h2>
                <p className="text-gray-600">Your documents have been sent to the admin team. We will review them within 24-48 hours. Redirecting...</p>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3 text-blue-800 text-sm">
                  <AlertCircle className="shrink-0" size={20} />
                  <p>Submit a clear photo of your government-issued ID (Passport, Citizenship, or License) and/or official organization registration documents.</p>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">Upload Documents</h3>
                  <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center hover:border-brand-coral transition-colors">
                    <Upload className="mx-auto text-gray-400 mb-3" size={40} />
                    <p className="text-gray-600 mb-4">Drag and drop your files here or click to browse</p>
                    <Button 
                      variant="outline" 
                      onClick={handleDocAdd}
                      className="cursor-pointer"
                    >
                      Attach Document
                    </Button>
                  </div>

                  {docs.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-700">Selected Files:</p>
                      {docs.map((doc, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-gray-50 border border-gray-200 p-3 rounded-lg">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <FileText className="text-brand-coral shrink-0" size={18} />
                            <span className="text-sm text-gray-700 truncate">{doc}</span>
                          </div>
                          <button 
                            onClick={() => handleRemoveDoc(idx)}
                            className="text-red-500 hover:text-red-700 p-1"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
                    {error}
                  </div>
                )}

                <div className="pt-4 border-t border-gray-100 flex gap-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button 
                    variant="primary" 
                    className="flex-1 bg-brand-coral text-white"
                    onClick={handleSubmit}
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit for Verification"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
