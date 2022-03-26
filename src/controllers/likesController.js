import { userRepository } from '../repositories/userRepository.js';
import { likeRepositoy } from '../repositories/likeRepository.js';

export async function toggleLike(req, res) {
    const { like, postId } = req.body;

    try {
        const { user: userLocals } = res.locals;

        const { rows: userRows } = await userRepository.getUserById(
            userLocals?.id
        );

        if (userRows.length === 0) {
            return res.status(404).send('User not found');
        }

        const [user] = userRows;

        if (!like) {
            await likeRepositoy.insertLike(user?.id, postId);
        } else {
            await likeRepositoy.removeLike(user?.id, postId);
        }

        return res.status(200).send(!req.body.like);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

export async function totalLike(req, res) {
    const { postId } = req.params;

    try {
        const { rows } = await likeRepositoy.totalLike(postId);

        if (rows.length === 0) {
            return res.status(404).send('Post id not found');
        }

        res.status(200).send(rows[0].total);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

export async function checkLikeUser(req, res) {
    const { postId } = req.params;

    try {
        const { user: userLocals } = res.locals;

        const { rows: userRows } = await userRepository.getUserById(
            userLocals?.id
        );

        if (userRows.length === 0) {
            return res.status(404).send('User not found');
        }

        const [user] = userRows;

        const { rows: likeRows } = await likeRepositoy.checkLike(
            user?.id,
            postId
        );

        if (likeRows.length === 0) {
            return res.status(200).send(false);
        }

        return res.status(200).send(true);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}

export async function getTwoNamesThatLiked(req, res) {
    const { postId } = req.params;
    const { user: userLocals } = res.locals;

    try {
        const { rows: checkLikeRows } = await likeRepositoy.checkLike(
            userLocals?.id,
            postId
        );
        let userLocalsLike = false;

        if (checkLikeRows.length > 0) {
            userLocalsLike = true;
        }

        const { rows: likeRows } = await likeRepositoy.getTwoNamesThatLiked(
            userLocals?.id,
            postId
        );

        const { rows: totalLikes } = await likeRepositoy.totalLike(postId);

        const [likes] = totalLikes;

        likeRows.push({ userLiked: userLocalsLike, likes });

        res.status(200).send(likeRows);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
}
