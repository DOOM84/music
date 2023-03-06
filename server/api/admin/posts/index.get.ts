import prisma from '~/helpers/prisma';
import type {IPost} from "~/types/interfaces";
import { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {

    const orderBy: {
        id?: Prisma.SortOrder
    } = {
        id: 'desc',
    }

    const posts: IPost[] = await prisma.post.findMany({
        orderBy: orderBy
    });

   // await prisma.$disconnect();

    return {posts};

})