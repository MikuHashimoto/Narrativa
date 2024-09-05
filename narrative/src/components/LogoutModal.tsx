import React, { useState } from "react";
import { Button, CloseButton, Modal, Stack } from "react-bootstrap";
import { signOut } from "next-auth/react"; // 追加

export default function LogoutModal({ open, setOpen }: any) {
    // ログアウト処理
    async function logout() {
        await signOut({
            redirect: true, // ログアウト後にリダイレクトする
            callbackUrl: '/login' // リダイレクト先のURL
        });
        // モーダルを閉じる
        setOpen(false);
    }

    return (
        <Modal
            size="sm"
            show={open}
            onHide={() => setOpen(false)} // モーダルを閉じる
            keyboard={false}
        >
            <Modal.Header>
                <CloseButton onClick={() => setOpen(false)} /> {/* モーダルを閉じるためのボタン */}
            </Modal.Header>
            <Modal.Body>
                <p className="mx-auto">アカウントからログアウトしますか？</p>
                <Stack gap={4} direction="horizontal" className="mx-auto">
                    <Button variant="outline-danger" onClick={logout}>
                        ログアウトする
                    </Button>
                    <Button variant="outline-secondary" onClick={() => setOpen(false)}>
                        キャンセル
                    </Button>
                </Stack>
            </Modal.Body>
        </Modal>
    );
}
