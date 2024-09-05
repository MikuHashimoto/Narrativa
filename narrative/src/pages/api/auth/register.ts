import { NextApiRequest, NextApiResponse } from "next";
import { hash } from "bcryptjs";
import { getUser } from "@/libs/getUser";
import prisma from "@/libs/prisma";
import { getJSTDate } from "@/libs/jstDate";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { name, email, password } = req.body;

        const finalName = name ? name : "名無し";

        // パスワードをハッシュ化
        try {
            const hashedPassword = await hash(password, 12);

            const existingUser = await getUser(email);
            if (existingUser) {
                return res.status(400).json({
                    message: '既に登録されているユーザーです。',
                });
            }

            const user = await prisma.user.create({
                data: {
                    name: finalName,
                    email,
                    password: hashedPassword,
                    created_at: getJSTDate()
                },
            });

            return res.status(201).json({ message: "アカウントを作成しました。", userId: user.id, user });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: "メールアドレスが既に使用されている可能性があります。" });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
