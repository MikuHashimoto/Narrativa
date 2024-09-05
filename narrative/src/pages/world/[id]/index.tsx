import prisma from "@/libs/prisma";
import { error } from "console";
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/react"
import Link from "next/link";
import { Button, Card } from "react-bootstrap";

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const { id } = context.params as { id: string };

    const creationData = await prisma.creation.findUnique({
        where: { id: id, }
    })

    if (!creationData) {
        error('存在しないデータです')
        return {
            notFound: true,
        }
    }
    const personData = await prisma.person.findMany({
        where: { creationId: id, }
    })

    if (creationData?.userId !== session?.user.id) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    return {
        props: {
            creation: {
                id: creationData.id,
                title: creationData.title || '',
                view: creationData.world_view,
                url: creationData.deploy_link,
            },
            persons: personData.map(person => ({
                id: person.id,
                name: person.name || '',
                image: person.image,
            })),
            session,
        },
    };
}

const worldPage = ({ creation, persons, session }: any) => {
    return (
        <>
            <h1>{creation.title}</h1>
            <div>{creation.view}</div>
            <a className="" href={creation.url}>{creation.url}</a>
            <h2 className="mx-2">登場人物</h2>
            {persons.length === 0 ? (
                <div>まだ誰も作られていません</div>
            ) : (
                <div>
                    {persons.map((item: any) => (
                        <Card key={item.id} className="mb-3">
                            <Link href={`/world/${item.id}`}>
                                <Card.Body>
                                    <Card.Title>{item.name}</Card.Title>
                                </Card.Body>
                            </Link>
                        </Card>
                    ))}
                </div>
            )}
            <div>
                <Button className="mb-4" href={`/world/person/create`}>新しい登場人物を作成する</Button>
            </div>
            <div>
                <Button className="mb-4" href={`/world/${creation.id}/edit`}>編集する</Button>
            </div>
            <div>
                <Button className="mb-4" href={`/mypage/${session?.user.id}`}>マイページに戻る</Button>
            </div>
        </>
    )
}

export default worldPage;
