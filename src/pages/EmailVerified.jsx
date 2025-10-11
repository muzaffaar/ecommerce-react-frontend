export default function EmailVerified() {
  const params = new URLSearchParams(window.location.search);
  const status = params.get("status");

  return (
    <div className="container py-5 text-center">
      <div
        className={`alert ${
          status === "success" ? "alert-success" : "alert-info"
        }`}
      >
        {status === "success"
          ? "✅ Your email has been successfully verified!"
          : "📬 Your email was already verified."}
      </div>
      <a href="/" className="btn btn-primary mt-3">
        Continue Shopping
      </a>
    </div>
  );
}
