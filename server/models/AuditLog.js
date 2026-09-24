const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    actorRole: { type: String, default: 'SYSTEM' },
    action: { type: String, required: true }, // e.g., 'PROVIDER_VERIFIED', 'JOB_REASSIGNED', 'DISPUTE_REFUNDED'
    entity: { type: String, required: true }, // e.g., 'ProviderProfile', 'Booking', 'Dispute'
    entityId: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, default: '127.0.0.1' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AuditLog', auditLogSchema);
