import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';
import { GetServerSideProps } from 'next';
import prisma from '@/libs/prisma';
import { getSession } from 'next-auth/react';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);
    const { id } = context.query as { id: string };

    if (!session) {
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        };
    }

    const creationData = await prisma.creation.findUnique({
        where: { id },
    });

    if (!creationData || creationData.userId !== session.user.id) {
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
                title: creationData.title || '',
                deployLink: creationData.deploy_link || '',
                worldView: creationData.world_view || '',
            },
        },
    };
};

export default function Edit({ creation }: any) {
    const { data: session } = useSession();
    const router = useRouter();
    const { id } = router.query;

    const [title, setTitle] = useState<string>(creation.title);
    const [deployLink, setDeployLink] = useState<string>(creation.deployLink);
    const [worldView, setWorldView] = useState<string>(creation.worldView);

    useEffect(() => {
        setTitle(creation.title);
        setDeployLink(creation.deployLink);
        setWorldView(creation.worldView);
    }, [creation]);

    const onSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!session?.user?.id || !id) {
            return;
        }

        try {
            const response = await fetch('/api/world/edit', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    title,
                    worldView,
                    deployLink,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('保存に失敗しました:', errorText);
                return;
            }

            const result = await response.json();
            console.log('保存成功:', result);

            router.push(`/mypage/${session.user.id}`);
        } catch (error) {
            console.error('サーバーエラー:', error);
        }
    };

    const onDelete = async () => {
        if (!session?.user?.id || !id) {
            return;
        }

        try {
            const response = await fetch(`/api/world/delete?id=${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('削除に失敗しました:', errorText);
                return;
            }

            console.log('削除成功');
            router.push(`/mypage/${session.user.id}`);
        } catch (error) {
            console.error('サーバーエラー:', error);
        }
    };

    return (
        <Form onSubmit={onSave} className='my-3'>
            <Form.Group className="flex-lg-row mb-4">
                <Form.Label>タイトル</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="タイトル名を入力"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="flex-lg-row mb-4">
                <Form.Label>外部URL</Form.Label>
                <Form.Control
                    type="url"
                    placeholder="example.com"
                    value={deployLink}
                    onChange={(e) => setDeployLink(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="flex-lg-row mb-4">
                <Form.Label>世界観</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder="世界観の説明"
                    value={worldView}
                    onChange={(e) => setWorldView(e.target.value)}
                />
            </Form.Group>
            <div>
                <Button variant="danger" onClick={onDelete}>削除する</Button>
            </div>
            <div>
                <Button type="submit">保存</Button>
            </div>
        </Form>
    );
}
