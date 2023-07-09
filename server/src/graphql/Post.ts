import { extendType, idArg, nonNull, objectType, stringArg } from 'nexus';
import { NexusGenObjects } from '../../nexus-typegen';
export const Post = objectType({
  name: 'Post',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('title');
    t.nonNull.string('content');
    t.nonNull.string('description');
    t.nonNull.field('postedBy', {
      type: 'User',
      resolve: async (parent, args, context) => {
        const user = await context.prisma.post
          .findUnique({ where: { id: parent.id } })
          .postedBy();
        return user as NexusGenObjects['User'];
      }
    });
  }
});

export const LinkQuery = extendType({
  type: 'Query',
  definition(t) {
    t.nonNull.list.nonNull.field('feed', {
      type: 'Post',
      resolve(parent, args, context) {
        const posts = context.prisma.post.findMany();
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
        const { userId } = context;
        if (!userId) {
          throw new Error('You must sign in before you post');
        }
        const newPost = await context.prisma.post.create({
          data: {
            title,
            description,
            content,
            postedBy: { connect: { id: userId } }
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
        const post = await context.prisma.post.delete({
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
        const post = context.prisma.post.update({
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
