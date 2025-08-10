'use client';

import { useRouter } from 'next/navigation';
import styles from './myPage.module.scss';
import { signOut } from 'next-auth/react';

export default function MyPage(){
    const router = useRouter();
    
    const handleWithdrawalClick = () => {
        router.push('/my/withdrawal');
    };

    const handleLogout = async () => {
        try {
            await signOut({ 
                callbackUrl: '/', 
                redirect: true 
            });
        } catch (error) {
            console.error('로그아웃 에러:', error);
        }
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
                    
                    {/* 로그아웃 - 메뉴 아이템과 동일한 UI */}
                    <div className={styles.menu_item}>
                        <span className={styles.logout_text} onClick={handleLogout}>로그아웃</span>
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