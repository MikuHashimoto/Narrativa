import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'PUT') {
        const { id, title, worldView, deployLink } = req.body;

        try {
            const updatedCreation = await prisma.creation.update({
                where: { id },
                data: {
                    title,
                    world_view: worldView,
                    deploy_link: deployLink,
                },
            });

            return res.status(200).json(updatedCreation);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: '更新に失敗しました。' });
        }
    } else {
        res.setHeader('Allow', ['PUT']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
