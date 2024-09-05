import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { Button, Form } from 'react-bootstrap';

export default function Create() {
    const { data: session } = useSession();
    const [title, setTitle] = useState<string>('');
    const [deployLink, setDeployLink] = useState<string>('');
    const [worldView, setWorldView] = useState<string>('');
    const router = useRouter();

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!session?.user?.id) {
            return;
        }

        try {
            const response = await fetch('/api/world/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    worldView,
                    deployLink,
                    userId: session.user.id,
                }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                console.error('作成に失敗しました:', errorText);
                return;
            }

            const result = await response.json();
            console.log('作成成功:', result);
            
            router.push(`/mypage/${session.user.id}`);
        } catch (error) {
            console.error('サーバーエラー:', error);
        }
    };

    return (
        <Form onSubmit={onSubmit}>
            <Form.Group className="flex-lg-row mb-4">
                <Form.Label>タイトル</Form.Label>
                <Form.Control
                    type="text"
                    placeholder="タイトル名を入力"
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />
            </Form.Group>
            <Form.Group className="flex-lg-row mb-4">
                <Form.Label>外部URL</Form.Label>
                <Form.Control
                    type="url"
                    placeholder="example.com"
                    onChange={(e) => setDeployLink(e.target.value)}
                />
            </Form.Group>
            <Form.Group className="flex-lg-row mb-4">
                <Form.Label>世界観</Form.Label>
                <Form.Control
                    as="textarea"
                    placeholder="世界観の説明"
                    onChange={(e) => setWorldView(e.target.value)}
                />
            </Form.Group>
            <Button href={`/mypage/${session?.user.id}`}>マイページに戻る</Button>
            <Button type="submit">作成</Button>
        </Form>
    );
}
