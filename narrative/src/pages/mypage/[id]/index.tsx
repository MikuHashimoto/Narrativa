import LogoutModal from "@/components/LogoutModal";
import prisma from "@/libs/prisma";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Button, Card, Container } from "react-bootstrap";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const { id } = context.params as { id: string };

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    if (session.user.id !== id) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }
    const userData = await prisma.user.findUnique({
        where: {
            id: id,
        },
    });

    const creationData = await prisma.creation.findMany({
        where: {
            userId: id,
        },
    });

    if (!userData) {
        return {
            notFound: true,
        };
    }
    const formattedCreationData = creationData.map((creation) => ({
        ...creation,
        created_at: creation.created_at ? creation.created_at.toISOString() : null, // Date オブジェクトを ISO 文字列に変換
    }));

    return {
        props: {
            user: {
                id: userData.id,
                email: userData.email,
                name: userData.name,
            },
            creationData: formattedCreationData,
            session,
        },
    };
};

const Mypage = ({ creationData, user }: any) => {
    const [openModal, setOpenModal] = useState(false);

    return (
        <Container>
            <div>{user.name}</div>
            {creationData.length === 0 ? (
                <div>まだ何も作られていません</div>
            ) : (
                <div>
                    {creationData.map((item: any) => (
                        <Card key={item.id} className="mb-3">
                            <Link href={`/world/${item.id}`}>
                                <Card.Body>
                                    <Card.Title>{item.title}</Card.Title>
                                    <Card.Text>{item.world_view}</Card.Text>
                                </Card.Body>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
            <Button href="/world/create" className="mb-3">新しく世界設定を作成する</Button>
            <div className="mb-3">
                <Button onClick={() => setOpenModal(true)}>ログアウト</Button>
            </div>
            <LogoutModal
                open={openModal}
                setOpen={setOpenModal}
            />
        </Container>
    )
}

export default Mypage;
