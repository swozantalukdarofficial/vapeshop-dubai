import { NextRequest, NextResponse } from "next/server";
import {
  getAllStoredReviews,
  getApprovedReviewsForProduct,
  submitNewReview,
  moderateReview,
} from "@/lib/reviews/store";
import { getSession } from "@/lib/auth/session";

/** GET /api/reviews?productHandle=xyz&admin=true */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const productHandle = searchParams.get("productHandle");
    const adminMode = searchParams.get("admin") === "true";

    if (adminMode) {
      const session = await getSession();
      if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      const allReviews = await getAllStoredReviews();
      return NextResponse.json({ reviews: allReviews });
    }

    if (productHandle) {
      const reviews = await getApprovedReviewsForProduct(productHandle);
      return NextResponse.json({ reviews });
    }

    const all = await getAllStoredReviews();
    const approved = all.filter((r) => r.status === "approved");
    return NextResponse.json({ reviews: approved });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch reviews" }, { status: 500 });
  }
}

/** POST /api/reviews -> Submit new review (pending) */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productHandle, productName, author, location, rating, title, comment } = body;

    if (!author || !title || !comment || !productHandle) {
      return NextResponse.json(
        { error: "Missing required fields: author, title, comment, productHandle" },
        { status: 400 }
      );
    }

    const formattedDate = new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });

    const newReview = await submitNewReview({
      productHandle,
      productName: productName || productHandle,
      author,
      location: location || "Dubai, UAE",
      rating: Number(rating) || 5,
      title,
      comment,
      date: formattedDate,
      verified: true,
      helpfulCount: 0,
    });

    return NextResponse.json({
      success: true,
      message: "Review submitted for admin verification. It will appear once approved.",
      review: newReview,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit review" }, { status: 500 });
  }
}

/** PATCH /api/reviews -> Admin Moderate (Approve/Reject/Delete) */
export async function PATCH(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json({ error: "Missing id or action" }, { status: 400 });
    }

    const success = await moderateReview(id, action);
    if (!success) {
      return NextResponse.json({ error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: `Review ${action}d successfully` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to moderate review" }, { status: 500 });
  }
}
