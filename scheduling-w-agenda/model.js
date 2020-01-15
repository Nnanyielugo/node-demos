import { Schema, model } from 'mongoose';

const teamSchema = new Schema({
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
  activeTeamId: String,
  activeTeam: teamSchema,
  estimatedSwitchTime: String,
  rotationFrequency: String,
  rotationInterval: Number,
  team: [teamSchema],
  createdAt: { type: Date, default: Date.now },
});

const rotation = model('rotation', mainSchema);

export default rotation;