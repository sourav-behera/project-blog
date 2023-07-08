import { extendType, idArg, nonNull, objectType, stringArg } from 'nexus';
export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('title');
    t.nonNull.string('content');
    t.nonNull.string('description');
  }
});

export const LinkQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('feed', {
      type: 'Post',
      resolve(parent, args, context) {
        let posts = context.prisma.post.findMany();
        return posts;
      }
    });
  }
});

export const LinkMutation = extendType({
  type: 'Mutation',
  definition(t) {
    // createPost mutation
    t.nonNull.field('createPost', {
      type: 'Post',
      args: {
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        content: nonNull(stringArg())
      },
      resolve: async (parent, args, context) => {
        const { title, description, content } = args;
        let newPost = await context.prisma.post.create({
          data: {
            title,
            description,
            content
          }
        });
        return newPost;
      }
    });

    // deletePost mutation
    t.nonNull.field('deletePost', {
      type: 'Post',
      args: {
        id: nonNull(idArg())
      },
      resolve: async (parent, args, context) => {
        const { id } = args;
        let post = await context.prisma.post.delete({
          where: { id: parseInt(id) }
        });
        return post;
      }
    });

    // updatePost
    t.nonNull.field('updatePost', {
      type: 'Post',
      args: {
        id: nonNull(idArg()),
        title: nonNull(stringArg()),
        description: nonNull(stringArg()),
        content: nonNull(stringArg())
      },
      resolve: async (parent, args, context) => {
        const { id, title, description, content } = args;
        let post = context.prisma.post.update({
          where: {
            id: parseInt(id)
          },
          data: {
            title,
            description,
            content
          }
        });
        return post;
      }
    });
  }
});
