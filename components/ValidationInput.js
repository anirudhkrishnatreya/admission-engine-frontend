export default function ValidationInput({
  label,
  name,
  value,
  onChange,
  error,
  type = "text"
}) {
  return (
    <div className="mb-5">
      <label className="block mb-1 font-medium">
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full p-3 border rounded-lg ${
          error ? "border-red-500" : "border-gray-300"
        }`}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">
          {error}
        </p>
      )}
    </div>
  );
}