export async function createPost(req, res) {
  const { url, description } = req.body;
  const user = res.locals.user;
}
