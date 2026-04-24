import { MapPin, Pencil, Trash2, Star } from "lucide-react";
import type { Address } from "../types/address";

type Mode = "manage" | "select";

type Props = {
  address: Address;
  mode?: Mode;
  selected?: boolean;
  onSelect?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onSetPrimary?: () => void;
  deleting?: boolean;
};

export const AddressCard = ({
  address,
  mode = "manage",
  selected = false,
  onSelect,
  onEdit,
  onDelete,
  onSetPrimary,
  deleting = false,
}: Props) => {
  const isSelect = mode === "select";

  return (
    <div
      onClick={isSelect ? onSelect : undefined}
      className={`relative rounded-xl border p-4 transition-all duration-200 ${
        isSelect ? "cursor-pointer" : ""
      } ${
        selected
          ? "border-primary/60 bg-primary/[0.06] shadow-[0_0_12px_rgba(118,185,0,0.1)]"
          : isSelect
            ? "border-white/10 bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.05]"
            : "border-white/10 bg-white/[0.03]"
      }`}
    >
      {/* Primary badge */}
      {address.isPrimary && (
        <div className="absolute top-3 right-3 flex items-center gap-1 bg-primary/15 border border-primary/30 rounded-md px-1.5 py-0.5">
          <Star size={9} className="text-primary fill-primary" />
          <span className="text-[9px] font-semibold text-primary uppercase tracking-wider">
            Default
          </span>
        </div>
      )}

      {/* Selection indicator */}
      {isSelect && (
        <div
          className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 flex items-center justify-center transition ${
            selected ? "border-primary bg-primary" : "border-white/30"
          }`}
        >
          {selected && (
            <div className="w-1.5 h-1.5 rounded-full bg-black" />
          )}
        </div>
      )}

      {/* Content */}
      <div className="flex items-start gap-3 pr-8">
        <div className={`mt-0.5 ${selected ? "text-primary" : "text-gray-600"}`}>
          <MapPin size={14} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold text-gray-100 mb-0.5">
            {address.fullName}
          </p>
          <p className="text-xs text-gray-400 leading-relaxed">
            {address.address}
          </p>
          <p className="text-xs text-gray-400">
            {address.city} — {address.pincode}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            +91 {address.mobileNumber}
          </p>
        </div>
      </div>

      {/* Manage actions */}
      {mode === "manage" && (
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-white/[0.06]">
          {!address.isPrimary && (
            <button
              onClick={onSetPrimary}
              className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-primary border border-white/10 hover:border-primary/30 px-2 py-1 rounded-md transition"
            >
              <Star size={9} />
              Set default
            </button>
          )}
          <button
            onClick={onEdit}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-200 border border-white/10 hover:border-white/20 px-2 py-1 rounded-md transition ml-auto"
          >
            <Pencil size={9} />
            Edit
          </button>
          <button
            onClick={onDelete}
            disabled={deleting}
            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-red-400 border border-white/10 hover:border-red-500/30 px-2 py-1 rounded-md transition disabled:opacity-40"
          >
            <Trash2 size={9} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};