import prisma from '~/helpers/prisma';
import type { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {

    const orderById: {
        id: Prisma.SortOrder
    } = {
        id: 'asc',
    }

    const heroes: Prisma.HeroGetPayload<Prisma.HeroFindManyArgs>[] = await prisma.hero.findMany({
        orderBy: orderById
    });

    return {heroes};

})