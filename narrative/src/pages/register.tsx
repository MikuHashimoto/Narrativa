import { useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { Button, Form } from "react-bootstrap";
import Link from "next/link";

export default function register() {
    const [name, setName] = useState<String>("");
    const [email, setEmail] = useState<String>("");
    const [password, setPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const router = useRouter();

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (password !== confirmPassword) {
            console.log("パスワードと確認用パスワードが一致していません。", true);
            return;
        }
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ name, email, password }),
            });

            if (!res.ok) {
                const errorText = await res.text();
                console.log("Signup failed:", errorText);
                return;
            }

            if (res.ok) {
                const result = await res.json();
                if (result && result.userId) { // result と userId の存在を確認
                    console.log("User created");

                    // サインインの処理
                    const signInResult = await signIn("credentials", {
                        redirect: false,
                        email,
                        password,
                    });

                    if (signInResult?.error) {
                        console.log("Login failed");
                    } else {
                        // アカウント作成後、ユーザーIDでページ遷移
                        router.push(`/mypage/${result.userId}`);
                    }
                } else {
                    console.log("ユーザーIDが取得できませんでした。");
                }
            } else {
                console.log("Signup failed");
            }
        } catch (error) {
            console.log("サーバーエラー:", error);
        }
    }

    return (
        <>
            <div className="container">
                <Form onSubmit={onSubmit}>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>ニックネーム</Form.Label>
                        <Form.Control type="text" onChange={(e) => setName(e.target.value)} placeholder="作者" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>メールアドレス</Form.Label>
                        <Form.Control type="email" onChange={(e) => setEmail(e.target.value)} placeholder="example@gmail.com" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>パスワード</Form.Label>
                        <Form.Control type="password" onChange={(e) => setPassword(e.target.value)} placeholder="********" required />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formGroupEmail">
                        <Form.Label>確認用パスワード</Form.Label>
                        <Form.Control type="password" onChange={(e) => setConfirmPassword(e.target.value)} placeholder="********" required />
                    </Form.Group>
                    <div className="mb-3">
                        <Link href={"/login"}>すでにアカウントをお持ちの方はこちら{">>"}</Link>
                    </div>
                    <Button type="submit" className="">アカウントを作成</Button>
                </Form>
            </div>
        </>
    );
};
