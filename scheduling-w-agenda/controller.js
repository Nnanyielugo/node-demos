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
    rotation.activeTeamId = activeTeam._id;
    rotation.activeTeam = activeTeam;
    rotation.estimatedSwitchTime = activeTeam.rotationEndTime;
    await rotation.save();
    res.status(201).send(rotation);
  } catch(err) {
    next(err)
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
    res.status(201).send(rotation);
  } catch(err) {
    res.status(400).send(err.message);
  }
}

function composeActiveTeam(id, teams, interval, frequency, date = new Date(), incrementBy = date) {
  const activeTeam = teams.find(team => team._id === id);
  activeTeam.rotationStartTime = date;
  activeTeam.rotationEndTime = moment(date).add(interval, frequency);

  return activeTeam;
}

export async function switchActiveTeam() {
  try {
    const rotations = await Rotation.find();
    rotations.forEach(async rotation => {
      let {
        estimatedSwitchTime, activeTeamId, _id,
        team, rotationInterval, rotationFrequency,
      } = rotation;

      const currentDate = new Date();
      if (moment(estimatedSwitchTime).isSameOrBefore(currentDate)) {
        const activeTeamIndex = rotation.team.findIndex(team => team._id.toString() === activeTeamId.toString());
        let nextTeamIndex = activeTeamIndex + 1;
        if (!rotation.team[nextTeamIndex]) {
          nextTeamIndex = 0;
        }

        const nextActiveTeamId = rotation.team[nextTeamIndex]._id;
        const nextActiveTeam = composeActiveTeam(
          nextActiveTeamId,
          team,
          rotationInterval,
          rotationFrequency,
          rotation.estimatedSwitchTime
        );
        team.splice(nextTeamIndex, 1, nextActiveTeam);
        team.forEach(indTeam => {
          if (indTeam._id.toString() !== nextActiveTeam._id.toString()) {
            indTeam.rotationStartTime = null;
            indTeam.rotationEndTime = null;
          }
        })
        await Rotation
          .findByIdAndUpdate(_id, {
            activeTeam: nextActiveTeam,
            activeTeamId: nextActiveTeam._id,
            team,
            estimatedSwitchTime: nextActiveTeam.rotationEndTime
          })
          .exec();
      }
      
    })
  } catch (err) {
    throw err;
  }
}
