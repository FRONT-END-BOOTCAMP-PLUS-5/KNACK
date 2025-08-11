'use client';

import styles from './userTest.module.scss';
import { useGlobalState } from '@/app/(user)/LayoutWrapper';
import { useEffect } from 'react';

export default function UserTestPage() {
  const { session, status, user, isLoading, error, fetchUserData, updateUserPoint, updateMarketingConsent } = useGlobalState();

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData(session.user.id);
    }
  }, [session, status, fetchUserData]);

  const handlePointUpdate = () => {
    if (user) {
      updateUserPoint(user.point + 100);
    }
  };

  const handleMarketingToggle = () => {
    if (user) {
      updateMarketingConsent(!user.marketing);
    }
  };

  if (status === 'loading' || isLoading) {
    return <div>로딩 중...</div>;
  }

  if (status === 'unauthenticated') {
    return <div>로그인이 필요합니다.</div>;
  }

  if (error) {
    return <div>에러: {error}</div>;
  }

  if (!user) {
    return <div>사용자 정보를 불러올 수 없습니다.</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>UserStore 테스트 페이지</h1>
      
      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>사용자 기본 정보</h2>
        <p><strong>ID:</strong> {user.id}</p>
        <p><strong>이름:</strong> {user.name}</p>
        <p><strong>이메일:</strong> {user.email}</p>
        <p><strong>닉네임:</strong> {user.nickname}</p>
        <p><strong>포인트:</strong> {user.point}점</p>
        <p><strong>마케팅 동의:</strong> {user.marketing ? '동의' : '미동의'}</p>
        <p><strong>SNS:</strong> {user.sns ? '사용' : '미사용'}</p>
        <p><strong>활성 상태:</strong> {user.isActive ? '활성' : '비활성'}</p>
        <p><strong>가입일:</strong> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
        {user.profileImage && (
          <div>
            <strong>프로필 이미지:</strong>
            <img src={user.profileImage} alt="프로필" style={{ width: '50px', height: '50px', borderRadius: '50%', marginLeft: '10px' }} />
          </div>
        )}
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>Store 액션 테스트</h2>
        <button 
          onClick={handlePointUpdate}
          style={{ 
            padding: '10px 15px', 
            marginRight: '10px', 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          포인트 +100 추가
        </button>
        
        <button 
          onClick={handleMarketingToggle}
          style={{ 
            padding: '10px 15px', 
            backgroundColor: '#28a745', 
            color: 'white', 
            border: 'none', 
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          마케팅 동의 {user.marketing ? '해제' : '동의'}
        </button>
      </div>

      <div style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
        <h2>NextAuth 세션 정보</h2>
        <p><strong>세션 상태:</strong> {status}</p>
        <p><strong>세션 사용자 ID:</strong> {session?.user?.id}</p>
        <p><strong>세션 사용자 이메일:</strong> {session?.user?.email}</p>
      </div>

      <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '5px', backgroundColor: '#f8f9fa' }}>
        <h2>사용법</h2>
        <p>다른 컴포넌트에서 이렇게 사용하세요:</p>
        <pre style={{ backgroundColor: '#e9ecef', padding: '10px', borderRadius: '3px' }}>
{`import { useUserStore } from '@/store/userStore';

function MyComponent() {
  const { user } = useUserStore();
  
  return (
    <div>
      <p>안녕하세요, {user?.name}님!</p>
      <p>포인트: {user?.point}점</p>
    </div>
  );
}`}
        </pre>
      </div>
    </div>
  );
}
