import { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";
import Link from "next/link";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const { data: session } = useSession(); // セッション情報を取得
    const router = useRouter();

    const handleLogin = async () => {
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });

        if (res?.error) {
            console.log("Login failed", res.error);
        } else if (res?.ok) {
            // ログイン成功後、セッションからユーザーIDを取得する
            if (session?.user?.id) {
                router.push(`/mypage/${session.user.id}`);
            } else {
                // セッションからユーザーIDが取得できない場合
                console.log("User ID not found in session.");
            }
        }
    };

    return (
        <div className="container">
            <Form>
                <Form.Group className="mb-3" controlId="formGroupEmail">
                    <Form.Label>メールアドレス</Form.Label>
                    <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" required />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formGroupPassword">
                    <Form.Label>パスワード</Form.Label>
                    <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} placeholder="********" required />
                </Form.Group>
                <div className="mb-3">
                    <Link href={"/register"}>新規登録の方はこちら{">>"}</Link>
                </div>
                <Button onClick={handleLogin} className="">ログイン</Button>
            </Form>
        </div>
    );
}
