
const mongoose = require('mongoose');

const STAGES = [
  'Applied',
  'Screening',
  'Interview',
  'Offer',
  'Hired',
  'Rejected',
];

const candidateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    experience: {
      type: Number,
      default: 0,
      min: 0,
    },
    resumeUrl: {
      type: String,
      trim: true,
      default: '',
    },
    notes: {
      type: String,
      default: '',
    },
    stage: {
      type: String,
      enum: STAGES,
      default: 'Applied',
    },
    stageHistory: [
      {
        stage: {
          type: String,
          enum: STAGES,
          required: true,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

// New candidate ki initial stage history
candidateSchema.pre('save', function () {
  if (this.isNew) {
    this.stageHistory.push({
      stage: this.stage,
    });
  }
});

const Candidate = mongoose.model('Candidate', candidateSchema);
module.exports = { Candidate, STAGES };
