'use client';

import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import styles from './my_page.module.scss';

export default function MyPage(){
    const router = useRouter();
    const { data: session, status } = useSession();
    
    // 로그인 상태 확인
    useEffect(() => {
        if (status === 'loading') return; // 로딩 중이면 대기
        
        if (!session) {
            // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
            router.push('/login');
            return;
        }
    }, [session, status, router]);
    
    // 로딩 중이거나 로그인되지 않은 경우 로딩 표시
    if (status === 'loading' || !session) {
        return (
            <main className={styles.my_page}>
                <div className={styles.my_content}>
                    <div className={styles.loading}>로딩 중...</div>
                </div>
            </main>
        );
    }
    
    const handleWithdrawalClick = () => {
        router.push('/my/withdrawal');
    };
    
    return(
        <main className={styles.my_page}>
            <div className={styles.my_content}>
                <h1 className={styles.my_title}>마이페이지</h1>
                
                <div className={styles.menu_section}>
                    <div className={styles.menu_item}>
                        <span className={styles.menu_text}>내 정보</span>
                    </div>
                    <div className={styles.menu_item}>
                        <span className={styles.menu_text}>주문 내역</span>
                    </div>
                    <div className={styles.menu_item}>
                        <span className={styles.menu_text}>관심 상품</span>
                    </div>
                    <div className={styles.menu_item}>
                        <span className={styles.menu_text}>설정</span>
                    </div>
                    
                    {/* 회원탈퇴 버튼 */}
                    <div className={styles.withdrawal_section}>
                        <button 
                            className={styles.withdrawal_button}
                            onClick={handleWithdrawalClick}
                        >
                            회원탈퇴
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}