import { postsRepository } from '../repositories/postsRepository.js';
import urlMetadata from 'url-metadata';
import { userRepository } from '../repositories/userRepository.js';
import { likeRepositoy } from '../repositories/likeRepository.js';
import pkg from 'sqlstring';

export async function createPost(req, res) {
    const { url, description } = req.body;
    const user = res.locals.user;
    const descriptionWords = description.split(' ');

    let hashtags = [];
    let urlTitle = '';
    let urlDescription = '';
    let urlImage = '';

    for (let i = 0; i < descriptionWords.length; i++) {
        if (
            descriptionWords[i][0] === '#' &&
            !hashtags.includes(descriptionWords[i])
        ) {
            hashtags.push(descriptionWords[i]);
        }
    }

    try {
        const metadata = await urlMetadata(url);
        if (!metadata.image) {
            urlImage =
                'https://st3.depositphotos.com/1322515/35964/v/450/depositphotos_359648638-stock-illustration-image-available-icon.jpg';
        } else {
            urlImage = metadata.image;
        }
        urlTitle = metadata.title;

        for (let i = 0; i < metadata.description.length; i++) {
            if (metadata.description[i] === "'") {
                urlDescription += '`';
            } else {
                urlDescription += metadata.description[i];
            }
        }

        const {
            rows: [postId],
        } = await postsRepository.publish(
            description,
            url,
            user.id,
            urlTitle,
            urlDescription,
            urlImage
        );

        addHashtagsPost(hashtags, postId.id);

        res.sendStatus(201);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function listPosts(req, res) {
    const { user } = res.locals;
    try {
        const {rows: posts} = await postsRepository.listAll(user.id);
        // const {rows: reposts} = await postsRepository.getRePosts(user.id)

        posts.map((post) => {
            let description = ``;
            for (let i = 0; i < post.urlDescription.length; i++) {
                if (post.urlDescription[i] === '`') {
                    description += "'";
                } else {
                    description += post.urlDescription[i];
                }
            }
            post.urlDescription = description;
        });
        // reposts.map((post) => {
        //     let description = ``;
        //     for (let i = 0; i < post.urlDescription.length; i++) {
        //         if (post.urlDescription[i] === '`') {
        //             description += "'";
        //         } else {
        //             description += post.urlDescription[i];
        //         }
        //     }
        //     post.urlDescription = description;
        // });

        // const body = { 
        //                 posts,
        //                 reposts
        //             }

        res.status(200).send(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function listUserPosts(req, res) {
    const { id: userId } = req.params;
    try {
        const { rows: posts } = await postsRepository.userPosts(userId);
        const {
            rows: [user],
        } = await userRepository.getUserById(userId);
        const authorName = user.name;

        res.status(200).send({ posts: [...posts], authorName });
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function getHashtagPost(req, res) {
    const { hashtag } = req.params;
    try {
        const result = await postsRepository.listHashtag(hashtag);

        res.status(200).send(result.rows);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function deletePost(req, res) {
    const { id } = req.params;

    try {
        await likeRepositoy.deleteLikes(id);
        await postsRepository.deletePostsTrends(id);
        await postsRepository.deletePost(id);

        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

export async function editPost(req, res) {
    const { id } = req.params;
    const { description } = req.body;
    const descriptionWords = description.split(' ');
    let hashtags = [];
    for (let i = 0; i < descriptionWords.length; i++) {
        if (
            descriptionWords[i][0] === '#' &&
            !hashtags.includes(descriptionWords[i])
        ) {
            hashtags.push(descriptionWords[i]);
        }
    }
    try {
        await postsRepository.deletePostsTrends(id);
        verifyHashtags(hashtags, id);
        await postsRepository.editPost(description, id);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
}

async function verifyHashtags(hashtags, postId) {
    const trends = await postsRepository.getTrends();

    for (let i = 0; i < hashtags.length; i++) {
        for (let j = 0; j < trends.rows.length; j++) {
            if (hashtags[i] === trends.rows[j].name) {
                await postsRepository.insertPostsTrend(
                    trends.rows[j].id,
                    postId
                );
                break;
            }
            if (j === trends.rows.length - 1) {
                const hashtagId = await postsRepository.insertTrendsHashtag(
                    hashtags[i]
                );

                await postsRepository.insertPostsTrend(
                    hashtagId.rows[0].id,
                    postId
                );
            }
        }
    }
}

async function addHashtagsPost(hashtags, postId) {
    try {
        verifyHashtags(hashtags, postId);
    } catch (error) {
        console.log(error);
    }
}

export async function rePost(req, res) {
    const { user } = res.locals;
    const { id } = req.params;

    try {
        await postsRepository.rePost(user.id, id);
        res.sendStatus(200);
    } catch (error) {
        console.log(error);
        res.sendStatus(500);
    }
}
