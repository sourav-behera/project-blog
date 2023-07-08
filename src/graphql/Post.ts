import { extendType, nonNull, objectType, queryType, stringArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";
export const Post = objectType({
    name : "Post", 
    definition(t){
        t.nonNull.int("id");
        t.nonNull.string("title");
        t.nonNull.string("content");
        t.nonNull.string("description");
    }
})

export const LinkQuery = extendType({
    type : "Query",
    definition(t) {
        t.nonNull.list.nonNull.field("feed", {
            type : "Post",
            resolve(parent, args, context){
                console.log(context.prisma.post);
                let posts = context.prisma.post.findMany();
                return posts;
            }
        })
    },
})

export const LinkMutation = extendType({
    type : "Mutation",
    definition(t){

        // createPost mutation
        t.nonNull.field("createPost",{
            type : "Post",
            args : {
                title : nonNull(stringArg()),
                description : nonNull(stringArg()),
                content : nonNull(stringArg()),
            },
            resolve : async (parent, args, context) => {
                const {title, description, content} = args;
                let newPost = await context.prisma.post.create({
                    data : {
                        title,
                        description,
                        content
                    },
                });
                return newPost;
            },
        });


    }
})