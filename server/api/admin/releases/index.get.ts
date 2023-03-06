import prisma from '~/helpers/prisma';
import type { Prisma } from '@prisma/client'

export default defineEventHandler(async (event) => {

    const releases: Prisma.ReleaseGetPayload<Prisma.ReleaseFindManyArgs>[] = await prisma.release.findMany();

    return {releases};

})