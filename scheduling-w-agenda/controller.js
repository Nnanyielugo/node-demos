import { model } from 'mongoose';
import moment from 'moment';
const Rotation = model('rotation');

export const save = async (req, res, next) => {
  try {
    const { body } = req;
    const rotation = new Rotation({
      ...body
    })

    const activeTeam = composeActiveTeam(
      rotation.team[0]._id,
      rotation.team,
      rotation.rotationInterval,
      rotation.rotationFrequency
    );
    rotation.activeTeam = activeTeam._id;
    await rotation.save();
    res.status(204).send(rotation);
  } catch(err) {
    res.status(400).send(err.message);
  }
}

export const update = async (req, res, next) => {
  try {
    const { params: { id } } = req;
    if (!id) throw new Error("id is required");
    const rotation = await Rotation
      .findByIdAndUpdate(id, req.body, { new: true })
      .exec();
    if (!rotation) throw new Error("id not found");
    res.status(204).send(rotation);
  } catch(err) {
    res.status(400).send(err.message);
  }
}

function composeActiveTeam(id, teams, interval, frequency) {
  const activeTeam = teams.find(team => team._id === id);
  activeTeam.rotationStartTime = new Date();
  activeTeam.rotationEndTime = moment().add(interval, frequency);

  return activeTeam;
}
