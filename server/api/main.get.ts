import prisma from '~/helpers/prisma';
import type { Prisma } from '@prisma/client'
import {ITrack} from "~/types/interfaces";
//import { serverSupabaseServiceRole } from '#supabase/server';

export default defineEventHandler(async (event) => {

   // await new Promise(resolve => setTimeout(resolve, 5000));
   try {

    const orderById: {
        id: Prisma.SortOrder
    } = {
        id: 'desc',
    }

       const orderByIdAsc: {
           id: Prisma.SortOrder
       } = {
           id: 'asc',
       }

    const posts: Prisma.PostGetPayload<Prisma.PostFindManyArgs>[] = await prisma.post.findMany({
        where: {
            status: true
        },
        orderBy: orderById
    });

    const about: Prisma.AboutGetPayload<Prisma.AboutFindFirstArgs> | null = await prisma.about.findFirst();

    const tracks: ITrack[] = await prisma.track.findMany({
        where: {
            status: true
    },
        orderBy: orderByIdAsc
    });

    const heroes: Prisma.HeroGetPayload<Prisma.HeroFindManyArgs>[] = await prisma.hero.findMany({
        where: {
            status: true
        },
        orderBy: orderByIdAsc
    });

    const albums: Prisma.ReleaseGetPayload<Prisma.ReleaseFindManyArgs>[] = await prisma.release.findMany({
        where: {
            status: true
        },
        orderBy: orderById
    });

    return {posts, about, tracks, heroes, albums};

   }catch (e) {
       console.log(e);
   }

})