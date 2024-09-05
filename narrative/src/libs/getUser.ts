import { prisma } from '@/libs/prisma';

export const getUser = async (email: string) => {
    try {
        const user = await prisma.user.findUnique({ where: { email } });

        return user;
    } catch (error) {
        return null;
    }
};
