import prisma from '~/helpers/prisma';
import { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {

    const about: Prisma.AboutGetPayload<Prisma.AboutFindFirstArgs> | null = await prisma.about.findFirst();

    return {about};

})