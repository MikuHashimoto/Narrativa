import Head from "next/head";
import localFont from "next/font/local";
import styles from "@/styles/Home.module.css";
import { Button } from "react-bootstrap";

const geistSans = localFont({
    src: "./fonts/GeistVF.woff",
    variable: "--font-geist-sans",
    weight: "100 900",
});
const geistMono = localFont({
    src: "./fonts/GeistMonoVF.woff",
    variable: "--font-geist-mono",
    weight: "100 900",
});

export default function Home() {
    return (
        <>
            <Head>
                <title>Narrativa</title>
            </Head>
            <div className={`${styles.page} ${geistSans.variable} ${geistMono.variable}`}>
                <main className={styles.main}>
                    <ol>
                        <li>
                            このサイトは創作支援サイトです
                        </li>
                        <li>
                            あなたが描く世界観、人物設定を簡単に整理することができます
                        </li>
                    </ol>

                    <div className={styles.ctas}>
                        <Button href="/login">
                            ログイン
                        </Button>
                        <Button href="/register">
                            新規登録
                        </Button>
                    </div>
                </main>
            </div>
        </>
    );
}
