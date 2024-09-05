import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/libs/prisma';
import { getJSTDate } from '@/libs/jstDate';

async function createNewRecord(title: string, worldView: string, deployLink: string, userId: string) {
    return await prisma.creation.create({
        data: {
            title,
            world_view: worldView,
            deploy_link: deployLink,
            userId,
            created_at: getJSTDate(),
        },
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        try {

            const { title, worldView, deployLink, userId } = req.body;
            const newRecord = await createNewRecord(title, worldView, deployLink, userId);

            return res.status(201).json({ message: 'レコードを作成しました。', record: newRecord });
        } catch (error) {
            console.error('レコード作成エラー:', error);
            return res.status(500).json({ error: 'サーバーエラーが発生しました。' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
