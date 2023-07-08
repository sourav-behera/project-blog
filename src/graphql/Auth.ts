import { objectType } from "nexus";


export const AuthPaylaod = objectType({
    name : "AuthPayload",
    definition(t){
        t.nonNull.string("token");
        t.nonNull.field("user", {
            type : "User"
        })
    }
})