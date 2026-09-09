"use client";

import React, { useState, useEffect } from "react";
import { Star, Check, X, Trash2, MessageSquare, Loader2, RefreshCw, CheckCircle2, Clock } from "lucide-react";
import type { StoredReview } from "@/lib/reviews/store";

interface ReviewsManagerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewsUpdated?: () => void;
}

export function ReviewsManagerDialog({ isOpen, onClose, onReviewsUpdated }: ReviewsManagerDialogProps) {
  const [reviews, setReviews] = useState<StoredReview[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"pending" | "approved" | "all">("pending");

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/reviews?admin=true");
      if (res.ok) {
        const data = await res.json();
        setReviews(data.reviews || []);
      }
    } catch (err) {
      console.error("Failed to fetch admin reviews", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchReviews();
    }
  }, [isOpen]);

  const handleModerate = async (id: string, action: "approve" | "reject" | "delete") => {
    setActionId(id);
    try {
      const res = await fetch("/api/reviews", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, action }),
      });

      if (res.ok) {
        setReviews((prev) =>
          action === "delete"
            ? prev.filter((r) => r.id !== id)
            : prev.map((r) => (r.id === id ? { ...r, status: action === "approve" ? "approved" : "rejected" } : r))
        );
        onReviewsUpdated?.();
      }
    } catch (err) {
      console.error("Failed to moderate review", err);
    } finally {
      setActionId(null);
    }
  };

  if (!isOpen) return null;

  const pendingReviews = reviews.filter((r) => r.status === "pending");
  const approvedReviews = reviews.filter((r) => r.status === "approved");
  const filteredList =
    activeTab === "pending"
      ? pendingReviews
      : activeTab === "approved"
      ? approvedReviews
      : reviews;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh] border border-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-slate-900 text-white">
          <div className="flex items-center gap-2.5">
            <MessageSquare className="h-5 w-5 text-orange-400" />
            <h2 className="text-base font-black tracking-wide uppercase">Product Reviews Moderation</h2>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Controls & Refresh */}
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-3 bg-slate-50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("pending")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "pending"
                  ? "bg-amber-500 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              Pending ({pendingReviews.length})
            </button>

            <button
              onClick={() => setActiveTab("approved")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === "approved"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              Approved ({approvedReviews.length})
            </button>

            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-slate-900 text-white shadow-xs"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-100"
              }`}
            >
              All ({reviews.length})
            </button>
          </div>

          <button
            onClick={fetchReviews}
            disabled={loading}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
            title="Refresh Reviews"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Reviews List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading && reviews.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              <p className="text-xs font-bold uppercase tracking-wider">Loading submitted reviews...</p>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <p className="text-sm font-semibold">No reviews found in this view.</p>
            </div>
          ) : (
            filteredList.map((review) => (
              <div
                key={review.id}
                className="border border-slate-200 rounded-xl p-4 bg-white shadow-2xs space-y-3 relative group"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-slate-900">{review.author}</span>
                    <span className="text-xs text-slate-500">({review.location})</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                      {review.productName || review.productHandle}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                        review.status === "approved"
                          ? "bg-emerald-100 text-emerald-700"
                          : review.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-amber-100 text-amber-700 animate-pulse"
                      }`}
                    >
                      {review.status}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">{review.date}</span>
                  </div>
                </div>

                {/* Rating & Content */}
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < review.rating ? "fill-amber-400 text-amber-400" : "text-slate-200"
                        }`}
                      />
                    ))}
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{review.title}</h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{review.comment}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  {review.status !== "approved" && (
                    <button
                      onClick={() => handleModerate(review.id, "approve")}
                      disabled={actionId === review.id}
                      className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      {actionId === review.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      Approve & Publish
                    </button>
                  )}

                  {review.status !== "rejected" && (
                    <button
                      onClick={() => handleModerate(review.id, "reject")}
                      disabled={actionId === review.id}
                      className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      Reject
                    </button>
                  )}

                  <button
                    onClick={() => handleModerate(review.id, "delete")}
                    disabled={actionId === review.id}
                    className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 text-slate-500 text-xs font-bold transition-all flex items-center gap-1 cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
