import { objectType } from 'nexus';
import { NexusGenObjects } from '../../nexus-typegen';

export const User = objectType({
  name: 'User',
  definition(t) {
    t.nonNull.int('id');
    t.nonNull.string('name');
    t.nonNull.string('email');
    t.nonNull.list.nonNull.field('posts', {
      type: 'Post',
      resolve: async (parent, args, context) => {
        const posts = await context.prisma.user
          .findUnique({ where: { id: parent.id } })
          .posts();
        return posts as NexusGenObjects['Post'][];
      }
    });
  }
});
