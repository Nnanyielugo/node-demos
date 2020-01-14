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
  rotationFrequency: String,
  rotationInterval: Number,
  team: [subSchema],
  createdAt: { type: Date, default: Date.now },
});

const rotation = model('rotation', mainSchema);

export default rotation;