import { useState } from "react";
import PropTypes from "prop-types";
import api from "../../services/api";
import { FiStar, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

export default function AddReviewModal({ product, onClose, onReviewAdded }) {
  const { t } = useTranslation();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({});

    try {
      const formData = new FormData();
      console.log("Submitting review for product ID:", product.product_id);
      formData.append("product_id", product.product_id);
      formData.append("rating", rating);
      formData.append("comment", comment);
      images.forEach((img) => formData.append("images[]", img));

      const res = await api.post(`/en/v1/reviews`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage({ type: "success", text: res.data.message || t("ordercard.review_submitted") });
      onReviewAdded && onReviewAdded();

      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setMessage({
        type: "error",
        text: err.response?.data?.message || t("ordercard.review_failed"),
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="review-modal-overlay"
      onClick={(e) => e.target.classList.contains("review-modal-overlay") && onClose()}
    >
      <div className="review-modal">
        <div className="review-modal-header">
          <h5>
            {t("ordercard.leave_review")} – {product.product.name}
          </h5>
          <button className="close-btn" onClick={onClose}>
            <FiX size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="review-modal-body">
            <div className="stars mb-3">
              {[1, 2, 3, 4, 5].map((num) => (
                <FiStar
                  key={num}
                  size={28}
                  onClick={() => setRating(num)}
                  style={{
                    cursor: "pointer",
                    color: num <= rating ? "#f5c518" : "#ccc",
                  }}
                />
              ))}
            </div>

            <textarea
              className="form-control mb-3"
              placeholder={t("ordercard.comment")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />

            <input
              type="file"
              className="form-control mb-3"
              multiple
              accept="image/*"
              onChange={(e) => setImages(Array.from(e.target.files))}
            />

            {message.text && (
              <div
                className={`alert ${
                  message.type === "error" ? "alert-danger" : "alert-success"
                } py-2`}
              >
                {message.text}
              </div>
            )}
          </div>

          <div className="review-modal-footer">
            <button type="button" className="btn btn-light" onClick={onClose}>
              {t("ordercard.cancel")}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
              style={{ minWidth: "120px" }}
            >
              {loading ? t("ordercard.submitting") || "Submitting..." : t("ordercard.submit")}
            </button>
          </div>
        </form>
      </div>

      {/* Inline CSS for layout fix */}
      <style jsx>{`
        .review-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 9999;
        }
        .review-modal {
          background: #fff;
          width: 90%;
          max-width: 480px;
          border-radius: 12px;
          box-shadow: 0 6px 25px rgba(0, 0, 0, 0.2);
          animation: fadeIn 0.25s ease;
        }
        .review-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid #eee;
          padding: 1rem 1.2rem;
        }
        .review-modal-body {
          padding: 1.2rem;
        }
        .review-modal-footer {
          padding: 0.75rem 1.2rem;
          border-top: 1px solid #eee;
          display: flex;
          justify-content: flex-end;
          gap: 10px;
        }
        .close-btn {
          border: none;
          background: none;
          cursor: pointer;
          color: #555;
        }
        .stars svg:hover {
          transform: scale(1.1);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

AddReviewModal.propTypes = {
  product: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  onReviewAdded: PropTypes.func,
};
