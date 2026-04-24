import { useState, type ChangeEvent } from "react";
import type { AddressFormData } from "../types/address";
import { MapPin, X } from "lucide-react";

const EMPTY_FORM: AddressFormData = {
  fullName: "",
  address: "",
  city: "",
  pincode: "",
  mobileNumber: "",
};

type Props = {
  initial?: Partial<AddressFormData>;
  onSubmit: (data: AddressFormData, makePrimary: boolean) => Promise<void>;
  onCancel: () => void;
  submitLabel?: string;
  showPrimaryToggle?: boolean;
  loading?: boolean;
};

export const AddressForm = ({
  initial = {},
  onSubmit,
  onCancel,
  submitLabel = "Save Address",
  showPrimaryToggle = true,
  loading = false,
}: Props) => {
  const [form, setForm] = useState<AddressFormData>({ ...EMPTY_FORM, ...initial });
  const [makePrimary, setMakePrimary] = useState(false);
  const [errors, setErrors] = useState<Partial<AddressFormData>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: "" }));
  };

  const validate = (): boolean => {
    const errs: Partial<AddressFormData> = {};
    if (!form.fullName.trim())               errs.fullName = "Required";
    if (!form.address.trim())                errs.address = "Required";
    if (!form.city.trim())                   errs.city = "Required";
    if (!/^\d{6}$/.test(form.pincode))       errs.pincode = "6 digits";
    if (!/^\d{10}$/.test(form.mobileNumber)) errs.mobileNumber = "10 digits";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    await onSubmit(form, makePrimary);
  };

  const field = (
    label: string,
    name: keyof AddressFormData,
    opts?: { placeholder?: string; maxLength?: number; type?: string; textarea?: boolean }
  ) => (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5 uppercase tracking-wider">
        {label}
      </label>
      {opts?.textarea ? (
        <textarea
          name={name}
          value={form[name]}
          onChange={handleChange}
          rows={2}
          placeholder={opts.placeholder}
          className={`w-full bg-white/[0.04] border rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 resize-none transition ${
            errors[name] ? "border-red-500/60" : "border-white/10"
          }`}
        />
      ) : (
        <input
          type={opts?.type ?? "text"}
          name={name}
          value={form[name]}
          onChange={handleChange}
          maxLength={opts?.maxLength}
          placeholder={opts?.placeholder}
          className={`w-full bg-white/[0.04] border rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/20 transition ${
            errors[name] ? "border-red-500/60" : "border-white/10"
          }`}
        />
      )}
      {errors[name] && (
        <p className="text-red-400 text-xs mt-1">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="bg-white/[0.03] border border-white/10 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-2 text-primary">
          <MapPin size={15} />
          <span className="text-sm font-semibold">Address Details</span>
        </div>
        <button
          onClick={onCancel}
          className="text-gray-500 hover:text-gray-300 transition"
        >
          <X size={16} />
        </button>
      </div>

      {field("Full Name", "fullName", { placeholder: "Recipient's full name" })}
      {field("Street Address", "address", {
        placeholder: "House no., street, area...",
        textarea: true,
      })}

      <div className="grid grid-cols-2 gap-3">
        {field("City", "city", { placeholder: "City" })}
        {field("Pincode", "pincode", { placeholder: "6 digits", maxLength: 6, type: "tel" })}
      </div>

      {field("Mobile Number", "mobileNumber", {
        placeholder: "10-digit number",
        maxLength: 10,
        type: "tel",
      })}

      {showPrimaryToggle && (
        <label className="flex items-center gap-2.5 cursor-pointer group">
          <div
            onClick={() => setMakePrimary((p) => !p)}
            className={`w-4 h-4 rounded border flex items-center justify-center transition ${
              makePrimary
                ? "bg-primary border-primary"
                : "border-white/20 group-hover:border-primary/50"
            }`}
          >
            {makePrimary && (
              <svg viewBox="0 0 10 8" className="w-2.5 h-2.5 fill-black">
                <path d="M1 4l2.5 2.5L9 1" stroke="black" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            )}
          </div>
          <span className="text-xs text-gray-400 group-hover:text-gray-300 transition">
            Set as default address
          </span>
        </label>
      )}

      <div className="flex gap-2 pt-1">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg border border-white/10 text-gray-400 hover:text-gray-200 hover:border-white/20 text-sm font-medium transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex-1 py-2.5 rounded-lg bg-primary text-black text-sm font-bold hover:bg-[#68a500] hover:shadow-[0_0_16px_#76b900] disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            submitLabel
          )}
        </button>
      </div>
    </div>
  );
};