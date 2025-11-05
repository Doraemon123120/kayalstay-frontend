import { useState, useEffect } from "react";
import { getPropertyReviews, getPropertyAverageRating, createReview } from "../services/api";

type Review = {
  _id: string;
  user: {
    name: string;
    profile?: {
      avatar?: string;
    };
  };
  rating: number;
  comment: string;
  createdAt: string;
};

type AverageRating = {
  averageRating: number;
  totalReviews: number;
};

export default function Reviews({ propertyId }: { propertyId: string }) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState<AverageRating>({ averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const loadReviews = async () => {
    try {
      const res = await getPropertyReviews(propertyId, page, 5);
      setReviews(page === 1 ? res.data.reviews : [...reviews, ...res.data.reviews]);
      setHasMore(res.data.pagination.page < res.data.pagination.pages);
    } catch (err) {
      console.error("Failed to load reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const loadAverageRating = async () => {
    try {
      const res = await getPropertyAverageRating(propertyId);
      setAverageRating(res.data);
    } catch (err) {
      console.error("Failed to load average rating", err);
    }
  };

  useEffect(() => {
    loadReviews();
    loadAverageRating();
  }, [propertyId, page]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const reviewData = {
        propertyId,
        rating,
        comment
      };

      await createReview(reviewData);
      setSuccess("Review submitted successfully!");
      setShowReviewForm(false);
      setRating(5);
      setComment("");
      
      // Reload reviews and average rating
      setPage(1);
      loadReviews();
      loadAverageRating();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: 'flex', gap: '2px' }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span 
            key={star} 
            style={{ 
              fontSize: '20px',
              color: star <= rating ? '#FBBF24' : '#E5E7EB'
            }}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  if (loading && reviews.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 20px' }}>
        <div style={{ fontSize: '24px', marginBottom: '16px' }}>⏳</div>
        <div style={{ fontSize: '16px', color: '#626C71' }}>Loading reviews...</div>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '40px' }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '24px',
          fontWeight: 700,
          color: '#13343B'
        }}>
          Reviews
        </h2>
        
        <button
          onClick={() => setShowReviewForm(!showReviewForm)}
          style={{
            background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '50px',
            border: 'none',
            fontSize: '14px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)'
          }}
        >
          {showReviewForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>
      
      {/* Average Rating */}
      {averageRating.totalReviews > 0 && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(6, 182, 212, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
              color: 'white',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              minWidth: '100px'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 800 }}>
                {averageRating.averageRating.toFixed(1)}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>
                out of 5
              </div>
            </div>
            
            <div>
              <div style={{ marginBottom: '8px' }}>
                {renderStars(averageRating.averageRating)}
              </div>
              <div style={{ fontSize: '16px', color: '#626C71' }}>
                Based on {averageRating.totalReviews} {averageRating.totalReviews === 1 ? 'review' : 'reviews'}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Review Form */}
      {showReviewForm && (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(6, 182, 212, 0.1)'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '20px'
          }}>
            Write Your Review
          </h3>
          
          {error && (
            <div style={{
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#B91C1C',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}
          
          {success && (
            <div style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              color: '#166534',
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              {success}
            </div>
          )}
          
          <form onSubmit={handleReviewSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#13343B',
                fontWeight: 600,
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                Rating
              </label>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '2px' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      style={{
                        fontSize: '28px',
                        color: star <= rating ? '#FBBF24' : '#E5E7EB',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#13343B' }}>
                  {rating} Star{rating !== 1 ? 's' : ''}
                </div>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                color: '#13343B',
                fontWeight: 600,
                marginBottom: '8px',
                fontSize: '14px'
              }}>
                Your Review
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                required
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  border: '2px solid rgba(6, 182, 212, 0.2)',
                  borderRadius: '10px',
                  fontSize: '14px',
                  fontFamily: 'inherit'
                }}
                placeholder="Share your experience with this property..."
              />
            </div>
            
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 15px rgba(6, 182, 212, 0.3)',
                opacity: submitting ? 0.7 : 1
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
        </div>
      )}
      
      {/* Reviews List */}
      {reviews.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {reviews.map((review) => (
            <div
              key={review._id}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
                border: '1px solid rgba(6, 182, 212, 0.1)'
              }}
            >
              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #06B6D4 0%, #8B5CF6 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 700
                }}>
                  {review.user.profile?.avatar ? (
                    <img
                      src={review.user.profile.avatar}
                      alt={review.user.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '50%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    review.user.name.charAt(0)
                  )}
                </div>
                
                <div style={{ flex: 1 }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px'
                  }}>
                    <div style={{
                      fontSize: '16px',
                      fontWeight: 700,
                      color: '#13343B'
                    }}>
                      {review.user.name}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      color: '#626C71'
                    }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '12px' }}>
                    {renderStars(review.rating)}
                  </div>
                  
                  <div style={{
                    fontSize: '14px',
                    lineHeight: '1.6',
                    color: '#626C71'
                  }}>
                    {review.comment}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {hasMore && (
            <button
              onClick={() => setPage(page + 1)}
              style={{
                background: 'rgba(6, 182, 212, 0.1)',
                color: '#06B6D4',
                padding: '12px 24px',
                borderRadius: '50px',
                border: '1px solid rgba(6, 182, 212, 0.2)',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                alignSelf: 'center'
              }}
            >
              Load More Reviews
            </button>
          )}
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          padding: '40px 20px',
          background: 'white',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(6, 182, 212, 0.1)'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
          <h3 style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#13343B',
            marginBottom: '8px'
          }}>
            No Reviews Yet
          </h3>
          <p style={{
            fontSize: '14px',
            color: '#626C71',
            marginBottom: '20px'
          }}>
            Be the first to review this property!
          </p>
        </div>
      )}
    </div>
  );
}