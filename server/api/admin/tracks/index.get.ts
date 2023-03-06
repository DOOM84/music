import prisma from '~/helpers/prisma';
import type {ITrack} from "~/types/interfaces";
import {Prisma} from "@prisma/client";

export default defineEventHandler(async (event) => {

    const orderById: {
        id: Prisma.SortOrder
    } = {
        id: 'asc',
    }

    const tracks: ITrack[] = await prisma.track.findMany({
        orderBy: orderById
    });

    return {tracks};

})