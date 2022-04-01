import { userRepository } from "../repositories/userRepository.js";
import { followRepository } from '../repositories/followRepository.js';
import bcrypt from "bcrypt";

export async function createUser(req, res) {
  const newUser = req.body;
  const passwordHash = bcrypt.hashSync(newUser.password, 10);

  try {
    const user = await userRepository.getUserByEmail(newUser.email);

    if (user.rowCount !== 0) {
      return res.sendStatus(409);
    }

    await userRepository.createUser({ ...newUser, passwordHash });

    return res.sendStatus(201);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
}

export async function searchUser(req, res) {
  const { name } = req.query;
  const { user } = res.locals;
  if (!name) return;
  try {
    const {rows: usersFound} = await userRepository.getUserByName(name);
    const {rows: followedUsers} = await followRepository.getFollows(user.id)
    
    usersFound.forEach((user, i) => {
      followedUsers.forEach((followedUser) => {
          if(followedUser.followedId === user.id){
            usersFound[i] =  {...user, isFollowingLoggedUser: true}
          }
      })
      if(!usersFound[i].isFollowingLoggedUser){
        usersFound[i] =  {...user, isFollowingLoggedUser: false}
      }
  })
    usersFound.sort((arr)=> orderByFollow(arr))
    res.send(usersFound);
  } catch (error) {
    res.status(500).send(error);
  }
}

function orderByFollow(arr) {
  if(arr.isFollowingLoggedUser === true){
    return -1
  }else{
    return 1
  }
}