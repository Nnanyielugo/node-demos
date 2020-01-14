import { model } from 'mongoose';
import moment from 'moment';
const Rotation = model('rotation');

export const save = (req, res) => {
  try {
    const { body } = req;
    const rotation = new Rotation({
      ...body
    })

    console.log('rotation', rotation);

    rotation.activeTeam = rotation.team[0]._id;
    const activeTeam = composeActiveTeam(
      rotation.team[0]._id,
      rotation.team,
      rotation.rotationInterval,
      rotation.rotationFrequency
    )
    console.log('active team', activeTeam)

    res.send(200)
  } catch(err) {
    res.status(400).send(err.message)
  }
}

function composeActiveTeam(id, teams, interval, frequency) {
  console.log('interval et freq', interval, frequency)
  const activeTeam = teams.find(team => team._id === id);
  activeTeam.rotationStartTime = new Date();
  activeTeam.rotationEndTime = moment().add(interval, frequency);

  return activeTeam;
}
