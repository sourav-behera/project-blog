import { arg, extendType, nonNull, objectType, stringArg } from 'nexus';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import { APP_SECRET } from '../util/auth';
export const AuthPaylaod = objectType({
  name: 'AuthPayload',
  definition(t) {
    t.nonNull.string('token');
    t.nonNull.field('user', {
      type: 'User'
    });
  }
});

export const AuthMutation = extendType({
  type: 'Mutation',
  definition(t) {
    // sign-in mutation
    t.nonNull.field('signin', {
      type: 'AuthPayload',
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      resolve: async (parent, args, context) => {
        const { email } = args;
        // get the user associated with the email, if registered.
        const user = await context.prisma.user.findUnique({
          where: { email: email }
        });
        // if user not registered on args.email, then throw an error
        if (!user) {
          throw new Error('No account registered under the provided email.');
        }
        // if user found, validate the password
        const valid = await bcrypt.compare(args.password, user.password);
        // if invalid password, throw error
        if (!valid) {
          throw new Error('Invalid credentials. Wrong email or password');
        }
        // if valid password, then sign in and return token(jwt signature) as a ticket of sign in
        const token = jwt.sign({ userId: user.id }, APP_SECRET);
        return {
          token,
          user
        };
      }
    });

    // sign-up mutation
    t.nonNull.field('signup', {
      type: 'AuthPayload',
      args: {
        name: nonNull(stringArg()),
        email: nonNull(stringArg()),
        password: nonNull(stringArg())
      },
      resolve: async (parent, args, context) => {
        const { name, email, password } = args;
        // check if account already exists.
        let user = await context.prisma.user.findUnique({
          where: { email: email }
        });
        // if account exisits throw error
        if (user) {
          throw new Error('An account already exisits on this email');
        }
        // create one if doesn't exist
        let hash = await bcrypt.hash(password, 10);
        user = await context.prisma.user.create({
          data: {
            name: name,
            email: email,
            password: hash
          }
        });
        let token = jwt.sign({ userId: user.id }, APP_SECRET);
        return {
          token,
          user
        };
      }
    });
  }
});
