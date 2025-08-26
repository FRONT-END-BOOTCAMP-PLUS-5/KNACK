import Text from '@/components/common/Text';
import Flex from '@/components/common/Flex';
import WebAssetOffSharpIcon from '@mui/icons-material/WebAssetOffSharp';

export default function NotFound() {
  return (
    <Flex paddingHorizontal={20} paddingVertical={100} direction="column" justify="center" align="center">
      <WebAssetOffSharpIcon sx={{ fontSize: 100, color: '#333' }} />
      <Text tag="h2" size={1.8} color="black1" weight={700} paddingTop={20}>
        페이지를 찾을 수 없습니다.
      </Text>
      <Text tag="p" size={1.4} color="gray5" paddingTop={20}>
        올바르지 않은 경로입니다. 다시 시도해주세요.
      </Text>
    </Flex>
  );
}
