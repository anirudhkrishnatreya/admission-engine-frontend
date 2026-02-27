export default function LoadingButton({
  loading,
  children,
  ...props
}) {
  return (
    <button
      {...props}
      disabled={loading}
      className={`px-6 py-3 rounded-xl text-white ${
        loading
          ? "bg-gray-400 cursor-not-allowed"
          : "bg-primary hover:opacity-90"
      }`}
    >
      {loading ? "Processing..." : children}
    </button>
  );
}