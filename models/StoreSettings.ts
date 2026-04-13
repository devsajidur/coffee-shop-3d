import mongoose, { Schema, model, models } from "mongoose";

const StoreSettingsSchema = new Schema(
  {
    singletonKey: { type: String, default: "blackstone", unique: true },
    autoPuzzleDiscountEnabled: { type: Boolean, default: false },
    puzzleWinnerPercent: { type: Number, default: 10 },
    /** Home delivery geofence (km), editable from admin settings. */
    deliveryRadiusKm: { type: Number, default: 3, min: 0.5, max: 50 },

    // ── Emergency / Scheduled Closure ──────────────────────────────────────
    /** Hard toggle: if true the entire system (ordering + booking) is disabled. */
    isEmergencyClosed: { type: Boolean, default: false },
    /** Scheduled closure window start (UTC stored, displayed in Asia/Dhaka). */
    closedFrom: { type: Date, default: null },
    /** Scheduled closure window end (UTC stored, displayed in Asia/Dhaka). */
    closedUntil: { type: Date, default: null },
    /** Human-readable reason shown to customers. */
    closureReason: { type: String, default: "" },
  },
  { timestamps: true }
);

const StoreSettings =
  models.StoreSettings || model("StoreSettings", StoreSettingsSchema);
export default StoreSettings;
