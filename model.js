import { Schema, model } from 'mongoose';

const subSchema = new Schema({
  rotationStartTime: String,
  rotationEndTime: String,
  teamMember: [
    {
        startTime: String,
        endTime: String,
        timezone: String,
        member: String,
    }
  ],
});

const mainSchema = new Schema({
  activeTeam: String,
  team: [subSchema],
  createdAt: { type: Date, default: Date.now },
});

export const rotation = model('rotation', mainSchema);