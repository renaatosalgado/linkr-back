import { followRepository } from '../repositories/followRepository.js';

export async function toggleFollow(req, res) {
    const { followId } = req.params;
    const { user } = res.locals;
    try {
        const followCount = await followRepository.isFollowing(
            followId,
            user.id
        );
        if (followCount.rowCount === 0) {
            await followRepository.followUser(followId, user.id);
        } else {
            await followRepository.unFollowUser(followId, user.id);
        }
        return res.sendStatus(200);
    } catch (error) {
        return res.status(500);
    }
}

export async function checkIfFollow(req, res) {
    const { followId } = req.params;
    const { user } = res.locals;
    try {
        const followCount = await followRepository.isFollowing(
            followId,
            user.id
        );
        return res.status(200).send(followCount.rowCount.toString(10));
    } catch (error) {
        return res.status(500);
    }
}

export async function getFollows(req, res) {
    const { id } = res.locals.user;
    const follows = [];
    try {
        const { rows } = await followRepository.getFollows(id);
        rows.length > 0 &&
            rows.map(({ followedId }) => {
                follows.push(followedId);
            });
        return res.send(follows).status(200);
    } catch (error) {
        return res.status(500);
    }
}
