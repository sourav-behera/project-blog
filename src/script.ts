
import { prisma } from "./context";
async function main(){
    // let post = await prisma.post.create({
    //     data : {
    //         title : "post 1",
    //         description : "post",
    //         content : "lorem"
    //     }
    // })
    // console.log(post);
    let temp = await prisma.post.findMany();
    console.log(temp)
}

main();