import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'DELETE') {
        const { id } = req.query as { id: string };

        try {
            await prisma.creation.delete({
                where: { id },
            });

            return res.status(204).end();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: '削除に失敗しました。' });
        }
    } else {
        res.setHeader('Allow', ['DELETE']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
